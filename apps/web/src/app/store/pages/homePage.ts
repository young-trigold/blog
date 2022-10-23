import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { ArticlesByTag } from 'src/pages/home';

interface HomePageState {
	tagIndex: number;
	articlesByTag: ArticlesByTag[];
	loading: boolean;
	error: null | SerializedError;
}

const initialState: HomePageState = {
	tagIndex: 0,
	articlesByTag: [],
	error: null,
	loading: false,
};

export const fetchArticles = createAsyncThunk(
	'fetchArticlesStatus',
	async (fetchOption, { rejectWithValue }) => {
		try {
			const res = await axios.get<ArticlesByTag[]>('/api/articles', { timeout: 2000 });
			return res.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

const HomePageSlice = createSlice({
	name: 'homePage',
	initialState,
	reducers: {
		setTagIndex: (state, action) => {
			state.tagIndex = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchArticles.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchArticles.fulfilled, (state, action) => {
				state.loading = false;
				state.articlesByTag = action.payload;
			})
			.addCase(fetchArticles.rejected, (state, action) => {
				state.error = action.error;
				state.loading = false;
			});
	},
});

export const { setTagIndex } = HomePageSlice.actions;

export default HomePageSlice.reducer;
