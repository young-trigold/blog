import { configureStore } from '@reduxjs/toolkit';

import contentPageReducer from './contentPage';
import messagesReducer from './messages';
import modalContainerReducer from './modalContainer';
import themeModeReducer from './themeMode';
import userReducer from './user';

const store = configureStore({
  reducer: {
    themeMode: themeModeReducer,
    messages: messagesReducer,
    modalContainer: modalContainerReducer,
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
