import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum CurrentModal {
	Login,
	Logout,
	InsertLink,
	AddArticle,
	AddArticleTag,
	AddNote,
	AddChapter,
}

interface ModalState {
	modalContainer: {
		visible: boolean;
	};
	currentModal: CurrentModal | null;
}

const initialState: ModalState = {
	modalContainer: {
		visible: false,
	},
	currentModal: null,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal(state, action: PayloadAction<CurrentModal>) {
			state.modalContainer.visible = true;
			state.currentModal = action.payload;
		},
		closeModal(state) {
			state.modalContainer.visible = false;
			state.currentModal = null;
		},
	},
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
