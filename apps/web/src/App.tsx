import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';

import RouterPart from './app/routes';
import { useAppSelector } from './app/store';
import GlobalStyle from './app/theme/GlobalStyle';
import themes from './app/theme/themes';
import { MessageContainer } from './components/Message';
import ModalContainer from './components/Modal/ModalContainer';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

const App = () => {
  const themeMode = useAppSelector((state) => state.themeMode.themeMode);
  const theme = useMemo(() => themes[themeMode], [themeMode]);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <MessageContainer />
        <ModalContainer />
        <RouterPart />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
