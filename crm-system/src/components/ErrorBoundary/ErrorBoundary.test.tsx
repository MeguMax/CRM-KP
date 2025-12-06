import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Компонент который выбрасывает ошибку
const ThrowError = () => {
    throw new Error('Test error');
};

// Нормальный компонент
const NormalComponent = () => <div>Normal Content</div>;

describe('ErrorBoundary', () => {
    // Подавляем console.error для чистоты тестов
    const originalError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalError;
    });

    test('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <NormalComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Normal Content')).toBeInTheDocument();
    });

    test('renders error UI when child component throws', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /go to home/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });

    test('displays error message in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        (process.env as any).NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/error details/i)).toBeInTheDocument();
        expect(screen.getByText(/test error/i)).toBeInTheDocument();

        (process.env as any).NODE_ENV = originalEnv;
    });
});
