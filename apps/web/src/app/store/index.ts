import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import messagesReducer from './messages';
import modalContainerReducer from './modals';
import adminPageReducer from './pages/adminPage';
import contentPageReducer from './pages/contentPage';
import homePageReducer from './pages/homePage';
import notePageReducer from './pages/notePage';
import themeModeReducer from './themeMode';
import userReducer from './user';

const store = configureStore({
	reducer: {
		themeMode: themeModeReducer,
		messages: messagesReducer,
		modal: modalContainerReducer,
		user: userReducer,
		contentPage: contentPageReducer,
		homePage: homePageReducer,
		notePage: notePageReducer,
		adminPage: adminPageReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export default store;
