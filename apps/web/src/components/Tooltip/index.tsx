import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

export type Direction = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
	visible: boolean;
	direction?: Direction;
}

interface StyledTooltipProps {
	visible: boolean;
	direction: Direction;
}

const StyledTooltipContainer = styled.div<StyledTooltipProps>`
	position: absolute;
	left: 50%;
	top: 0;
	white-space: nowrap;
	transition: ${(props) => props.theme.transition};
	transform: translate(-50%, -100%);
	opacity: ${(props) => (props.visible ? 1 : 0)};
	visibility: ${(props) => (props.visible ? 'unset' : 'hidden')};
	border-radius: 6.4px;
	box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
	padding: 1em;
	background-color: ${(props) => props.theme.surfaceColor};
`;

const StyledPositioner = styled.div`
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
`;

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = (props) => {
	const { visible, direction = 'top', children } = props;

	return (
		<StyledPositioner>
			<StyledTooltipContainer visible={visible} direction={direction}>
				{children}
			</StyledTooltipContainer>
		</StyledPositioner>
	);
};

export default Tooltip;
