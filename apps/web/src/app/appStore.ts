import { configureStore } from '@reduxjs/toolkit';

import contentPageReducer from './slices/contentPage';
import messagesReducer from './slices/messages';
import modalContainerReducer from './slices/modalContainer';
import themeModeReducer from './slices/themeMode';
import userReducer from './slices/user';

const appStore = configureStore({
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

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export default appStore;
