import { createSlice } from '@reduxjs/toolkit';

interface AdminPageState {
	currentIndex: number;
}

const initialState: AdminPageState = {
	currentIndex: 0,
};

const AdminPageSlice = createSlice({
	name: 'contentPage',
	initialState,
	reducers: {
		setCurrentIndex: (state, action) => {
			state.currentIndex = action.payload;
		},
	},
	extraReducers(builder) {},
});

export const { setCurrentIndex } = AdminPageSlice.actions;

export default AdminPageSlice.reducer;
