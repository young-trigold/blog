import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { useEffect, useMemo } from 'react';
import { AppDispatch, AppState } from './app/appStore';
import RouterPart from './app/RouterPart';
import { getUserInfo } from './app/slices/user';
import GlobalStyle from './app/theme/GlobalStyle';
import themes from './app/theme/themes';
import { MessageContainer } from './components/Message';
import ModalContainer from './components/Modal/ModalContainer';
import watchedLocalStorage from './utils/watchedLocalStorage';

const App = () => {
  const themeMode = useSelector((state: AppState) => state.themeMode.themeMode);
  const theme = useMemo(() => themes[themeMode], [themeMode]);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const user = watchedLocalStorage.getItem<{ token: string }>('user');
    if (user) dispatch(getUserInfo());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MessageContainer />
      <ModalContainer />
      <RouterPart />
    </ThemeProvider>
  );
};

export default App;
