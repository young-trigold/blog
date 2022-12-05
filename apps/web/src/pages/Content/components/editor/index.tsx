import { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import { setEditorStore } from '@/app/store/pages/contentPage';
import px from '@/utils/realPixel';
import { EditorView } from 'prosemirror-view';
import { presetNodeExtensions, presetPlainExtensions } from './extensions';
import { Extension } from './extensions/type';
import EditorStore, { HandleDOMEvents } from './store';
import InsertTooltip from './tooltips/InsertTooltip';
import SelectionCommentTooltip from './tooltips/selectionCommentTooltip';
import SelectionTooltip from './tooltips/selectionTooltip';

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
	editable: boolean;
	autoFocus?: boolean;
	onChange?: (view: EditorView) => void;
	extensions?: Extension[];
	doc?: string;
	handleDOMEvents?: HandleDOMEvents;
}

const Editor: React.FC<EditorProps> = (props) => {
	const {
		extensions = [],
		editable = false,
		autoFocus = true,
		onChange,
		handleDOMEvents,
		doc,
	} = props;

	const editorContainerRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const finalExtensions = [
			...presetNodeExtensions,
			...extensions,
			...(editable ? presetPlainExtensions : [presetPlainExtensions[0]]),
		];

		const editorStore = new EditorStore(finalExtensions);
		const state = editorStore.createEditorState(doc);
		const editorView = editorStore.createEditorView(editorContainerRef.current!, {
			state,
			editable,
			autoFocus,
			onChange,
			handleDOMEvents,
		});
		dispatch(setEditorStore(editorStore));

		return () => {
			editorView.destroy();
			dispatch(setEditorStore(null));
		};
	}, []);

	return (
		<EditorContainer ref={editorContainerRef}>
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
