/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { ThemeModes } from '../theme/themes';

interface ThemeModeState {
  themeMode: string;
}

const initialState: ThemeModeState = {
  themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const themeModeSlice = createSlice({
  name: 'themeMode',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      if (state.themeMode === ThemeModes.Dark) state.themeMode = ThemeModes.Light;
      else state.themeMode = ThemeModes.Dark;
    },
  },
});

export const { toggleThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
