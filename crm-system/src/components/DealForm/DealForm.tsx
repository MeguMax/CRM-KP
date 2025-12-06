// components/DealForm/DealForm.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Alert,
    Snackbar
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addDeal, updateDealLocal } from '../../store/slices/pipelineSlice';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/redux';
import { realNotificationService } from '../../services/realNotificationService';

interface DealFormProps {
    open: boolean;
    onClose: () => void;
    deal?: any;
}

const DealForm: React.FC<DealFormProps> = ({ open, onClose, deal }) => {
    const dispatch = useAppDispatch();
    const { clients } = useSelector((state: RootState) => state.clients);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            title: '',
            value: 0,
            stage: 'lead' as 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed',
            clientId: '',
            expectedCloseDate: '',
        },
    });

    useEffect(() => {
        if (deal) {
            reset(deal);
        } else {
            reset({
                title: '',
                value: 0,
                stage: 'lead',
                clientId: '',
                expectedCloseDate: '',
            });
        }
    }, [deal, reset]);

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const onSubmit = async (data: any) => {
        try {
            const dealData = {
                ...data,
                id: deal ? deal.id : Date.now().toString(),
                createdAt: deal ? deal.createdAt : new Date().toISOString(),
                value: Number(data.value)
            };

            if (deal) {
                dispatch(updateDealLocal(dealData));
                showSnackbar('Deal updated successfully!');
            } else {
                dispatch(addDeal(dealData));
                showSnackbar('Deal added successfully!');

                // Інтеграція з Slack
                try {
                    const client = clients.find(c => c.id === data.clientId);
                    if (client) {
                        await realNotificationService.sendDealNotification(dealData, client);
                        showSnackbar('Slack notification sent!');
                    }
                } catch (error) {
                    console.error('Slack integration failed:', error);
                    showSnackbar('Deal created but Slack notification failed', 'error');
                }
            }

            onClose();

        } catch (error) {
            console.error('Error saving deal:', error);
            showSnackbar('Error saving deal', 'error');
        }
    };

    //
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{deal ? 'Edit Deal' : 'Add Deal'}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Title is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Deal Title"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="value"
                            control={control}
                            rules={{
                                required: 'Value is required',
                                min: { value: 0, message: 'Value must be positive' }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Deal Value"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="clientId"
                            control={control}
                            rules={{ required: 'Client is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Client"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                >
                                    {clients.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.name} - {client.company}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="stage"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Stage"
                                    fullWidth
                                    margin="normal"
                                    required
                                >
                                    <MenuItem value="lead">Lead</MenuItem>
                                    <MenuItem value="qualification">Qualification</MenuItem>
                                    <MenuItem value="proposal">Proposal</MenuItem>
                                    <MenuItem value="negotiation">Negotiation</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="expectedCloseDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Expected Close Date"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {deal ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DealForm;