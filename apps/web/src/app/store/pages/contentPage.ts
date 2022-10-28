import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { DOMParser, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createContext } from 'react';
import plugins from '../../../pages/content/components/editor/plugins';
import schema from '../../../pages/content/components/editor/schema';

import { HeadingInfo } from '../../../pages/content/components/catalog/Catalog';
import { CommentInfo } from '../../../pages/content/components/comment/CommentList';

export const ContentPageContext = createContext({
	editable: false,
	isChapter: false,
});

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
		editorView: EditorView | null;
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
		editorView: null,
		editorState: null,
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
		setEditorContent: (state, action) => {
			state.editor.editorContent = action.payload;
		},
		setEditorState: (state, action) => {
			state.editor.editorState = action.payload;
			state.editor.editorContent = JSON.stringify(action.payload.doc.toJSON());
		},
		resetContentPage: (state, action) => {
			const { catalog, comment, editor, title, error } = action.payload;
			state.catalog = catalog;
			state.comment = comment;
			state.editor = editor;
			state.title = title;
			state.error = error;
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
	setEditorView,
	setEditorContent,
	setEditorState,
	resetContentPage,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
