import React from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Divider, IconButton 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Lightbulb as IdeasIcon, 
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Business as LogoIcon
} from '@mui/icons-material';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const theme = useTheme(); // Eliminado para limpiar lint

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Laboratorio de Ideas', icon: <IdeasIcon />, path: '/ideas' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', gap: 2, py: 3 }}>
        <LogoIcon color="primary" fontSize="large" />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          MAESTRO
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
              }}
              selected={item.text === 'Laboratorio de Ideas'}
            >
              <ListItemIcon sx={{ color: item.text === 'Laboratorio de Ideas' ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: item.text === 'Laboratorio de Ideas' ? 600 : 400,
                  fontSize: '0.9rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Typography variant="caption" color="text.secondary">
          v0.4.0 Obsidian Edition
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header para Mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          bgcolor: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Blueprint Maestro
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box', 
              bgcolor: '#0a0a0a',
              borderRight: '1px solid rgba(255, 255, 255, 0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
        
        {/* Sidebar - Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0a0a0a' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, md: 0 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
