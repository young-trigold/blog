import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { createContext } from 'react';
import EditorStore from 'src/pages/content/components/editor/store';

import { HeadingInfo } from '../../../pages/content/components/catalog/Catalog';
import { CommentInfo } from '../../../pages/content/components/comment/CommentList';

export interface ContentPageContext {
	isChapter: boolean;
}

export const ContentPageContext = createContext<ContentPageContext>({
	isChapter: false,
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
		editorContent: string | undefined;
		editorStore: EditorStore | null;
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
		editorContent: undefined,
		editorStore: null,
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
		setInsertTooltipVisible: (state, action: PayloadAction<InsertTooltipState['visible']>) => {
			state.editor.plugin.insertTooltip.visible = action.payload;
		},
		setInsertTooltip: (state, action: PayloadAction<InsertTooltipState>) => {
			state.editor.plugin.insertTooltip = action.payload;
		},
		setSelectionTooltip: (state, action: PayloadAction<SelectionTooltipState>) => {
			state.editor.plugin.selectionTooltip = action.payload;
		},
		setSelectionTooltipVisible: (
			state,
			action: PayloadAction<SelectionTooltipState['visible']>,
		) => {
			state.editor.plugin.selectionTooltip.visible = action.payload;
		},
		setEditorContent: (state, action: PayloadAction<string>) => {
			state.editor.editorContent = action.payload;
		},
		setEditorStore: (state, action: PayloadAction<EditorStore | null>) => {
			state.editor.editorStore = action.payload as any;
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
	setInsertTooltipVisible,
	setInsertTooltip,
	setSelectionTooltip,
	setSelectionTooltipVisible,
	setEditorContent,
	setEditorStore,
	resetContentPage,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
