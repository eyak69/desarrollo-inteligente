import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Box, useMediaQuery, useTheme, alpha 
} from '@mui/material';
import { Idea } from '@/services/ideaService';

interface IdeaDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Idea>) => void;
  initialData?: Idea | null;
}

const IdeaDialog = ({ open, onClose, onSave, initialData }: IdeaDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<Partial<Idea>>(() => {
    return initialData || {
      title: '',
      description: '',
      complexity: 'medium'
    };
  });


  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: alpha('#0c0c0e', 0.85),
          backdropFilter: 'blur(20px)',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : 4,
          border: isMobile ? 'none' : '1px solid',
          borderColor: alpha('#fff', 0.1),
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, bgcolor: isMobile ? 'background.paper' : 'transparent' }}>
        {initialData ? 'Editar Idea' : 'Nueva Idea de Sistema'}
      </DialogTitle>
      <DialogContent sx={{ mt: isMobile ? 0 : 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: isMobile ? 2 : 1 }}>
          <TextField
            label="Título"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            variant="filled"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={isMobile ? 8 : 4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            variant="filled"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            select
            label="Complejidad"
            fullWidth
            value={formData.complexity}
            onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
            variant="filled"
          >
            <MenuItem value="easy">Fácil</MenuItem>
            <MenuItem value="medium">Media</MenuItem>
            <MenuItem value="hard">Difícil</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdeaDialog;
