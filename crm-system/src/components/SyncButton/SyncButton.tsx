import React from 'react';
import { Button } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

interface SyncButtonProps {
    onSync: () => void;
    loading?: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onSync, loading = false }) => {
    return (
        <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={onSync}
            disabled={loading}
            sx={{ mb: 2 }}
        >
            {loading ? 'Syncing...' : 'Sync with Server'}
        </Button>
    );
};

export default SyncButton;