import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import clientsReducer from './slices/clientsSlice';
import pipelineReducer from './slices/pipelineSlice';
import emailReducer from './slices/emailSlice';
import authReducer from './slices/authSlice';

// Конфигурация persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'clients', 'pipeline'], // Что сохранять в localStorage
};

// Объединяем reducers
const rootReducer = combineReducers({
    auth: authReducer,
    clients: clientsReducer,
    pipeline: pipelineReducer,
    email: emailReducer,
});

// Создаем persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Создаем store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Игнорируем redux-persist actions
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
