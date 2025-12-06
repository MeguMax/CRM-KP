import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { localStorageService } from '../../utils/localStorage';
import { apiService } from '../../services/apiService';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface ClientsState {
    clients: Client[];
    loading: boolean;
    error: string | null;
}

const initialState: ClientsState = {
    clients: localStorageService.loadClients(),
    loading: false,
    error: null,
};

// Асинхронні дії
export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async () => {
        const response = await apiService.getClients();
        return response;
    }
);

export const createClient = createAsyncThunk(
    'clients/createClient',
    async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
        const response = await apiService.createClient(clientData);
        return response;
    }
);

export const updateClient = createAsyncThunk(
    'clients/updateClient',
    async (clientData: Client) => {
        const response = await apiService.updateClient(clientData.id, clientData);
        return response;
    }
);

export const deleteClient = createAsyncThunk(
    'clients/deleteClient',
    async (clientId: string) => {
        await apiService.deleteClient(clientId);
        return clientId;
    }
);

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        // Синхронні редюсери для локального використання
        setClients: (state, action: PayloadAction<Client[]>) => {
            state.clients = action.payload;
            localStorageService.saveClients(action.payload);
        },
        addClient: (state, action: PayloadAction<Client>) => {
            state.clients.push(action.payload);
            localStorageService.saveClients(state.clients);
        },
        updateClientLocal: (state, action: PayloadAction<Client>) => {
            const index = state.clients.findIndex(client => client.id === action.payload.id);
            if (index !== -1) {
                state.clients[index] = action.payload;
                localStorageService.saveClients(state.clients);
            }
        },
        removeClient: (state, action: PayloadAction<string>) => {
            state.clients = state.clients.filter(client => client.id !== action.payload);
            localStorageService.saveClients(state.clients);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchClients
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
                localStorageService.saveClients(action.payload);
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch clients';
            })
            // createClient
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.push(action.payload);
                localStorageService.saveClients(state.clients);
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create client';
            })
            // updateClient
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.clients.findIndex(client => client.id === action.payload.id);
                if (index !== -1) {
                    state.clients[index] = action.payload;
                    localStorageService.saveClients(state.clients);
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update client';
            })
            // deleteClient
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = state.clients.filter(client => client.id !== action.payload);
                localStorageService.saveClients(state.clients);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete client';
            });
    },
});

export const {
    setClients,
    addClient,
    updateClientLocal,
    removeClient,
    clearError
} = clientsSlice.actions;
export default clientsSlice.reducer;