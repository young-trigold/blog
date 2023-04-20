import { useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';

import RouterPart from './app/routes';
import { useAppDispatch, useAppSelector } from './app/store';
import { getUserInfo } from './app/store/user';
import watchedLocalStorage from './app/store/watchedLocalStorage';
import GlobalStyle from './app/theme/GlobalStyle';
import themes from './app/theme/themes';
import { MessageContainer } from './components/Message';
import ModalContainer from './components/Modal/ModalContainer';

export const queryClient = new QueryClient({
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
  const dispatch = useAppDispatch();

	useEffect(() => {
		const user = watchedLocalStorage.getItem<{ token: string }>('user');
		if (user) dispatch(getUserInfo());
	}, []);

  return (
    <QueryClientProvider client={queryClient}>
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
