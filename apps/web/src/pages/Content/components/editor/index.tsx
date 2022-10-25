import { DOMParser, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	setCurrentHeadingID,
	setEditorView,
	setInsertTooltip,
	setSelectionTooltip,
} from '@/app/store/pages/contentPage';
import getUniqueID from '@/utils/getUniqueID';
import px from '@/utils/realPixel';
import nodeViews from './nodeViews';
import plugins from './plugins';
import InsertTooltip from './plugins/InsertTooltip';
import SelectionCommentTooltip from './plugins/selectionCommentTooltip';
import SelectionTooltip from './plugins/selectionTooltip';
import schema from './schema';
import addHeadingID from './utils/addHeadingID';
import getCurrentHeadingID from './utils/getCurrentHeadingID';

export const EditorContainerId = getUniqueID();

const EditorContainer = styled.article`
	flex: 1 1 760px;
	min-width: 350px;
	z-index: 2;
	transition: ${(props) => props.theme.transition};
	position: relative;
	background-color: ${(props) => props.theme.foregroundColor};
	background-image: linear-gradient(
			to right,
			${(props) => props.theme.shadowColor} ${px()},
			transparent 0
		),
		linear-gradient(to bottom, ${(props) => props.theme.shadowColor} ${px()}, transparent 0);
	background-size: 1.2em 1.2em;
	background-position-x: 0.6em;
	border-radius: 6.4px;
	padding: 1em;
	overflow-wrap: break-word;
	caret-color: ${(props) => props.theme.warnColor};

	@media (max-width: 530px) {
		border-radius: 0;
		margin: 0;
	}

	u {
		text-decoration-color: ${(props) => props.theme.primaryColor};
		transition: ${(props) => props.theme.transition};
	}

	// 段落
	p {
		text-indent: 2em;
	}

	li > p {
		text-indent: 0 !important;
	}

	// 图片
	p img {
		display: block;
		margin: 0 auto;
		max-width: 100%;
	}

	sub,
	sup {
		font-size: 8px;
		position: relative;
		vertical-align: unset;
	}

	sup {
		bottom: 0.6em;
	}

	// 代码块
	.cm-editor {
		font-size: 16px;
		line-height: 1.5em;
		border-radius: 6.4px;
		box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
		background-color: ${(props) => props.theme.foregroundColor};
		transition: ${(props) => props.theme.transition};

		@media (max-width: 400px) {
			font-size: 14px;
			line-height: 1.3em;
		}

		&.cm-focused {
			outline: none;
		}

		// gutters
		.cm-gutters {
			color: ${(props) => props.theme.textColor};
			background-color: ${(props) => props.theme.surfaceColor};
			border-radius: 6.4px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			border-right-color: ${(props) => props.theme.borderColor};
			user-select: none;

			.cm-lineNumbers {
			}

			.cm-foldGutter {
			}

			.cm-gutterElement.cm-activeLineGutter {
				color: ${(props) => props.theme.foregroundColor};
				background-color: ${(props) => props.theme.activeColor};
			}
		}

		// content
		.cm-content {
			.cm-line {
			}

			.cm-line.cm-activeLine {
				color: ${(props) => props.theme.foregroundColor};
				background-color: ${(props) => props.theme.hoverColor};
			}

			::selection {
				color: ${(props) => props.theme.foregroundColor} !important;
				background-color: ${(props) => props.theme.activeColor} !important;
			}
		}
	}

	// 行内代码
	p code {
		font-size: 14px;
		font-style: italic;
		font-weight: bold;
		color: ${(props) => props.theme.activeColor};
		background-color: ${(props) => props.theme.foregroundColor};
		font-family: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace';
		border-radius: 4px;
		transition: ${(props) => props.theme.transition};
	}
`;

interface EditorProps {
	content: string | undefined;
	editable: boolean;
	autoFocus?: boolean;
}

const Editor: React.FC<EditorProps> = (props) => {
	const { content, editable, autoFocus = true } = props;
	const editorContainerRef = useRef<HTMLDivElement>(null);

	const { plugin } = useSelector((state: AppState) => state.contentPage.editor);
	const dispatch = useDispatch<AppDispatch>();
	const editorViewRef = useRef<EditorView | null>(null);

	// 更新插件 state
	const updateTooltipPluginState = useCallback((view: EditorView) => {
		// 更新 insert tooltip
		const { selection } = view.state;
		const { $head, empty } = selection;
		const { nodeAfter, nodeBefore } = $head;
		const canInsertBlock = nodeAfter === null || nodeBefore === null;
		const cursorPositionToViewPort = view.coordsAtPos($head.pos);
		const editorContainerPositionToViewPort = editorContainerRef.current!.getBoundingClientRect();
		dispatch(
			setInsertTooltip({
				visible: empty,
				canInsertBlock,
				position: {
					left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
					bottom: cursorPositionToViewPort.bottom - editorContainerPositionToViewPort.top,
				},
			}),
		);

		dispatch(
			setSelectionTooltip({
				visible: !empty,
				position: {
					left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
					top: cursorPositionToViewPort.top - editorContainerPositionToViewPort.top,
				},
			}),
		);
	}, []);

	// ==================== 处理每次用户和 editor 的交互 transaction 回调
	const dispatchTransaction = (transaction: Transaction) => {
		const { current: editorView } = editorViewRef;
		if (!editorView) return;
		// 加 heading id
		const newEditorState = addHeadingID(editorView.state, transaction);
		editorView.updateState(newEditorState);
		updateTooltipPluginState(editorView);
	};

	// =============================== 初始化 editorView ===============================
	useEffect(() => {
		//  ==================== editor state
		const doc = content
			? ProseMirrorNode.fromJSON(schema, JSON.parse(content))
			: DOMParser.fromSchema(schema).parse(document.createTextNode(''));

		const state = EditorState.create({
			schema,
			doc,
			plugins,
		});

		//  ==================== editor view
		const initialEditorView = new EditorView(editorContainerRef.current, {
			state,
			nodeViews,
			editable: () => editable,
			dispatchTransaction,
		});

		editorViewRef.current = initialEditorView;
		dispatch(setEditorView(initialEditorView));
		dispatch(setCurrentHeadingID(getCurrentHeadingID(editorContainerRef.current!)));
		autoFocus && updateTooltipPluginState(initialEditorView);

		return () => {
			initialEditorView.destroy();
			dispatch(setEditorView(null));
			dispatch(setCurrentHeadingID(''));
		};
	}, []);

	useEffect(() => {
		const { current: editorView } = editorViewRef;
		if (!editorView) return;
		autoFocus && editorView.focus();
	}, []);

	const onEditorContainerBlur = useCallback(() => {
		const { insertTooltip, selectionTooltip } = plugin;
		dispatch(
			setInsertTooltip({
				...insertTooltip,
				visible: false,
			}),
		);
		dispatch(
			setSelectionTooltip({
				...selectionTooltip,
				visible: false,
			}),
		);
	}, [plugin]);

	return (
		<EditorContainer
			ref={editorContainerRef}
			id={EditorContainerId}
			onBlur={onEditorContainerBlur}
		>
			{editable && (
				<>
					<InsertTooltip />
					<SelectionTooltip />
				</>
			)}
			{!editable && <SelectionCommentTooltip />}
		</EditorContainer>
	);
};

export default memo(Editor);
