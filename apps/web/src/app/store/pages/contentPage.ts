import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { createContext } from 'react';
import EditorStore from 'src/pages/content/components/editor/store';

import { HeadingInfo } from '../../../pages/content/components/catalog/Catalog';
import { CommentInfo } from '../../../pages/content/components/comment/CommentList';
import { EditorState } from 'prosemirror-state';

export interface ContentPageContext {
	isChapter: boolean;
}

export const ContentPageContext = createContext<ContentPageContext>({
	isChapter: false,
});

interface ContentPageState {
	catalog: {
		visible: boolean;
		headings: HeadingInfo[];
		currentHeadingId: string;
	};
	comment: {
		visible: boolean;
		comments: CommentInfo[];
	};
	editor: {
		editorStore: EditorStore | null;
    state: EditorState | null;
	};
}

export const initialState: ContentPageState = {
	catalog: {
		visible: false,
		headings: [],
		currentHeadingId: '',
	},
	comment: {
		visible: true,
		comments: [],
	},
	editor: {
		editorStore: null,
    state: null,
	},
};

const ContentPageSlice = createSlice({
	name: 'contentPage',
	initialState,
	reducers: {
		toggleCatalogVisible: (state) => {
			state.catalog.visible = !state.catalog.visible;
		},
		setCommentVisible: (state, action: PayloadAction<boolean>) => {
			state.comment.visible = action.payload;
		},
		setComments: (state, action: PayloadAction<CommentInfo[]>) => {
			state.comment.comments = action.payload;
		},
		setHeadings: (state, action: PayloadAction<HeadingInfo[]>) => {
			state.catalog.headings = action.payload;
		},
		setCurrentHeadingId: (state, action: PayloadAction<string>) => {
			state.catalog.currentHeadingId = action.payload;
		},
		setEditorStore: (state, action: PayloadAction<EditorStore | null>) => {
			state.editor.editorStore = action.payload as any;
		},
    setEditorState: (state, action: PayloadAction<EditorState | null>) => {
			state.editor.state = action.payload as any;
		},
		resetContentPage: (state) => {
			const { catalog, comment, editor } = initialState;
			state.catalog = catalog;
			state.comment = comment;
			state.editor = editor as any;
		},
	},
});

export const {
	toggleCatalogVisible,
	setCommentVisible,
	setComments,
	setHeadings,
	setCurrentHeadingId,
	setEditorStore,
  setEditorState,
	resetContentPage,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
