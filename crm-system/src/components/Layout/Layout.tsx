import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon,
    Email as EmailIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
        { path: '/clients', label: 'Clients', icon: <PeopleIcon /> },
        { path: '/pipeline', label: 'Pipeline', icon: <TimelineIcon /> },
        { path: '/email', label: 'Email', icon: <EmailIcon /> },
        { path: '/integrations', label: 'Integrations', icon: <SettingsIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                        CRM System
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                component={Link}
                                to={item.path}
                                startIcon={item.icon}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                            {user?.name || 'User'}
                        </Typography>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;
