import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/layout/Layout';
import IdeasPage from './features/ideas/IdeasPage';

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
          <IdeasPage />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
