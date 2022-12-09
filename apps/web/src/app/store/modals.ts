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
		insertLinkModal: {
			visible: boolean;
		};
		addArticleModal: {
			visible: boolean;
		};
		addArticleTagModal: {
			visible: boolean;
		};
		addNoteModal: {
			visible: boolean;
		};
		addChapterModal: {
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
		insertLinkModal: {
			visible: false,
		},
		addArticleModal: {
			visible: false,
		},
		addArticleTagModal: {
			visible: false,
		},
		addChapterModal: {
			visible: false,
		},
		addNoteModal: {
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
		setInsertLinkModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.insertLinkModal.visible = action.payload;
		},
		setAddArticleModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.addArticleModal.visible = action.payload;
		},
		setAddArticleTagModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.addArticleTagModal.visible = action.payload;
		},
		setAddNoteModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.addNoteModal.visible = action.payload;
		},
		setAddChapterModalVisible: (state, action) => {
			state.modalContainer.visible = action.payload;
			state.modals.addChapterModal.visible = action.payload;
		},
	},
});

export const {
	setLoginModalVisible,
	setLogoutModalVisible,
	setInsertLinkModalVisible,
	setAddArticleModalVisible,
	setAddArticleTagModalVisible,
	setAddChapterModalVisible,
	setAddNoteModalVisible,
} = modalSlice.actions;

export default modalSlice.reducer;
