import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/layout/Layout';
import IdeasPage from './features/ideas/IdeasPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <IdeasPage />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
