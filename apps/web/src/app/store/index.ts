import { configureStore } from '@reduxjs/toolkit';

import messagesReducer from './messages';
import modalContainerReducer from './modals';
import contentPageReducer from './pages/contentPage';
import themeModeReducer from './themeMode';
import userReducer from './user';
import homePageReducer from './pages/homePage';
import notePageReducer from './pages/notePage';
import adminPageReducer from './pages/adminPage';

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
export default store;
