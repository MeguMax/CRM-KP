const STORAGE_KEYS = {
    CLIENTS: 'crm_clients',
    DEALS: 'crm_deals',
    EMAIL_TEMPLATES: 'crm_email_templates'
};

export const localStorageService = {
    // Збереження даних
    saveClients(clients: any[]) {
        try {
            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        } catch (error) {
            console.error('Failed to save clients to localStorage:', error);
        }
    },

    saveDeals(deals: any[]) {
        try {
            localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
        } catch (error) {
            console.error('Failed to save deals to localStorage:', error);
        }
    },

    saveEmailTemplates(templates: any[]) {
        try {
            localStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(templates));
        } catch (error) {
            console.error('Failed to save email templates to localStorage:', error);
        }
    },

    // Завантаження даних
    loadClients(): any[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load clients from localStorage:', error);
            return [];
        }
    },

    loadDeals(): any[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.DEALS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load deals from localStorage:', error);
            return [];
        }
    },

    loadEmailTemplates(): any[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load email templates from localStorage:', error);
            return [];
        }
    },

    // Очищення даних
    clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEYS.CLIENTS);
            localStorage.removeItem(STORAGE_KEYS.DEALS);
            localStorage.removeItem(STORAGE_KEYS.EMAIL_TEMPLATES);
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    },

    // Очищення конкретних даних
    clearClients() {
        try {
            localStorage.removeItem(STORAGE_KEYS.CLIENTS);
        } catch (error) {
            console.error('Failed to clear clients from localStorage:', error);
        }
    },

    clearDeals() {
        try {
            localStorage.removeItem(STORAGE_KEYS.DEALS);
        } catch (error) {
            console.error('Failed to clear deals from localStorage:', error);
        }
    },

    clearEmailTemplates() {
        try {
            localStorage.removeItem(STORAGE_KEYS.EMAIL_TEMPLATES);
        } catch (error) {
            console.error('Failed to clear email templates from localStorage:', error);
        }
    }
};