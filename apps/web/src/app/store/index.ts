import { configureStore } from '@reduxjs/toolkit';

import contentPageReducer from './contentPage';
import messagesReducer from './messages';
import modalContainerReducer from './modals';
import themeModeReducer from './themeMode';
import userReducer from './user';

const store = configureStore({
	reducer: {
		themeMode: themeModeReducer,
		messages: messagesReducer,
		modal: modalContainerReducer,
		contentPage: contentPageReducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
