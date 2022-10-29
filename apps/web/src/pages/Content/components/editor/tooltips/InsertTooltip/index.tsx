import { AppState } from '@/app/store';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import InsertOptionContainer from './InsertOptionContainer';

interface StyledInsertTooltipProps {
	visible: boolean;
	position: Pick<DOMRect, 'left' | 'top'>;
}

export const InsertTooltipWidth = 14;
export const InsertTooltipHeight = 14;

const StyledInsertTooltip = styled.div<StyledInsertTooltipProps>`
	position: absolute;
	width: ${() => `${InsertTooltipWidth}px`};
	height: ${() => `${InsertTooltipHeight}px`};
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	opacity: ${(props) => (props.visible ? 1 : 0)};
	visibility: ${(props) => (props.visible ? 'unset' : 'hidden')};
	transform: ${(props) =>
		`translate(${props.position.left - InsertTooltipWidth / 2}px, ${props.position.top + 2}px)`};
	border-radius: 50%;
	border: 1px solid ${(props) => props.theme.borderColor};
	box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};
	color: ${(props) => props.theme.warnColor};
	background-color: ${(props) => props.theme.surfaceColor};
	transition: ${(props) => props.theme.transition};
	user-select: none;
	z-index: 1;
`;

interface InsertTooltipProps {}

const InsertTooltip = (props: InsertTooltipProps) => {
	const { insertTooltip } = useSelector((state: AppState) => state.contentPage.editor.plugin);
	const { visible, position } = insertTooltip;
	const [insertOptionContainerVisible, setInsertOptionContainerVisible] = useState(false);

	useEffect(() => {
		setInsertOptionContainerVisible(false);
	}, [position]);

	const handleInsertTooltipClicked: React.MouseEventHandler = (event) => {
		event.stopPropagation();
		setInsertOptionContainerVisible(true);
	};

	const handleClick = () => {
		setInsertOptionContainerVisible(false);
	};

	useEffect(() => {
		window.addEventListener('click', handleClick);

		return () => {
			window.removeEventListener('click', handleClick);
		};
	}, []);

	return (
		<>
			<StyledInsertTooltip
				visible={visible}
				position={position}
				onClick={handleInsertTooltipClicked}
			>
				<span>✛</span>
			</StyledInsertTooltip>
			{insertOptionContainerVisible && <InsertOptionContainer />}
		</>
	);
};

export default memo(InsertTooltip);
