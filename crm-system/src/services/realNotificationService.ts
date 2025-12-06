// services/realNotificationService.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'crm-system-secure-api-key-2024';

export const realNotificationService = {
    async sendMessage(text: string, channel: string = '#general') {
        try {
            console.log('💬 Sending Slack message via real service:', text.substring(0, 50) + '...');

            const response = await fetch(`${API_BASE_URL}/slack/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ text, channel })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to send Slack message`);
            }

            const result = await response.json();
            console.log('✅ Slack message sent successfully via real service');
            return result;
        } catch (error) {
            console.error('❌ Real notification service error:', error);

            // Type-safe error handling
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while sending Slack message');
            }
        }
    },

    async sendClientNotification(client: any, action: string = 'added') {
        try {
            const response = await fetch(`${API_BASE_URL}/slack/client-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ client, action })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to send client notification`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Real notification service error:', error);

            // Type-safe error handling
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while sending client notification');
            }
        }
    },

    async sendDealNotification(deal: any, client: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/slack/deal-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ deal, client })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to send deal notification`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Real notification service error:', error);

            // Type-safe error handling
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while sending deal notification');
            }
        }
    },

    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/slack/test`, {
                headers: {
                    'x-api-key': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Slack test failed`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Slack connection test failed:', error);

            // Type-safe error handling with proper typing
            return {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown connection error'
            };
        }
    }
};