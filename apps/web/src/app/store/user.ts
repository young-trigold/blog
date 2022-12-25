import watchedLocalStorage from '@/app/store/watchedLocalStorage';
import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';

export interface UserInfo {
	id: string;
	role: string;
	name: string;
	avatar: string;
	introduction: string;
}

interface UserState {
	hasLogin: boolean;
	info: null | UserInfo;
	error: null | SerializedError;
}

const initialState: UserState = {
	hasLogin: false,
	info: null,
	error: null,
};

export const getUserInfo = createAsyncThunk('user', async (fetchOption, { rejectWithValue }) => {
	const user = watchedLocalStorage.getItem<{ token: string }>('user');
	try {
		const res = await axios.get('/api/userInfo', {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetUser(state) {
			state.error = initialState.error;
			state.hasLogin = initialState.hasLogin;
			state.info = initialState.info;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getUserInfo.fulfilled, (state, action) => {
				state.info = action.payload;
				state.hasLogin = Boolean(action.payload);
			})
			.addCase(getUserInfo.rejected, (state, action) => {
				state.hasLogin = initialState.hasLogin;
				state.error = action.error;
				state.info = initialState.info;
			});
	},
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
