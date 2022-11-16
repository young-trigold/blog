import { ThemeProvider } from 'styled-components';

import { useEffect, useMemo } from 'react';
import RouterPart from './app/routes';
import { useAppDispatch, useAppSelector } from './app/store';
import { fetchArticles } from './app/store/pages/homePage';
import { fetchNotes } from './app/store/pages/notePage';
import { getUserInfo } from './app/store/user';
import watchedLocalStorage from './app/store/watchedLocalStorage';
import GlobalStyle from './app/theme/GlobalStyle';
import themes from './app/theme/themes';
import { MessageContainer } from './components/Message';
import ModalContainer from './components/Modal/ModalContainer';

const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const user = watchedLocalStorage.getItem<{ token: string }>('user');
		if (user) dispatch(getUserInfo());
		dispatch(fetchArticles());
		dispatch(fetchNotes());
	}, []);

	const themeMode = useAppSelector((state) => state.themeMode.themeMode);
	const theme = useMemo(() => themes[themeMode], [themeMode]);

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
