// components/ClientForm/ClientForm.tsx
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    Snackbar
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addClient, updateClientLocal } from '../../store/slices/clientsSlice';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { realEmailService } from '../../services/realEmailService';
import { realNotificationService } from '../../services/realNotificationService';

interface ClientFormProps {
    open: boolean;
    onClose: () => void;
    client?: any;
}

const ClientForm: React.FC<ClientFormProps> = ({ open, onClose, client }) => {
    const dispatch = useAppDispatch();
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const [addToNewsletter, setAddToNewsletter] = useState(true);
    const [notifySlack, setNotifySlack] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
            status: 'active' as 'active' | 'inactive',
        },
    });

    useEffect(() => {
        if (client) {
            reset(client);
            setAddToNewsletter(false);
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                company: '',
                status: 'active',
            });
            setAddToNewsletter(true);
        }
    }, [client, reset]);

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const onSubmit = async (data: any) => {
        try {
            const clientData = {
                ...data,
                id: client ? client.id : Date.now().toString(),
                createdAt: client ? client.createdAt : new Date().toISOString()
            };

            if (client) {
                dispatch(updateClientLocal(clientData));
                showSnackbar('Клієнта оновлено успішно!');
            } else {
                dispatch(addClient(clientData));

                // реальні сервіси
                if (addToNewsletter) {
                    try {
                        const firstName = data.name.split(' ')[0] || '';
                        const lastName = data.name.split(' ').slice(1).join(' ') || '';
                        await realEmailService.addSubscriber(data.email, firstName, lastName);
                        showSnackbar('Клієнта додано до розсилки!');
                    } catch (error) {
                        console.error('Помилка додавання до розсилки:', error);
                        showSnackbar('Клієнта створено, але не вдалося додати до розсилки', 'error');
                    }
                }

                // Сповіщення в Slack
                if (notifySlack) {
                    try {
                        await realNotificationService.sendClientNotification(clientData, 'додано');
                        showSnackbar('Сповіщення в Slack відправлено!');
                    } catch (error) {
                        console.error('Помилка Slack інтеграції:', error);
                        showSnackbar('Клієнта створено, але сповіщення в Slack не вдалося відправити', 'error');
                    }
                }

                showSnackbar('Клієнта додано успішно!');
            }

            onClose();

        } catch (error) {
            console.error('Помилка збереження клієнта:', error);
            showSnackbar('Помилка збереження клієнта', 'error');
        }
    };

    //
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{client ? 'Редагувати клієнта' : 'Додати клієнта'}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Ім'я обов'язкове" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Ім'я"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email обов'язковий",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Невірний формат email'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Телефон"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Компанія"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Статус"
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="active">Активний</MenuItem>
                                    <MenuItem value="inactive">Неактивний</MenuItem>
                                </TextField>
                            )}
                        />

                        {!client && (
                            <>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={addToNewsletter}
                                            onChange={(e) => setAddToNewsletter(e.target.checked)}
                                        />
                                    }
                                    label="Додати до email розсилки"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notifySlack}
                                            onChange={(e) => setNotifySlack(e.target.checked)}
                                        />
                                    }
                                    label="Відправити сповіщення в Slack"
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Скасувати</Button>
                        <Button type="submit" variant="contained">
                            {client ? 'Оновити' : 'Додати'}
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

export default ClientForm;