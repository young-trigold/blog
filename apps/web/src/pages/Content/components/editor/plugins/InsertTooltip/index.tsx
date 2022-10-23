import { AppDispatch, AppState } from '@/app/store';
import { setInsertTooltip } from '@/app/store/pages/contentPage';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import InsertOptionContainer from './InsertOptionContainer';

interface StyledInsertTooltipProps {
	visible: boolean;
	position: Pick<DOMRect, 'left' | 'bottom'>;
}

const StyledInsertTooltip = styled.div<StyledInsertTooltipProps>`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	top: ${(props) => `${props.position.bottom}px`};
	left: ${(props) => `${props.position.left - 7}px`};
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 1px solid ${(props) => props.theme.borderColor};
	box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};
	color: ${(props) => props.theme.warnColor};
	background-color: ${(props) => props.theme.surfaceColor};
	transition: ${(props) => props.theme.transition};
	user-select: none;
	z-index: ${(props) => (props.visible ? 4 : -1)};
	opacity: ${(props) => (props.visible ? 1 : 0)};
`;

interface InsertTooltipProps {}

const InsertTooltip = (props: InsertTooltipProps) => {
	const { insertTooltip } = useSelector((state: AppState) => state.contentPage.editor.plugin);
	const { visible, position } = insertTooltip;
	const [insertOptionContainerVisible, setInsertOptionContainerVisible] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		setInsertOptionContainerVisible(false);
	}, [position]);

	const handleInsertTooltipClicked: React.MouseEventHandler = (event) => {
		event.stopPropagation();
		dispatch(
			setInsertTooltip({
				...insertTooltip,
				visible: false,
			}),
		);
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
				✛
			</StyledInsertTooltip>
			{insertOptionContainerVisible && <InsertOptionContainer />}
		</>
	);
};

export default memo(InsertTooltip);
