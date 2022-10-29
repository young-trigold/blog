import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { createContext } from 'react';

import { HeadingInfo } from '../../../pages/content/components/catalog/Catalog';
import { CommentInfo } from '../../../pages/content/components/comment/CommentList';

export const ContentPageContext = createContext<{
	editable: boolean;
	isChapter: boolean;
	editorViewRef: React.MutableRefObject<EditorView | null>;
}>({
	editable: false,
	isChapter: false,
	editorViewRef: React.createRef(),
});

export type InsertTooltipState = {
	visible: boolean;
	canInsertBlock: boolean;
	position: Pick<DOMRect, 'left' | 'top'>;
};

export type SelectionTooltipState = {
	visible: boolean;
	position: Pick<DOMRect, 'left' | 'top'>;
};

interface ContentPageState {
	title: string;
	catalog: {
		visible: boolean;
		headings: HeadingInfo[];
		currentHeadingID: string;
	};
	comment: {
		visible: boolean;
		comments: CommentInfo[];
	};
	editor: {
		editorContent: string;
		editorState: EditorState | null;
		plugin: {
			insertTooltip: InsertTooltipState;
			selectionTooltip: SelectionTooltipState;
		};
	};
	loading: boolean;
	error: null | SerializedError;
}

export const initialState: ContentPageState = {
	title: '',
	catalog: {
		visible: false,
		headings: [],
		currentHeadingID: '',
	},
	comment: {
		visible: true,
		comments: [],
	},
	editor: {
		editorContent: '',
		editorState: null,
		plugin: {
			insertTooltip: {
				visible: false,
				canInsertBlock: false,
				position: {
					left: 0,
					top: 0,
				},
			},
			selectionTooltip: {
				visible: false,
				position: {
					left: 0,
					top: 0,
				},
			},
		},
	},
	error: null,
	loading: false,
};

interface ItemInfo {
	title: string;
	content: string;
	comments: CommentInfo[];
}

export const fetchContentPageDataByID = createAsyncThunk(
	'fetchContentPageDataByIDStatus',
	async (fetchOption: { itemID: string | undefined; isChapter: boolean }, { rejectWithValue }) => {
		try {
			const url = `/api/${fetchOption.isChapter ? 'notes' : 'articles'}/${fetchOption.itemID}`;
			const res = await axios.get<ItemInfo>(url);
			return res.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

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
		setCurrentHeadingID: (state, action: PayloadAction<string>) => {
			state.catalog.currentHeadingID = action.payload;
		},
		setInsertTooltip: (state, action: PayloadAction<InsertTooltipState>) => {
			state.editor.plugin.insertTooltip = action.payload;
		},
		setSelectionTooltip: (state, action: PayloadAction<SelectionTooltipState>) => {
			state.editor.plugin.selectionTooltip = action.payload;
		},
		setEditorContent: (state, action: PayloadAction<string>) => {
			state.editor.editorContent = action.payload;
		},
		setEditorState: (state, action: PayloadAction<EditorState>) => {
			state.editor.editorState = action.payload as any;
		},
		resetContentPage: (state) => {
			const { catalog, comment, editor, title, error, loading } = initialState;
			state.catalog = catalog;
			state.comment = comment;
			state.editor = editor as any;
			state.title = title;
			state.error = error;
			state.loading = loading;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchContentPageDataByID.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchContentPageDataByID.fulfilled, (state, action) => {
				state.title = action.payload.title;
				state.comment.comments = action.payload.comments;
				state.editor.editorContent = action.payload.content;
				state.loading = false;
			})
			.addCase(fetchContentPageDataByID.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export const {
	toggleCatalogVisible,
	setCommentVisible,
	setComments,
	setHeadings,
	setCurrentHeadingID,
	setInsertTooltip,
	setSelectionTooltip,
	setEditorContent,
	setEditorState,
	resetContentPage,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
