import { authService } from './authService';

// Mock fetch
global.fetch = jest.fn();

describe('authService', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    describe('login', () => {
        test('successfully logs in user', async () => {
            const mockResponse = {
                success: true,
                token: 'test-token',
                user: { id: '1', email: 'test@test.com', name: 'Test User' },
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await authService.login('test@test.com', '123456');

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
                })
            );

            expect(result).toEqual(mockResponse);
        });

        test('throws error on failed login', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Invalid credentials' }),
            });

            await expect(
                authService.login('wrong@test.com', 'wrong')
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        test('successfully registers user', async () => {
            const mockResponse = {
                success: true,
                token: 'test-token',
                user: { id: '1', email: 'new@test.com', name: 'New User' },
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await authService.register('New User', 'new@test.com', '123456');

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/register'),
                expect.objectContaining({
                    method: 'POST',
                })
            );

            expect(result).toEqual(mockResponse);
        });
    });
});
