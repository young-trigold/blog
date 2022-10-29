import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView, NodeViewConstructor } from 'prosemirror-view';
import { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	ContentPageContext,
	setCurrentHeadingID,
	setInsertTooltip,
	setSelectionTooltip,
} from '@/app/store/pages/contentPage';
import px from '@/utils/realPixel';
import InsertTooltip from './tooltips/InsertTooltip';
import SelectionCommentTooltip from './tooltips/selectionCommentTooltip';
import SelectionTooltip from './tooltips/selectionTooltip';
import getCurrentHeadingID from './utils/getCurrentHeadingID';
import transformEditorProps from './utils/transformEditorProps';

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
	state: EditorState;
	editable: boolean;
	autoFocus?: boolean;
	onChange?: (transaction: Transaction) => void;
	nodeViews?: {
		[node: string]: NodeViewConstructor;
	};
}

const Editor: React.FC<EditorProps> = (props) => {
	const initialPropsRef = useRef<EditorProps | null>(props);
	const { editorViewRef } = useContext(ContentPageContext);
	// 更新 editor props
	editorViewRef.current?.setProps(transformEditorProps(props));

	const editorContainerRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		// ============================== 初始化 editorView ===============================
		const initialEditorView = new EditorView(
			editorContainerRef.current,
			transformEditorProps(initialPropsRef.current!),
		);

		initialPropsRef.current = null;
		editorViewRef.current = initialEditorView;
		dispatch(setCurrentHeadingID(getCurrentHeadingID(initialEditorView.dom.parentElement!)));

		return () => {
			initialEditorView.destroy();
		};
	}, []);

	const { autoFocus, editable } = props;
	useEffect(() => {
		autoFocus && editorViewRef.current?.focus();
	}, []);

	const { plugin } = useSelector((state: AppState) => state.contentPage.editor);
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
		<EditorContainer ref={editorContainerRef} onBlur={onEditorContainerBlur}>
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
