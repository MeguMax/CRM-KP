import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import {
    Mail as MailIcon,
    Chat as ChatIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import { realEmailService } from '../../services/realEmailService';
import { realNotificationService } from '../../services/realNotificationService';

const IntegrationStatus: React.FC = () => {
    const [gmailStatus, setGmailStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [slackStatus, setSlackStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [audienceStats, setAudienceStats] = useState<any>(null);

    useEffect(() => {
        checkIntegrations();
    }, []);

    const checkIntegrations = async () => {
        // Перевірка Gmail
        try {
            const connectionTest = await realEmailService.testConnection();

            if (connectionTest.connected) {
                setGmailStatus('connected');
                // статистика
                setAudienceStats({
                    totalSubscribers: 0, // Можна додати статистику пізніше
                    openRate: 0,
                    clickRate: 0,
                    demo: false
                });
            } else {
                setGmailStatus('error');
            }
        } catch (error) {
            setGmailStatus('error');
        }

        // Перевірка Slack
        try {
            const connectionTest = await realNotificationService.testConnection();
            if (connectionTest.connected) {
                setSlackStatus('connected');
            } else {
                setSlackStatus('error');
            }
        } catch (error) {
            setSlackStatus('error');
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'loading') return <CircularProgress size={20} />;
        if (status === 'connected') return <CheckIcon color="success" />;
        return <ErrorIcon color="error" />;
    };

    const getStatusColor = (status: string) => {
        if (status === 'connected') return 'success';
        if (status === 'error') return 'error';
        return 'default';
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Статус інтеграцій (Реальний режим)
                </Typography>

                {/* Gmail Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MailIcon />
                        <Typography>Gmail</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {gmailStatus === 'connected' && audienceStats && (
                            <Chip
                                label={`${audienceStats.totalSubscribers} підписників`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                        <Chip
                            icon={getStatusIcon(gmailStatus)}
                            label={gmailStatus === 'loading' ? 'Перевірка...' :
                                gmailStatus === 'connected' ? 'Підключено' : 'Помилка'}
                            color={getStatusColor(gmailStatus) as any}
                            size="small"
                        />
                    </Box>
                </Box>

                {/* Slack Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChatIcon />
                        <Typography>Slack</Typography>
                    </Box>
                    <Chip
                        icon={getStatusIcon(slackStatus)}
                        label={slackStatus === 'loading' ? 'Перевірка...' :
                            slackStatus === 'connected' ? 'Підключено' : 'Помилка'}
                        color={getStatusColor(slackStatus) as any}
                        size="small"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={checkIntegrations}
                        disabled={gmailStatus === 'loading' || slackStatus === 'loading'}
                    >
                        Перевірити статус
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => realEmailService.testConnection().then(console.log)}
                    >
                        Тест Gmail
                    </Button>
                </Box>

                {/* Додаткова інформація про Gmail */}
                {gmailStatus === 'connected' && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            Gmail: {process.env.REACT_APP_GMAIL_USER}<br/>
                            Режим: Реальний (Backend)
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default IntegrationStatus;