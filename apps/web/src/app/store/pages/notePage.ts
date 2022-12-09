import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { ArticlesByTag } from 'src/pages/home';
import { NoteInfo } from 'src/pages/notes';

interface HomePageState {
	notes: NoteInfo[];
	loading: boolean;
	error: null | SerializedError;
}

const initialState: HomePageState = {
	notes: [],
	error: null,
	loading: false,
};

export const fetchNotes = createAsyncThunk(
	'fetchNotesStatus',
	async (fetchOption, { rejectWithValue }) => {
		try {
			const res = await axios.get<NoteInfo[]>('/api/notes', { timeout: 2000 });
			return res.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

const NotePageSlice = createSlice({
	name: 'notePage',
	initialState,
	reducers: {
	},
	extraReducers(builder) {
		builder
			.addCase(fetchNotes.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchNotes.fulfilled, (state, action) => {
				state.loading = false;
				state.notes = action.payload;
			})
			.addCase(fetchNotes.rejected, (state, action) => {
				state.error = action.error;
				state.loading = false;
			});
	},
});

export const {  } = NotePageSlice.actions;

export default NotePageSlice.reducer;
