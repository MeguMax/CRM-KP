// интеграция Slack API
export const notificationService = {
    async sendMessage(text: string, channel: string = '#general') {
        try {
            // Slack API
            if (process.env.REACT_APP_SLACK_BOT_TOKEN) {
                const response = await fetch('https://slack.com/api/chat.postMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_SLACK_BOT_TOKEN}`
                    },
                    body: JSON.stringify({
                        channel,
                        text,
                        username: 'CRM System',
                        icon_emoji: ':robot_face:'
                    })
                });

                const data = await response.json();

                if (!data.ok) {
                    throw new Error(`Slack API error: ${data.error}`);
                }

                return data;
            }
            // Incoming Webhooks
            else if (process.env.REACT_APP_SLACK_WEBHOOK_URL) {
                const response = await fetch(process.env.REACT_APP_SLACK_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text })
                });

                return await response.json();
            }
            // Демо-режим
            else {
                return this.sendDemoMessage(text);
            }
        } catch (error) {
            console.error('Notification error:', error);
            // В случае ошибки сохраняем в демо-режим
            return this.sendDemoMessage(text);
        }
    },

    async sendDemoMessage(text: string) {
        const messages = JSON.parse(localStorage.getItem('crm_notifications') || '[]');
        const newMessage = {
            text,
            type: 'demo',
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        messages.push(newMessage);
        localStorage.setItem('crm_notifications', JSON.stringify(messages));

        console.log('💬 Notification (demo):', newMessage);

        return {
            ok: true,
            message: newMessage,
            demo: true
        };
    },

    async sendRichMessage(payload: any) {
        try {
            if (process.env.REACT_APP_SLACK_BOT_TOKEN) {
                const response = await fetch('https://slack.com/api/chat.postMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_SLACK_BOT_TOKEN}`
                    },
                    body: JSON.stringify(payload)
                });

                return await response.json();
            } else {
                // Для простих webhook відправка тексту
                const text = this.extractTextFromBlocks(payload);
                return this.sendMessage(text);
            }
        } catch (error) {
            console.error('Rich message error:', error);
            return this.sendDemoMessage('Rich notification: ' + JSON.stringify(payload));
        }
    },

    extractTextFromBlocks(payload: any): string {
        if (payload.text) return payload.text;

        let text = '';
        if (payload.blocks) {
            payload.blocks.forEach((block: any) => {
                if (block.text && block.text.text) {
                    text += block.text.text + '\n';
                }
            });
        }
        return text || 'Notification from CRM';
    },

    async sendDealNotification(deal: any, client: any) {
        const richMessage = {
            channel: '#crm-deals',
            text: `🎯 New Deal Created: ${deal.title}`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '🎯 New Deal Created'
                    }
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Deal:*\n${deal.title}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Value:*\n$${deal.value.toLocaleString()}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Client:*\n${client.name}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Stage:*\n${deal.stage}`
                        }
                    ]
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `Expected close: ${new Date(deal.expectedCloseDate).toLocaleDateString()}`
                        }
                    ]
                }
            ]
        };

        return this.sendRichMessage(richMessage);
    },

    async sendClientNotification(client: any, action: string = 'added') {
        const message = {
            channel: '#crm-clients',
            text: `👤 Client ${action}: ${client.name} (${client.company})`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `👤 *Client ${action}*\n*Name:* ${client.name}\n*Company:* ${client.company}\n*Email:* ${client.email}${client.phone ? `\n*Phone:* ${client.phone}` : ''}`
                    }
                }
            ]
        };

        return this.sendRichMessage(message);
    },

    // отримати історію повідемолень (для демо-режима)
    getNotificationHistory() {
        try {
            return JSON.parse(localStorage.getItem('crm_notifications') || '[]');
        } catch {
            return [];
        }
    },

    // отримати список підписників
    getSubscribers() {
        try {
            return JSON.parse(localStorage.getItem('crm_subscribers') || '[]');
        } catch {
            return [];
        }
    }
};