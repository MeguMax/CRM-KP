import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { localStorageService } from '../../utils/localStorage';
import { apiService } from '../../services/apiService';

export interface Deal {
    id: string;
    title: string;
    value: number;
    stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed';
    clientId: string;
    expectedCloseDate: string;
    createdAt: string;
}

interface PipelineState {
    deals: Deal[];
    loading: boolean;
    error: string | null;
}

const initialState: PipelineState = {
    deals: localStorageService.loadDeals(),
    loading: false,
    error: null,
};

// Асинхронні дії
export const fetchDeals = createAsyncThunk(
    'pipeline/fetchDeals',
    async () => {
        const response = await apiService.getDeals();
        return response;
    }
);

export const createDeal = createAsyncThunk(
    'pipeline/createDeal',
    async (dealData: Omit<Deal, 'id' | 'createdAt'>) => {
        const response = await apiService.createDeal(dealData);
        return response;
    }
);

export const updateDeal = createAsyncThunk(
    'pipeline/updateDeal',
    async (dealData: Deal) => {
        const response = await apiService.updateDeal(dealData.id, dealData);
        return response;
    }
);

export const deleteDeal = createAsyncThunk(
    'pipeline/deleteDeal',
    async (dealId: string) => {
        await apiService.deleteDeal(dealId);
        return dealId;
    }
);

const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        // Синхронні редюсери для локального використання
        setDeals: (state, action: PayloadAction<Deal[]>) => {
            state.deals = action.payload;
            localStorageService.saveDeals(action.payload);
        },
        addDeal: (state, action: PayloadAction<Deal>) => {
            state.deals.push(action.payload);
            localStorageService.saveDeals(state.deals);
        },
        updateDealLocal: (state, action: PayloadAction<Deal>) => {
            const index = state.deals.findIndex(deal => deal.id === action.payload.id);
            if (index !== -1) {
                state.deals[index] = action.payload;
                localStorageService.saveDeals(state.deals);
            }
        },
        removeDeal: (state, action: PayloadAction<string>) => {
            state.deals = state.deals.filter(deal => deal.id !== action.payload);
            localStorageService.saveDeals(state.deals);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchDeals
            .addCase(fetchDeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = action.payload;
                localStorageService.saveDeals(action.payload);
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch deals';
            })
            // createDeal
            .addCase(createDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.deals.push(action.payload);
                localStorageService.saveDeals(state.deals);
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create deal';
            })
            // updateDeal
            .addCase(updateDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.deals.findIndex(deal => deal.id === action.payload.id);
                if (index !== -1) {
                    state.deals[index] = action.payload;
                    localStorageService.saveDeals(state.deals);
                }
            })
            .addCase(updateDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update deal';
            })
            // deleteDeal
            .addCase(deleteDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = state.deals.filter(deal => deal.id !== action.payload);
                localStorageService.saveDeals(state.deals);
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete deal';
            });
    },
});

export const { setDeals, addDeal, updateDealLocal, removeDeal } = pipelineSlice.actions;
export default pipelineSlice.reducer;