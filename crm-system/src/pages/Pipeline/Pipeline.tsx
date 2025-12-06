import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from "../../hooks/redux";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { RootState } from '../../store/store';
import { removeDeal } from '../../store/slices/pipelineSlice';
import DealForm from '../../components/DealForm/DealForm';

const Pipeline: React.FC = () => {
    const dispatch = useAppDispatch();
    const { deals } = useSelector((state: RootState) => state.pipeline);
    const { clients } = useSelector((state: RootState) => state.clients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<any>(null);

    const stages = [
        { key: 'lead', label: 'Lead', color: 'primary' },
        { key: 'qualification', label: 'Qualification', color: 'secondary' },
        { key: 'proposal', label: 'Proposal', color: 'info' },
        { key: 'negotiation', label: 'Negotiation', color: 'warning' },
        { key: 'closed', label: 'Closed', color: 'success' },
    ];

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.name : 'Unknown';
    };

    const handleEdit = (deal: any) => {
        setEditingDeal(deal);
        setIsFormOpen(true);
    };

    const handleDelete = (dealId: string) => {
        dispatch(removeDeal(dealId));
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingDeal(null);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Sales Pipeline</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsFormOpen(true)}
                >
                    Add Deal
                </Button>
            </Box>

            <Grid container spacing={3}>
                {stages.map((stage) => (
                    <Grid item xs={12} md={2.4} key={stage.key}>
                        <Typography variant="h6" gutterBottom>
                            {stage.label} ({deals.filter(deal => deal.stage === stage.key).length})
                        </Typography>
                        {deals
                            .filter(deal => deal.stage === stage.key)
                            .map((deal) => (
                                <Card key={deal.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {deal.title}
                                        </Typography>
                                        <Typography color="textSecondary" gutterBottom>
                                            ${deal.value}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            {getClientName(deal.clientId)}
                                        </Typography>
                                        <Chip
                                            label={stage.label}
                                            color={stage.color as any}
                                            size="small"
                                        />
                                        <Box sx={{ mt: 1 }}>
                                            <IconButton size="small" onClick={() => handleEdit(deal)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(deal.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                    </Grid>
                ))}
            </Grid>

            <DealForm
                open={isFormOpen}
                onClose={handleCloseForm}
                deal={editingDeal}
            />
        </Box>
    );
};

export default Pipeline;