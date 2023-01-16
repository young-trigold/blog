import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { ArticlesByTag } from 'src/pages/home';

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
		setTagIndex: (state, action) => {
			state.tagIndex = action.payload;
		},
	},
});

export const { setTagIndex } = HomePageSlice.actions;

export default HomePageSlice.reducer;
