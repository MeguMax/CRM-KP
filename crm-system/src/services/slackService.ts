export const slackService = {
    async sendMessage(text: string, channel: string = '#general') {
        try {
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
                throw new Error(`Slack error: ${data.error}`);
            }

            return data;
        } catch (error) {
            console.error('Slack message error:', error);
            throw error;
        }
    },

    async sendDealNotification(deal: any, client: any) {
        const message = {
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
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'View Details'
                            },
                            url: `${window.location.origin}/pipeline`
                        }
                    ]
                }
            ]
        };

        return this.sendMessage(message.text, message.channel);
    },

    async sendClientNotification(client: any, action: string = 'added') {
        const message = `👤 Client ${action}: ${client.name} (${client.company}) - ${client.email}`;
        return this.sendMessage(message, '#crm-clients');
    }
};