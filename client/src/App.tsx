import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster 
          richColors 
          closeButton 
          position="top-right"
          theme="dark"
        />
        <Layout>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh', 
            color: '#fff', 
            textAlign: 'center', 
            padding: '20px' 
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '20px', 
              background: 'linear-gradient(45deg, #a855f7, #3b82f6)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700
            }}>
              Blueprint Maestro
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem', 
              maxWidth: '600px',
              lineHeight: 1.6,
              fontFamily: 'Inter, sans-serif'
            }}>
              El proyecto ha sido andamiado correctamente utilizando el Blueprint de Desarrollo Inteligente.
              Comienza a desarrollar tus módulos verticales bajo <code>server/src/modules/</code> y tus componentes frontend en <code>client/src/features/</code>.
            </p>
          </div>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
