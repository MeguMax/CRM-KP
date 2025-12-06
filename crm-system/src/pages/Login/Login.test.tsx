import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from './Login';
import authReducer from '../../store/slices/authSlice';

// Создаем mock store для тестов
const createMockStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            clients: (state = { clients: [] }) => state,
            pipeline: (state = { deals: [] }) => state,
            email: (state = { subscribers: [] }) => state,
        },
    });
};

// Wrapper для тестов с Provider и Router
const renderWithProviders = (component: React.ReactElement) => {
    const store = createMockStore();
    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('Login Component', () => {
    test('renders login form with email and password fields', () => {
        renderWithProviders(<Login />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('displays CRM System title', () => {
        renderWithProviders(<Login />);

        expect(screen.getByText('CRM System')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    test('has link to register page', () => {
        renderWithProviders(<Login />);

        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/register here/i)).toBeInTheDocument();
    });

    test('shows error when submitting empty form', async () => {
        renderWithProviders(<Login />);

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
        });
    });
});
