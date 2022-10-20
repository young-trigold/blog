/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { EditorView } from 'prosemirror-view';
import { createContext } from 'react';

import { HeadingInfo } from '../../pages/content/components/catalog/Catalog';
import { CommentInfo } from '../../pages/content/components/comment/CommentList';

export const ContentPageContext = createContext({
	editable: false,
	isChapter: false,
});

export interface ContentPageState {
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
		editorView: EditorView | null;
		content: string | undefined;
		plugin: {
			insertTooltip: {
				visible: boolean;
				canInsertBlock: boolean;
				position: Pick<DOMRect, 'left' | 'bottom'>;
			};
			selectionTooltip: {
				visible: boolean;
				position: Pick<DOMRect, 'left' | 'top'>;
			};
		};
	};
	loading: boolean;
	error: null | SerializedError;
}

const initialState: ContentPageState = {
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
		editorView: null,
		content: '',
		plugin: {
			insertTooltip: {
				visible: false,
				canInsertBlock: false,
				position: {
					left: 0,
					bottom: 0,
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
	loading: true,
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
		setCommentVisible: (state, action) => {
			state.comment.visible = action.payload;
		},
		setComments: (state, action) => {
			state.comment.comments = action.payload;
		},
		setHeadings: (state, action) => {
			state.catalog.headings = action.payload;
		},
		setCurrentHeadingID: (state, action) => {
			state.catalog.currentHeadingID = action.payload;
		},
		setInsertTooltip: (state, action) => {
			state.editor.plugin.insertTooltip = action.payload;
		},
		setSelectionTooltip: (state, action) => {
			state.editor.plugin.selectionTooltip = action.payload;
		},
		setEditorView: (state, action) => {
			state.editor.editorView = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchContentPageDataByID.pending, (state) => {
				state.loading = initialState.loading;
			})
			.addCase(fetchContentPageDataByID.fulfilled, (state, action) => {
				state.loading = false;
				state.title = action.payload.title;
				state.comment.comments = action.payload.comments;
				state.editor.content = action.payload.content;
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
	setEditorView,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
