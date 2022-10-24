import { toggleMark } from 'prosemirror-commands';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import schema from '../../schema';
import HeadingDecoration from './HeadingDecoration';

interface StyledSelectionTooltipProps {
	visible: boolean;
	position: Pick<DOMRect, 'left' | 'top'>;
}

const StyledSelectionTooltip = styled.div<StyledSelectionTooltipProps>`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 300px;
	visibility: ${(props) => props.visible ? 'unset' : 'hidden'};
	opacity: ${(props) => (props.visible ? 1 : 0)};
	top: ${(props) => `${props.position.top - 38}px`};
	left: ${(props) => `${props.position.left - 121}px`};
	border-radius: 6.4px;
	border: 1px solid ${(props) => props.theme.borderColor};
	box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
	background-color: ${(props) => props.theme.foregroundColor};
	transition: ${(props) => props.theme.transition};
	user-select: none;
	padding: 1px;
	z-index: 1;
`;

const StyledOption = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	font-size: 20px;
	border-radius: 6.4px;
	transition: ${(props) => props.theme.transition};
	font-family: 'Times New Roman';
	cursor: pointer;

	:hover {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.hoverColor};
	}

	:active {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}
`;

interface SelectionTooltipProps {}

const SelectionTooltip = (props: SelectionTooltipProps) => {
	const { position, visible } = useSelector(
		(state: AppState) => state.contentPage.editor.plugin.selectionTooltip,
	);

	const { editorView } = useSelector((state: AppState) => state.contentPage.editor);

	const handleToggleBold: React.MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			if (!editorView) return;
			const command = toggleMark(schema.marks.strong);
			command(editorView.state, editorView.dispatch, editorView);
			event.stopPropagation();
		},
		[editorView],
	);

	const handleToggleEm: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		if (!editorView) return;
		const command = toggleMark(schema.marks.em);
		command(editorView.state, editorView.dispatch, editorView);
	}, [editorView]);

	const handleToggleUnderline: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		if (!editorView) return;
		const command = toggleMark(schema.marks.underline);
		command(editorView.state, editorView.dispatch, editorView);
	}, [editorView]);

	const handleToggleSup: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		if (!editorView) return;
		const command = toggleMark(schema.marks.sup);
		command(editorView.state, editorView.dispatch, editorView);
	}, [editorView]);

	const handleToggleSub: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
		if (!editorView) return;
		const command = toggleMark(schema.marks.sub);
		command(editorView.state, editorView.dispatch, editorView);
	}, [editorView]);

	const handleToggleOrderedList: React.MouseEventHandler<HTMLDivElement> = () => {
		if (!editorView) return;
		console.debug('ordered list option clicked');
	};

	const handleToggleUnorderedList: React.MouseEventHandler<HTMLDivElement> = () => {
		if (!editorView) return;
		console.debug('unordered list option clicked');
	};

	return (
		<StyledSelectionTooltip
			onMouseDown={(event) => event.stopPropagation()}
			visible={visible}
			position={position}
		>
			<HeadingDecoration />
			<StyledOption onClick={handleToggleBold} onMouseDown={(event) => event.preventDefault()}>
				<span style={{ fontWeight: 'bold' }}>B</span>
			</StyledOption>
			<StyledOption onClick={handleToggleEm} onMouseDown={(event) => event.preventDefault()}>
				<span style={{ fontStyle: 'italic' }}>I</span>
			</StyledOption>
			<StyledOption onClick={handleToggleUnderline} onMouseDown={(event) => event.preventDefault()}>
				<span style={{ textDecoration: 'underline' }}>U</span>
			</StyledOption>
			<StyledOption onClick={handleToggleSup} onMouseDown={(event) => event.preventDefault()}>
				<span>
					X<sup>2</sup>
				</span>
			</StyledOption>
			<StyledOption onClick={handleToggleSub} onMouseDown={(event) => event.preventDefault()}>
				<span>
					X<sub>2</sub>
				</span>
			</StyledOption>
			<StyledOption
				onMouseDown={(event) => event.preventDefault()}
				onClick={handleToggleOrderedList}
			>
				<span style={{ display: 'inline-flex', alignItems: 'center' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M4.539 4.1H6.75l.047.008a.15.15 0 01.103.142v5.5l-.008.047a.15.15 0 01-.142.103H5.584l-.047-.008a.15.15 0 01-.103-.142V5.917l-.007-.07a.35.35 0 00-.343-.28h-.779L4.26 5.56a.15.15 0 01-.102-.172l.234-1.167.019-.049a.15.15 0 01.128-.072zM3.105 15.96c.079-1.147 1.052-1.86 2.394-1.86 1.33 0 2.399.853 2.399 1.822 0 .6-.232 1.001-1.007 1.71l-.955.791-.226.177H6l1.75.009.048.007a.15.15 0 01.102.143v.991l-.008.047a.15.15 0 01-.142.103H3.251l-.047-.008a.15.15 0 01-.103-.142v-.608l.007-.045a.15.15 0 01.051-.073l2.252-1.739.299-.234.241-.202c.394-.345.524-.556.527-.792.01-.497-.376-.85-.978-.85l-.134.007c-.521.049-.843.311-.889.778a.105.105 0 01-.105.104H3.237a.134.134 0 01-.132-.136zm7.145-6.933a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 9.25a.75.75 0 100 1.5h8.5a.75.75 0 000-1.5H11zM10.25 5a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 9.25a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H11z"
							fillRule="evenodd"
							clipRule="evenodd"
						/>
					</svg>
				</span>
			</StyledOption>
			<StyledOption
				onMouseDown={(event) => event.preventDefault()}
				onClick={handleToggleUnorderedList}
			>
				<span style={{ display: 'inline-flex', alignItems: 'center' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M6.014 5.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3 1.5a3 3 0 116 0 3 3 0 01-6 0zm7.236-2a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zM11 8.277a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5H11zm0 10a.75.75 0 100 1.5h8.5a.75.75 0 000-1.5H11zm0-4.027a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H11zM4.514 17a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5-3a3 3 0 100 6 3 3 0 000-6z"
							fillRule="evenodd"
							clipRule="evenodd"
						/>
					</svg>
				</span>
			</StyledOption>
		</StyledSelectionTooltip>
	);
};

export default memo(SelectionTooltip);
