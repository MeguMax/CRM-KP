import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import authReducer from '../../store/slices/authSlice';

const createMockStore = (isAuthenticated: boolean) => {
    return configureStore({
        reducer: {
            auth: () => ({
                user: isAuthenticated ? { id: '1', name: 'Test', email: 'test@test.com' } : null,
                token: isAuthenticated ? 'test-token' : null,
                isAuthenticated,
                loading: false,
                error: null,
            }),
            clients: (state = { clients: [] }) => state,
            pipeline: (state = { deals: [] }) => state,
            email: (state = { subscribers: [] }) => state,
        },
    });
};

describe('ProtectedRoute', () => {
    test('renders children when authenticated', () => {
        const store = createMockStore(true);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to login when not authenticated', () => {
        const store = createMockStore(false);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});
