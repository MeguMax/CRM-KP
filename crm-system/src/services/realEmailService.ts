// services/realEmailService.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'crm-system-secure-api-key-2024';

export const realEmailService = {
    async addSubscriber(email: string, firstName: string, lastName: string) {
        try {
            console.log('📧 Adding subscriber via real email service:', email);

            const response = await fetch(`${API_BASE_URL}/email/welcome`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    company: '',
                    status: 'active'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to add subscriber`);
            }

            const result = await response.json();
            console.log('✅ Subscriber added successfully via real email service');
            return result;
        } catch (error) {
            console.error('❌ Real email service error:', error);

            // Type-safe error handling
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while adding subscriber');
            }
        }
    },

    async sendEmail(to: string, subject: string, html: string) {
        console.log('🔍 Debug - Sending email to:', to);
        console.log('🔍 Debug - API URL:', `${API_BASE_URL}/email/send`);
        console.log('🔍 Debug - API Key exists:', !!API_KEY);

        try {
            const response = await fetch(`${API_BASE_URL}/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ to, subject, html })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to send email`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Real email service error:', error);

            // Type-safe error handling
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while sending email');
            }
        }
    },

    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/email/test`, {
                headers: {
                    'x-api-key': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Email test failed`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Email connection test failed:', error);

            // Type-safe error handling with proper typing
            return {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown connection error'
            };
        }
    }
};