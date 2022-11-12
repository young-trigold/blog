import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
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
	background-color: ${(props) => props.theme.foregroundColor};
	padding: 1em;
`;

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = (props) => {
	const { visible, direction = 'top', children } = props;

	return (
		<StyledTooltipContainer visible={visible} direction={direction}>
			{children}
		</StyledTooltipContainer>
	);
};

export const useTooltip = (ref: React.RefObject<HTMLElement>, tooltip: React.ReactNode) => {
	const rootRef = useRef<Root | null>(null);

	useEffect(() => {
		if (!ref.current) return;
		const positioner = document.createElement('div');
		positioner.style.position = 'absolute';
		positioner.style.width = '100%';
		positioner.style.left = '0';
		positioner.style.top = '0';

		rootRef.current = createRoot(positioner);
		rootRef.current.render(tooltip);
		ref.current.appendChild(positioner);

		return () => {
			positioner.remove();
		};
	}, []);

	useEffect(() => {
		rootRef.current?.render(tooltip);
	}, [tooltip]);
};

export default Tooltip;
