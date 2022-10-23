import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { useEffect, useMemo } from 'react';
import RouterPart from './app/routes';
import { AppDispatch, AppState } from './app/store';
import { getUserInfo } from './app/store/user';
import watchedLocalStorage from './app/store/watchedLocalStorage';
import GlobalStyle from './app/theme/GlobalStyle';
import themes from './app/theme/themes';
import { MessageContainer } from './components/Message';
import ModalContainer from './components/Modal/ModalContainer';
import { fetchArticles } from './app/store/pages/homePage';
import { fetchNotes } from './app/store/pages/notePage';

const App = () => {
	const themeMode = useSelector((state: AppState) => state.themeMode.themeMode);
	const theme = useMemo(() => themes[themeMode], [themeMode]);

	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const user = watchedLocalStorage.getItem<{ token: string }>('user');
		if (user) dispatch(getUserInfo());
	}, []);

  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchNotes());
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
