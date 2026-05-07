import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { 
  Box, Typography, CircularProgress, Alert, Chip, Button, IconButton, Stack, 
  useMediaQuery, useTheme, Card, CardContent, CardActions, InputBase,
  BottomNavigation, BottomNavigationAction, Paper, Avatar, Badge
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  NotificationsNone as BellIcon,
  Science as LabIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { getIdeas, createIdea, updateIdea, deleteIdea, Idea } from '@/services/ideaService';
import IdeaDialog from './IdeaDialog';
import { toast } from 'sonner';

// Importar estilos de AG Grid
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

const IdeasPage = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [navValue, setNavValue] = useState(0);

  // Consultas
  const { data, isLoading, error } = useQuery({
    queryKey: ['ideas'],
    queryFn: getIdeas,
  });

  // Filtrado reactivo para el buscador
  const filteredIdeas = useMemo(() => {
    if (!data) return [];
    return data.filter((idea: Idea) => 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      setDialogOpen(false);
      toast.success('¡Idea creada con éxito!', {
        description: 'Se ha añadido al laboratorio correctamente.'
      });
    },
    onError: () => {
      toast.error('Error al crear la idea', {
        description: 'Por favor, verifica los datos e intenta nuevamente.'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Idea>) => updateIdea(selectedIdea!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      setDialogOpen(false);
      toast.success('Idea actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar la idea');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.success('Idea eliminada', {
        description: 'El registro se ha borrado lógicamente del sistema.'
      });
    },
    onError: () => {
      toast.error('No se pudo eliminar la idea');
    }
  });

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedIdea(null);
    setDialogOpen(true);
  };

  const handleSave = (formData: Partial<Idea>) => {
    if (selectedIdea) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta idea?")) {
      deleteMutation.mutate(id);
    }
  };

  const getComplexityColor = (complexity: string): any => {
    switch (complexity) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "error";
      default: return "default";
    }
  };

  const columnDefs: ColDef<Idea>[] = [
    { field: 'title', headerName: 'Título', flex: 2, filter: true },
    { field: 'description', headerName: 'Descripción', flex: 3 },
    { 
      field: 'complexity', 
      headerName: 'Complejidad', 
      flex: 1,
      cellRenderer: (params: any) => (
        <Chip label={params.value} color={getComplexityColor(params.value)} size="small" />
      )
    },
    { 
      headerName: 'Acciones',
      width: 120,
      cellRenderer: (params: any) => (
        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          <IconButton size="small" onClick={() => handleEdit(params.data)} color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.data.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error al cargar las ideas del laboratorio.</Alert>;
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      pb: { xs: 10, md: 4 }, // Espacio para la Bottom Nav
      minHeight: '100vh',
      bgcolor: '#050505'
    }}>
      {/* Header Premium (Móvil) */}
      {isMobile && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              src="/logo.png" 
              sx={{ width: 40, height: 40, bgcolor: '#111', border: '1px solid #333' }}
            >
              <LabIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              Laboratorio de Ideas
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={handleAdd}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 40,
                height: 40,
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <Badge variant="dot" color="error">
                <BellIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Stack>
      )}

      {/* Buscador Premium */}
      {isMobile && (
        <Box 
          sx={{ 
            bgcolor: '#121212', 
            borderRadius: 3, 
            px: 2, 
            py: 1.5, 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.3)', mr: 1.5 }} />
          <InputBase
            placeholder="Buscar ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ color: 'white', width: '100%', fontSize: '0.95rem' }}
          />
        </Box>
      )}

      {/* Título Desktop */}
      {!isMobile && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>
              Laboratorio de Ideas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestioná tus proyectos futuros con este sistema de alta gama.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} size="large">
            Nueva Idea
          </Button>
        </Stack>
      )}
      
      {isMobile ? (
        <Stack spacing={2.5}>
          {filteredIdeas.map((idea: Idea) => (
            <Card 
              key={idea.id} 
              sx={{ 
                bgcolor: '#0a0a0a', 
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: '0.2s',
                '&:active': { transform: 'scale(0.98)' }
              }}
            >
              <CardContent sx={{ pt: 3, pb: 1 }}>
                <Chip 
                  label={idea.complexity.toUpperCase()} 
                  size="small" 
                  color={getComplexityColor(idea.complexity)} 
                  sx={{ fontWeight: 900, fontSize: '0.6rem', mb: 1.5, height: 20 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                  {idea.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                  {idea.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2, pt: 1 }}>
                <Button 
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  onClick={() => handleEdit(idea)}
                  sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.75rem' }}
                >
                  EDITAR
                </Button>
                <Button 
                  startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                  onClick={() => handleDelete(idea.id)}
                  sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.75rem' }}
                >
                  ELIMINAR
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                  AHORA
                </Typography>
              </CardActions>
            </Card>
          ))}
          {filteredIdeas.length === 0 && (
            <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.3 }}>
              <Typography variant="h6">Sin resultados</Typography>
            </Box>
          )}
        </Stack>
      ) : (
        <Box className="ag-theme-material-dark" sx={{ 
          height: 600, 
          width: '100%', 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={false}
          />
        </Box>
      )}

      {/* Bottom Navigation (Móvil) */}
      {isMobile && (
        <Paper 
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#050505', borderTop: '1px solid #222' }} 
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={navValue}
            onChange={(_, newValue) => setNavValue(newValue)}
            sx={{ bgcolor: 'transparent', height: 70 }}
          >
            <BottomNavigationAction label="Lab" icon={<LabIcon />} sx={{ color: navValue === 0 ? 'primary.main' : 'rgba(255,255,255,0.4)' }} />
            <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} sx={{ color: navValue === 1 ? 'primary.main' : 'rgba(255,255,255,0.4)' }} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} sx={{ color: navValue === 2 ? 'primary.main' : 'rgba(255,255,255,0.4)' }} />
          </BottomNavigation>
        </Paper>
      )}

      <IdeaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={selectedIdea}
      />
    </Box>
  );
};

export default IdeasPage;
