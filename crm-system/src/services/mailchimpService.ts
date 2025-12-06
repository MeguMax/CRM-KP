export const mailchimpService = {
    async addSubscriber(email: string, firstName: string, lastName: string) {
        try {
            // Mailchimp API напряму через fetch
            const response = await fetch(`https://${process.env.REACT_APP_MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`anystring:${process.env.REACT_APP_MAILCHIMP_API_KEY}`)}`
                },
                body: JSON.stringify({
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Mailchimp error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Mailchimp subscription error:', error);
            throw error;
        }
    },

    async getAudienceStats() {
        try {
            const response = await fetch(`https://${process.env.REACT_APP_MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID}`, {
                headers: {
                    'Authorization': `Basic ${btoa(`anystring:${process.env.REACT_APP_MAILCHIMP_API_KEY}`)}`
                }
            });

            if (!response.ok) {
                throw new Error(`Mailchimp error: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                totalSubscribers: data.stats.member_count,
                openRate: data.stats.open_rate
            };
        } catch (error) {
            console.error('Mailchimp stats error:', error);
            throw error;
        }
    }
};