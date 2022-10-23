import { throttle } from 'lodash';
import { DOMParser, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	setCurrentHeadingID,
	setEditorView,
	setInsertTooltip,
	setSelectionTooltip,
} from '@/app/store/contentPage';
import px from '@/utils/realPixel';
import nodeViews from './nodeViews';
import plugins from './plugins';
import InsertTooltip from './plugins/InsertTooltip';
import SelectionCommentTooltip from './plugins/selectionCommentTooltip';
import SelectionTooltip from './plugins/selectionTooltip';
import schema from './schema';
import addHeadingID from './utils/addHeadingID';
import getCurrentHeadingID from './utils/getCurrentHeadingID';

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

export interface EditorProps {
	content: string | undefined;
	editable: boolean;
}

const Editor: React.FC<EditorProps> = (props) => {
	const { content, editable } = props;
	const editorContainerRef = useRef<HTMLDivElement>(null);

	const { plugin } = useSelector((state: AppState) => state.contentPage.editor);
	const dispatch = useDispatch<AppDispatch>();
	const editorViewRef = useRef<EditorView | null>(null);

	// ==================== 处理每次用户和 editor 的交互 transaction 回调
	const dispatchTransaction = (transaction: Transaction) => {
		const { current: editorView } = editorViewRef;
		if (!editorView) return;
		// 加 heading id
		const newEditorState = addHeadingID(editorView.state, transaction);
		editorView.updateState(newEditorState);

		dispatch(setEditorView(editorView));

		// 更新 insert tooltip
		const { selection } = newEditorState;
		const { $head, empty } = selection;
		const { nodeAfter, nodeBefore } = $head;
		const canInsertBlock = nodeAfter === null || nodeBefore === null;
		const cursorPositionToViewPort = editorView.coordsAtPos($head.pos);
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
	};

	// =============================== 初始化 editorView ===============================
	useEffect(() => {
		// 滚动时 同步当前标题 id
		const updateCurrentHeadingIDWhileScroll = throttle(
			() => {
				if (!editorContainerRef.current) return;
				const currentHeadingID = getCurrentHeadingID(editorContainerRef.current);
				if (currentHeadingID) dispatch(setCurrentHeadingID(currentHeadingID));
			},
			60,
			{ trailing: true },
		);

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
			handleDOMEvents: {
				wheel: updateCurrentHeadingIDWhileScroll,
			},
		});

		editorViewRef.current = initialEditorView;
		dispatch(setEditorView(initialEditorView));

		return () => {
			const { current: editorView } = editorViewRef;
			if (!editorView) return;
			editorView.destroy();
			dispatch(setEditorView(null));
			dispatch(setCurrentHeadingID(''));
		};
	}, []);

	useEffect(() => {
		if (!editorContainerRef.current) return;
		dispatch(setCurrentHeadingID(getCurrentHeadingID(editorContainerRef.current)));
	}, [editorViewRef.current, editorContainerRef.current]);

	// ========================================= 处理 编辑器 blur =============================
	const onEditorContainerBlur = () => {
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
	};

	return (
		<EditorContainer ref={editorContainerRef} id="editor-container" onBlur={onEditorContainerBlur}>
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

export default Editor;
