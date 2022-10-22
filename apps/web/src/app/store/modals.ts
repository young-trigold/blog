import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	modalContainer: {
		visible: boolean;
	};
	modals: {
		loginModal: {
			visible: boolean;
		};
		logoutModal: {
			visible: boolean;
		};
	};
}

const initialState: ModalState = {
	modalContainer: {
		visible: false,
	},
	modals: {
		loginModal: {
			visible: false,
		},
		logoutModal: {
			visible: false,
		},
	},
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setLoginModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.loginModal.visible = action.payload;
		},
		setLogoutModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.logoutModal.visible = action.payload;
		},
	},
});

export const { setLoginModalVisible, setLogoutModalVisible } = modalSlice.actions;
export default modalSlice.reducer;
