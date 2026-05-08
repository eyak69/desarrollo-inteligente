import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Box,
  Typography,
  alpha
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'info' | 'warning' | 'error';
}

const ConfirmDialog = ({ 
  open, 
  title, 
  message, 
  confirmText = 'Aceptar', 
  cancelText = 'Cancelar', 
  onConfirm, 
  onCancel,
  severity = 'info'
}: ConfirmDialogProps) => {
  
  const getSeverityColor = () => {
    switch (severity) {
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      default: return 'primary.main';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha('#fff', 0.1),
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 600
          }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          autoFocus
          sx={{ 
            bgcolor: getSeverityColor(),
            '&:hover': {
              bgcolor: alpha(getSeverityColor() === 'error.main' ? '#f44336' : '#2196f3', 0.8),
            },
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
