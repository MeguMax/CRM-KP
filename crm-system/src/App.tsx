import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Eager loading для критичных компонентов
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// ✅ Lazy loading для остальных страниц
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Clients = lazy(() => import('./pages/Clients/Clients'));
const Pipeline = lazy(() => import('./pages/Pipeline/Pipeline'));
const EmailAutomation = lazy(() => import('./pages/EmailAutomation/EmailAutomation'));
const IntegrationDemo = lazy(() => import('./pages/IntegrationDemo/IntegrationDemo'));

// Loading компонент
const LoadingFallback = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
        }}
    >
        <CircularProgress size={60} />
    </Box>
);

function App() {
    useEffect(() => {
        console.log('=== CRM ENVIRONMENT VARIABLES CHECK ===');
        console.log('SLACK_BOT_TOKEN exists:', !!process.env.REACT_APP_SLACK_BOT_TOKEN);
        console.log('SLACK_BOT_TOKEN length:', process.env.REACT_APP_SLACK_BOT_TOKEN?.length);
        console.log('DEMO_MODE:', process.env.REACT_APP_DEMO_MODE);
        console.log('GMAIL_USER exists:', !!process.env.REACT_APP_GMAIL_USER);
    }, []);

    return (
        <ErrorBoundary>
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="pipeline" element={<Pipeline />} />
                            <Route path="email" element={<EmailAutomation />} />
                            <Route path="integrations" element={<IntegrationDemo />} />
                        </Route>

                        {/* Redirect unknown routes to login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
