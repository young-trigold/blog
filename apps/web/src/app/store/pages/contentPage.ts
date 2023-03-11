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
		plugin: {
			insertTooltip: InsertTooltipState;
			selectionTooltip: SelectionTooltipState;
		};
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
    setSelectionTooltipPosition: (state, action: PayloadAction<Pick<DOMRect, "left" | "top">>) => {
      state.editor.plugin.selectionTooltip.position = action.payload;
    },
		setEditorStore: (state, action: PayloadAction<EditorStore | null>) => {
			state.editor.editorStore = action.payload as any;
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
	setInsertTooltipVisible,
	setInsertTooltip,
	setSelectionTooltip,
  setSelectionTooltipPosition,
	setSelectionTooltipVisible,
	setEditorStore,
	resetContentPage,
} = ContentPageSlice.actions;

export default ContentPageSlice.reducer;
