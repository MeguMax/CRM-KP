import authReducer, {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
} from './authSlice';

describe('authSlice', () => {
    const initialState = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    };

    test('should return initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual({
            ...initialState,
            token: null, // localStorage может вернуть null в тестах
        });
    });

    test('loginStart sets loading to true', () => {
        const state = authReducer(initialState, loginStart());
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    test('loginSuccess sets user and token', () => {
        const user = { id: '1', email: 'test@test.com', name: 'Test User' };
        const token = 'test-token-123';

        const state = authReducer(initialState, loginSuccess({ user, token }));

        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(user);
        expect(state.token).toBe(token);
        expect(state.error).toBe(null);
    });

    test('loginFailure sets error message', () => {
        const errorMessage = 'Invalid credentials';
        const state = authReducer(initialState, loginFailure(errorMessage));

        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe(errorMessage);
    });

    test('logout clears user and token', () => {
        const authenticatedState = {
            user: { id: '1', email: 'test@test.com', name: 'Test User' },
            token: 'test-token',
            isAuthenticated: true,
            loading: false,
            error: null,
        };

        const state = authReducer(authenticatedState, logout());

        expect(state.user).toBe(null);
        expect(state.token).toBe(null);
        expect(state.isAuthenticated).toBe(false);
    });

    test('clearError removes error message', () => {
        const stateWithError = {
            ...initialState,
            error: 'Some error',
        };

        const state = authReducer(stateWithError, clearError());
        expect(state.error).toBe(null);
    });
});
