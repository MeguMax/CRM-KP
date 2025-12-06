const { WebClient } = require('@slack/web-api');

class SlackService {
    constructor() {
        this.client = null;
        this.initializeClient();
    }

    initializeClient() {
        if (process.env.SLACK_BOT_TOKEN) {
            this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
            console.log('✅ Slack client initialized with token:', process.env.SLACK_BOT_TOKEN.substring(0, 15) + '...');
        } else {
            console.warn('⚠️ Slack bot token not found - Slack service disabled');
        }
    }

    async sendMessage(text, channel = '#general') {
        if (!this.client) {
            throw new Error('Slack service not configured. Check SLACK_BOT_TOKEN in .env');
        }

        try {
            console.log('💬 Attempting to send Slack message to channel:', channel);
            console.log('📝 Message:', text.substring(0, 50) + '...');

            const result = await this.client.chat.postMessage({
                channel,
                text,
                username: 'CRM System',
                icon_emoji: ':robot_face:'
            });

            console.log('✅ Slack message sent successfully to channel:', channel);
            return {
                success: true,
                ts: result.ts,
                channel: result.channel
            };
        } catch (error) {
            console.error('❌ Slack message failed:', error);

            if (error.data) {
                const slackError = error.data.error;

                if (slackError === 'channel_not_found') {
                    throw new Error(`Slack channel '${channel}' not found. Make sure the channel exists.`);
                } else if (slackError === 'not_in_channel') {
                    throw new Error(`Bot is not in channel '${channel}'. Invite the bot with /invite @CRM_System`);
                } else if (slackError === 'invalid_auth' || slackError === 'token_revoked') {
                    throw new Error('Invalid or revoked Slack bot token. Check SLACK_BOT_TOKEN in .env');
                } else if (slackError === 'missing_scope') {
                    throw new Error('Bot missing required OAuth scopes. Add chat:write scope in Slack App settings.');
                } else {
                    throw new Error(`Slack API error: ${slackError}`);
                }
            }

            throw new Error(`Failed to send Slack message: ${error.message}`);
        }
    }

    async sendRichMessage(blocks, channel, fallbackText = 'CRM System Notification') {
        if (!this.client) {
            throw new Error('Slack service not configured');
        }

        try {
            console.log('💬 Sending rich Slack message to:', channel);

            const result = await this.client.chat.postMessage({
                channel,
                text: fallbackText,  // ✅ ДОБАВЛЕНО! Для уведомлений и screen readers
                blocks,
                username: 'CRM System',
                icon_emoji: ':robot_face:'
            });

            console.log('✅ Slack rich message sent successfully to:', channel);
            return {
                success: true,
                ts: result.ts,
                channel: result.channel
            };
        } catch (error) {
            console.error('❌ Slack rich message failed:', error);

            if (error.data && error.data.error === 'invalid_blocks') {
                console.warn('⚠️ Invalid blocks format, trying simple message...');
                const simpleText = this.blocksToText(blocks);
                return this.sendMessage(simpleText, channel);
            }

            throw new Error(`Failed to send Slack rich message: ${error.message}`);
        }
    }

    blocksToText(blocks) {
        let text = '';
        blocks.forEach(block => {
            if (block.text && block.text.text) {
                text += block.text.text + '\n';
            }
            if (block.fields) {
                block.fields.forEach(field => {
                    if (field.text) {
                        text += field.text + '\n';
                    }
                });
            }
        });
        return text || 'Notification from CRM System';
    }

    async sendClientNotification(client, action = 'added') {
        // ✅ ИСПРАВЛЕНО: используем переменную из .env или дефолт
        const channel = process.env.SLACK_CHANNEL || '#crm-clients';
        const fallbackText = `👤 Client ${action}: ${client.name} (${client.email})`;

        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `👤 Client ${action.charAt(0).toUpperCase() + action.slice(1)}`
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Name:*\n${client.name}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Email:*\n${client.email}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Company:*\n${client.company || 'Not specified'}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Status:*\n${client.status}`
                    }
                ]
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `🕒 ${new Date().toLocaleString()}`
                    }
                ]
            }
        ];

        return this.sendRichMessage(blocks, channel, fallbackText);
    }

    async sendDealNotification(deal, client) {
        // ✅ ИСПРАВЛЕНО: используем переменную из .env или дефолт
        const channel = process.env.SLACK_CHANNEL || '#crm-deals';
        const fallbackText = `🎯 New Deal Created: ${deal.title} - $${deal.value.toLocaleString()}`;

        const blocks = [
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
        ];

        return this.sendRichMessage(blocks, channel, fallbackText);
    }

    async testConnection() {
        if (!this.client) {
            return {
                connected: false,
                error: 'Slack service not configured. Check SLACK_BOT_TOKEN in .env'
            };
        }

        try {
            console.log('🔍 Testing Slack connection...');
            const result = await this.client.auth.test();

            console.log('✅ Slack connection successful!');
            console.log('   Team:', result.team);
            console.log('   User:', result.user);

            return {
                connected: true,
                team: result.team,
                user: result.user,
                url: result.url,
                bot_id: result.bot_id
            };
        } catch (error) {
            console.error('❌ Slack connection test failed:', error.message);

            return {
                connected: false,
                error: error.data ? error.data.error : error.message
            };
        }
    }
}

module.exports = new SlackService();
