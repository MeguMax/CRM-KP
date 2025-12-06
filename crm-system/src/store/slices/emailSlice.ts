import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { localStorageService } from '../../utils/localStorage';
import { apiService } from '../../services/apiService';

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    createdAt: string;
}

interface EmailState {
    templates: EmailTemplate[];
    sentEmails: any[];
    loading: boolean;
    error: string | null;
}

const initialState: EmailState = {
    templates: localStorageService.loadEmailTemplates(),
    sentEmails: [],
    loading: false,
    error: null,
};

// Асинхронні дії для email
export const fetchEmailTemplates = createAsyncThunk(
    'email/fetchEmailTemplates',
    async () => {
        // Поки використовуємо локальне сховище, потім замінимо на API
        return localStorageService.loadEmailTemplates();
    }
);

export const createEmailTemplate = createAsyncThunk(
    'email/createEmailTemplate',
    async (templateData: Omit<EmailTemplate, 'id' | 'createdAt'>) => {
        // Поки використовуємо локальне сховище
        const newTemplate: EmailTemplate = {
            ...templateData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        const currentTemplates = localStorageService.loadEmailTemplates();
        const updatedTemplates = [...currentTemplates, newTemplate];
        localStorageService.saveEmailTemplates(updatedTemplates);
        return newTemplate;
    }
);

export const updateEmailTemplate = createAsyncThunk(
    'email/updateEmailTemplate',
    async (templateData: EmailTemplate) => {
        const currentTemplates = localStorageService.loadEmailTemplates();
        const updatedTemplates = currentTemplates.map(template =>
            template.id === templateData.id ? templateData : template
        );
        localStorageService.saveEmailTemplates(updatedTemplates);
        return templateData;
    }
);

export const deleteEmailTemplate = createAsyncThunk(
    'email/deleteEmailTemplate',
    async (templateId: string) => {
        const currentTemplates = localStorageService.loadEmailTemplates();
        const updatedTemplates = currentTemplates.filter(template => template.id !== templateId);
        localStorageService.saveEmailTemplates(updatedTemplates);
        return templateId;
    }
);

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        // Синхронні редюсери
        setTemplates: (state, action: PayloadAction<EmailTemplate[]>) => {
            state.templates = action.payload;
            localStorageService.saveEmailTemplates(action.payload);
        },
        addTemplate: (state, action: PayloadAction<EmailTemplate>) => {
            state.templates.push(action.payload);
            localStorageService.saveEmailTemplates(state.templates);
        },
        updateTemplate: (state, action: PayloadAction<EmailTemplate>) => {
            const index = state.templates.findIndex(template => template.id === action.payload.id);
            if (index !== -1) {
                state.templates[index] = action.payload;
                localStorageService.saveEmailTemplates(state.templates);
            }
        },
        removeTemplate: (state, action: PayloadAction<string>) => {
            state.templates = state.templates.filter(template => template.id !== action.payload);
            localStorageService.saveEmailTemplates(state.templates);
        },
        addSentEmail: (state, action: PayloadAction<any>) => {
            state.sentEmails.push(action.payload);
        },
        clearSentEmails: (state) => {
            state.sentEmails = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchEmailTemplates
            .addCase(fetchEmailTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload;
            })
            .addCase(fetchEmailTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch email templates';
            })
            // createEmailTemplate
            .addCase(createEmailTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmailTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.templates.push(action.payload);
            })
            .addCase(createEmailTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create email template';
            })
            // updateEmailTemplate
            .addCase(updateEmailTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmailTemplate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.templates.findIndex(template => template.id === action.payload.id);
                if (index !== -1) {
                    state.templates[index] = action.payload;
                }
            })
            .addCase(updateEmailTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update email template';
            })
            // deleteEmailTemplate
            .addCase(deleteEmailTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmailTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = state.templates.filter(template => template.id !== action.payload);
            })
            .addCase(deleteEmailTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete email template';
            });
    },
});

export const {
    setTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    addSentEmail,
    clearSentEmails
} = emailSlice.actions;
export default emailSlice.reducer;