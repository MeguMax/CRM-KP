import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from "../../hooks/redux";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { removeClient } from '../../store/slices/clientsSlice';
import ClientForm from '../../components/ClientForm/ClientForm';

const Clients: React.FC = () => {
    const dispatch = useAppDispatch();
    // об'єднання всіх властивості в один useSelector
    const { clients, loading, error } = useSelector((state: RootState) => state.clients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Фільтрація клієнтів
    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch =
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.company.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [clients, searchTerm, statusFilter]);

    const handleEdit = (client: any) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleDelete = (clientId: string) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            dispatch(removeClient(clientId));
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingClient(null);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Clients</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsFormOpen(true)}
                >
                    Add Client
                </Button>
            </Box>

            {/* стани окремо */}
            {/* error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) /*}

            {/* пошук + фільтр */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 200 }}
                />

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                <Chip
                    label={`Total: ${filteredClients.length}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id} hover>
                                <TableCell>
                                    <Typography variant="subtitle2">{client.name}</Typography>
                                </TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.company}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={client.status}
                                        color={client.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleEdit(client)}
                                        color="primary"
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(client.id)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredClients.length === 0 && !loading && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            {clients.length === 0 ? 'No clients found' : 'No clients match your search'}
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            <ClientForm
                open={isFormOpen}
                onClose={handleCloseForm}
                client={editingClient}
            />
        </Box>
    );
};

export default Clients;