import React, { useMemo } from 'react';
import { useAppSelector } from "../../hooks/redux";
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Button
} from '@mui/material';
import {
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Email as EmailIcon,
    AttachMoney as AttachMoneyIcon,
    Timeline as TimelineIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import IntegrationStatus from '../../components/IntegrationStatus/IntegrationStatus';

const Dashboard: React.FC = () => {
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const { deals } = useAppSelector((state: RootState) => state.pipeline);
    const [shouldThrowError, setShouldThrowError] = React.useState(false);

    if (shouldThrowError) {
        throw new Error('This is a test error to demonstrate Error Boundary functionality');
    }

    // Розрахунок реальної статистики
    const activeClients = clients.filter(client => client.status === 'active').length;
    const closedDealsCount = deals.filter(deal => deal.stage === 'closed').length;
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const closedDealsValue = deals
        .filter(deal => deal.stage === 'closed')
        .reduce((sum, deal) => sum + deal.value, 0);

    // Розрахунок процента успіху
    const successRate = deals.length > 0 ? Math.round((closedDealsCount / deals.length) * 100) : 0;

    // Найближчі дедлайни (7 днів)
    const upcomingDeadlines = useMemo(() => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return deals
            .filter(deal => {
                const dealDate = new Date(deal.expectedCloseDate);
                return dealDate <= nextWeek && dealDate >= new Date() && deal.stage !== 'closed';
            })
            .sort((a, b) => new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime())
            .slice(0, 5);
    }, [deals]);

    // Статистика по етапах воронки
    const pipelineStats = useMemo(() => {
        const stages = ['lead', 'qualification', 'proposal', 'negotiation', 'closed'];
        return stages.map(stage => ({
            stage,
            count: deals.filter(deal => deal.stage === stage).length,
            value: deals
                .filter(deal => deal.stage === stage)
                .reduce((sum, deal) => sum + deal.value, 0),
            percentage: deals.length > 0 ? Math.round((deals.filter(deal => deal.stage === stage).length / deals.length) * 100) : 0
        }));
    }, [deals]);

    // Топ клієнти за вартістю угод
    const topClients = useMemo(() => {
        const clientDeals = clients.map(client => {
            const clientDeals = deals.filter(deal => deal.clientId === client.id);
            const totalValue = clientDeals.reduce((sum, deal) => sum + deal.value, 0);
            return {
                ...client,
                dealCount: clientDeals.length,
                totalValue
            };
        });
        return clientDeals
            .filter(client => client.totalValue > 0)
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 5);
    }, [clients, deals]);

    const stats = [
        {
            title: 'Active Clients',
            value: activeClients,
            icon: <PeopleIcon fontSize="large" />,
            color: '#1976d2',
            change: `+${Math.round((activeClients / clients.length) * 100)}% active`,
        },
        {
            title: 'Closed Deals',
            value: closedDealsCount,
            icon: <CheckCircleIcon fontSize="large" />,
            color: '#2e7d32',
            change: `${successRate}% success rate`,
        },
        {
            title: 'Total Pipeline',
            value: `$${totalDealValue.toLocaleString()}`,
            icon: <AttachMoneyIcon fontSize="large" />,
            color: '#ed6c02',
            change: `$${closedDealsValue.toLocaleString()} closed`,
        },
        {
            title: 'Active Deals',
            value: deals.length,
            icon: <TrendingUpIcon fontSize="large" />,
            color: '#9c27b0',
            change: `${upcomingDeadlines.length} upcoming`,
        },
    ];

    const getStageColor = (stage: string) => {
        const colors: { [key: string]: string } = {
            lead: '#1976d2',
            qualification: '#2e7d32',
            proposal: '#ed6c02',
            negotiation: '#9c27b0',
            closed: '#388e3c'
        };
        return colors[stage] || '#666';
    };

    const getStageIcon = (stage: string) => {
        const icons: { [key: string]: JSX.Element } = {
            lead: <StarIcon />,
            qualification: <ScheduleIcon />,
            proposal: <EmailIcon />,
            negotiation: <TimelineIcon />,
            closed: <CheckCircleIcon />
        };
        return icons[stage] || <WarningIcon />;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {process.env.NODE_ENV === 'development' && (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShouldThrowError(true)}
                    sx={{ mb: 2 }}
                >
                    Test Error Boundary
                </Button>
            )}

            {/* Основна статистика */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: stat.color,
                                color: 'white',
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ opacity: 0.8 }}>
                                    {stat.icon}
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 2 }}>
                                {stat.change}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Воронка продажів */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TimelineIcon /> Sales Pipeline
                            </Typography>
                            {pipelineStats.map((stage) => (
                                <Box key={stage.stage} sx={{ mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ color: getStageColor(stage.stage) }}>
                                                {getStageIcon(stage.stage)}
                                            </Box>
                                            <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}>
                                                {stage.stage}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {stage.count} deals • ${stage.value.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={stage.percentage}
                                            sx={{
                                                flexGrow: 1,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: '#f0f0f0',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: getStageColor(stage.stage),
                                                    borderRadius: 4,
                                                }
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 35 }}>
                                            {stage.percentage}%
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Найближчі дедлайни */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon /> Upcoming Deadlines
                            </Typography>
                            <List dense>
                                {upcomingDeadlines.length > 0 ? (
                                    upcomingDeadlines.map((deal) => {
                                        const client = clients.find(c => c.id === deal.clientId);
                                        return (
                                            <ListItem key={deal.id} sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: getStageColor(deal.stage),
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {deal.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {client?.name} • ${deal.value.toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No upcoming deadlines
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Топ клієнти */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StarIcon /> Top Clients
                            </Typography>
                            <List dense>
                                {topClients.length > 0 ? (
                                    topClients.map((client, index) => (
                                        <ListItem key={client.id} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    #{index + 1}
                                                </Typography>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {client.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {client.company}
                                                        </Typography>
                                                        <Chip
                                                            label={`$${client.totalValue.toLocaleString()}`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No client data available
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <IntegrationStatus />
                    </Grid>
                </Grid>

                {/* Статистика успішності */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon /> Performance
                            </Typography>
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-flex',
                                        mb: 2
                                    }}
                                >
                                    <LinearProgress
                                        variant="determinate"
                                        value={successRate}
                                        sx={{
                                            height: 120,
                                            width: 120,
                                            borderRadius: '50%',
                                            transform: 'rotate(-90deg)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: successRate >= 50 ? '#4caf50' : successRate >= 25 ? '#ff9800' : '#f44336',
                                            }
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h4" component="div" color="text.primary">
                                            {successRate}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1" color="text.primary" gutterBottom>
                                    Success Rate
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {closedDealsCount} out of {deals.length} deals closed
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;