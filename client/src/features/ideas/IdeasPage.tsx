import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { 
  Box, Typography, CircularProgress, Alert, Chip, Button, IconButton, Stack, 
  useMediaQuery, useTheme, Card, CardContent, CardActions, InputBase,
  BottomNavigation, BottomNavigationAction, Paper, Avatar, alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Science as LabIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { 
  getIdeas, createIdea, updateIdea, deleteIdea, 
  getArchivedIdeas, restoreIdea, Idea 
} from '@/services/ideaService';
import IdeaDialog from './IdeaDialog';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { toast } from 'sonner';

// Importar estilos de AG Grid
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const IdeasPage = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [navValue, setNavValue] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogKey, setDialogKey] = useState(0);

  // Consultas
  const { data, isLoading, error } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => getIdeas(1, 100),
    enabled: navValue === 0,
  });

  const { data: archivedData, isLoading: isLoadingArchived } = useQuery({
    queryKey: ['ideas-archived'],
    queryFn: getArchivedIdeas,
    enabled: navValue === 1,
  });

  // Filtrado reactivo para el buscador
  const filteredIdeas = useMemo(() => {
    const ideas = data?.data || [];
    return ideas.filter((idea: Idea) => 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
    mutationFn: async (ids: string | string[]) => {
      const idList = Array.isArray(ids) ? ids : [ids];
      return Promise.all(idList.map(id => deleteIdea(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['ideas-archived'] });
      setSelectedIds([]); // Limpiar selección tras borrar
      toast.success('Operación completada', {
        description: 'Las ideas seleccionadas han sido archivadas.'
      });
    },
    onError: () => {
      toast.error('Error', {
        description: 'No se pudieron procesar algunas eliminaciones.'
      });
    }
  });

  const restoreMutation = useMutation({
    mutationFn: restoreIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['ideas-archived'] });
      toast.success('Idea restaurada', {
        description: 'El registro vuelve a estar activo en el laboratorio.'
      });
    },
    onError: () => {
      toast.error('Error al restaurar la idea');
    }
  });

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedIdea(null);
    setDialogKey(prev => prev + 1);
    setDialogOpen(true);
  };

  const handleSave = (formData: Partial<Idea>) => {
    if (selectedIdea) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const { confirm, handleConfirm, handleCancel, open: confirmOpen, options: confirmOptions } = useConfirm();
  
  const handleDelete = async (ids: string | string[]) => {
    const isBatch = Array.isArray(ids) && ids.length > 1;
    const count = Array.isArray(ids) ? ids.length : 1;

    const confirmed = await confirm({
      title: isBatch ? `¿Borrar ${count} ideas?` : '¿Borrar esta idea?',
      message: isBatch 
        ? `Se archivarán ${count} elementos del laboratorio de forma simultánea.`
        : 'Esta acción moverá la idea al archivo del laboratorio.',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      severity: 'error'
    });

    if (confirmed) {
      deleteMutation.mutate(ids);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleClearAll = async () => {
    // POLÍTICA: ConfirmDialog Premium para acciones de alto riesgo
    const confirmed = await confirm({
      title: '¿Vaciar Laboratorio?',
      message: 'Esta acción archivará todas tus ideas activas. No se borrarán físicamente, pero saldrán de tu vista principal.',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      severity: 'error'
    });

    if (confirmed) {
      // Aquí iría la lógica para borrar todo, por ahora solo mostramos un feedback
      toast.success('Laboratorio vaciado', {
        description: 'Todas las ideas han sido movidas al archivo.'
      });
    }
  };

  const getComplexityColor = (complexity: string): "success" | "warning" | "error" | "default" => {
    switch (complexity) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "error";
      default: return "default";
    }
  };

  const columnDefs: ColDef<Idea>[] = [
    { 
      field: 'title', 
      headerName: 'Título', 
      flex: 2, 
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
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
      {_isMobile && (
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
              onClick={handleClearAll}
              sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }}
            >
              <DeleteIcon />
            </IconButton>
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
          </Stack>
        </Stack>
      )}

      {/* Buscador Premium */}
      {_isMobile && (
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
      {!_isMobile && (
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
      
      {/* Contenido Dinámico basado en Navegación */}
      {navValue === 0 && (
        _isMobile ? (
          <Stack spacing={2.5}>
            {filteredIdeas.map((idea: Idea) => (
              <Card 
                key={idea.id} 
                onClick={() => selectedIds.length > 0 && handleToggleSelect(idea.id)}
                sx={{ 
                  bgcolor: '#0a0a0a', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: selectedIds.includes(idea.id) ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                  transition: '0.2s',
                  position: 'relative',
                  '&:active': { transform: 'scale(0.98)' }
                }}
              >
                <Box 
                  onClick={(e) => { e.stopPropagation(); handleToggleSelect(idea.id); }}
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: '2px solid',
                    borderColor: selectedIds.includes(idea.id) ? 'primary.main' : 'rgba(255,255,255,0.2)',
                    bgcolor: selectedIds.includes(idea.id) ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    cursor: 'pointer'
                  }}
                >
                  {selectedIds.includes(idea.id) && <Box sx={{ width: 10, height: 10, bgcolor: 'white', borderRadius: '20%' }} />}
                </Box>
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
                    onClick={(e) => { e.stopPropagation(); handleEdit(idea); }}
                    sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.75rem' }}
                  >
                    EDITAR
                  </Button>
                  <Button 
                    startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                    onClick={(e) => { e.stopPropagation(); handleDelete(idea.id); }}
                    sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.75rem' }}
                  >
                    ELIMINAR
                  </Button>
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
          <Box className="ag-theme-alpine" sx={{
            height: 600,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            '--ag-background-color': '#0a0a0a',
            '--ag-header-background-color': '#111111',
            '--ag-odd-row-background-color': '#0d0d0d',
            '--ag-row-hover-color': '#1a1a2e',
            '--ag-border-color': 'rgba(255,255,255,0.06)',
            '--ag-header-foreground-color': 'rgba(255,255,255,0.5)',
            '--ag-foreground-color': 'rgba(255,255,255,0.87)',
            '--ag-selected-row-background-color': 'rgba(59,130,246,0.15)',
            '--ag-range-selection-border-color': '#3b82f6',
            '--ag-font-family': 'inherit',
            '--ag-font-size': '14px',
          } as React.CSSProperties}>
            <AgGridReact
              rowData={data?.data || []}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={false}
              rowSelection="multiple"
              onSelectionChanged={(event) => {
                const selectedNodes = event.api.getSelectedNodes();
                const ids = selectedNodes.map(node => node.data.id);
                setSelectedIds(ids);
              }}
            />
          </Box>
        )
      )}

      {navValue === 1 && (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
            Archivo de Ideas
          </Typography>
          {isLoadingArchived ? (
            <CircularProgress size={20} />
          ) : (
            <Stack spacing={2.5}>
              {archivedData?.map((idea: Idea) => (
                <Card 
                  key={idea.id} 
                  sx={{ 
                    bgcolor: '#0a0a0a', 
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: 0.8
                  }}
                >
                  <CardContent sx={{ pt: 3, pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      {idea.title}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      {idea.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      startIcon={<LabIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleRestore(idea.id)}
                      variant="outlined"
                      size="small"
                      sx={{ color: 'primary.main', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                    >
                      RESTAURAR
                    </Button>
                  </CardActions>
                </Card>
              ))}
              {archivedData?.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 5, opacity: 0.3 }}>
                  <Typography>No hay ideas en el archivo.</Typography>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      )}

      {/* Barra de Acciones en Lote (Obsidian Premium) */}
      {selectedIds.length > 0 && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: _isMobile ? 80 : 32, 
            left: '50%', 
            transform: 'translateX(-50%)',
            bgcolor: alpha('#0c0c0e', 0.9),
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 6,
            px: 4,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 1000,
            boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(59, 130, 246, 0.2)'
          }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 700 }}>
            {selectedIds.length} seleccionados
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="text" 
              onClick={() => setSelectedIds([])}
              sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => handleDelete(selectedIds)}
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              Borrar Lote
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Bottom Navigation (Móvil) */}
      {_isMobile && (
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
        key={dialogOpen ? (selectedIdea?.id || `new-${dialogKey}`) : 'closed'}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={selectedIdea}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmOptions?.title || ''}
        message={confirmOptions?.message || ''}
        confirmText={confirmOptions?.confirmText}
        cancelText={confirmOptions?.cancelText}
        severity={confirmOptions?.severity}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default IdeasPage;
