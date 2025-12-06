import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Логируем ошибку (в production можно отправлять на сервер мониторинга)
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // В production можно отправить ошибку на сервер (например, Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        // Перезагружаем страницу
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 2,
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            maxWidth: 600,
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

                        <Typography variant="h4" gutterBottom>
                            Oops! Something went wrong
                        </Typography>

                        <Typography variant="body1" color="text.secondary" paragraph>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </Typography>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mt: 3,
                                    mb: 3,
                                    textAlign: 'left',
                                    backgroundColor: '#f5f5f5',
                                    maxHeight: 300,
                                    overflow: 'auto',
                                }}
                            >
                                <Typography variant="subtitle2" color="error" gutterBottom>
                                    Error Details (Development Mode):
                                </Typography>
                                <Typography variant="body2" component="pre" sx={{ fontSize: 12 }}>
                                    {this.state.error.toString()}
                                </Typography>
                                {this.state.errorInfo && (
                                    <Typography variant="body2" component="pre" sx={{ fontSize: 11, mt: 1 }}>
                                        {this.state.errorInfo.componentStack}
                                    </Typography>
                                )}
                            </Paper>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleReset}
                                size="large"
                            >
                                Go to Home
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => window.location.reload()}
                                size="large"
                            >
                                Reload Page
                            </Button>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
                            If this problem persists, please contact support.
                        </Typography>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
