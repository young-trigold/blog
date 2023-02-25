import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HomePageState {
  tagIndex: number;
}

const initialState: HomePageState = {
  tagIndex: 0,
};

const HomePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setTagIndex: (state, action: PayloadAction<number>) => {
      state.tagIndex = action.payload;
    },
  },
});

export const { setTagIndex } = HomePageSlice.actions;

export default HomePageSlice.reducer;
