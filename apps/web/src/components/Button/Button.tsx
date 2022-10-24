import { debounce } from 'lodash';
import React, { memo, PropsWithChildren, useCallback } from 'react';
import styled from 'styled-components';

import { Size, State } from '@/app/theme/styled';
import addMediaEffect from '@/utils/addMediaEffect';
import TextPressSoundSrc from '../../static/audio/text-press.mp3';

export type ButtonType = 'elevated' | 'outlined' | 'text';
export type ButtonShape = 'rect' | 'rounded' | 'circular';

interface StyledButtonProps {
	buttonType?: ButtonType;
	state?: State;
	shape?: ButtonShape;
	size?: Size;
	isFullWidth?: boolean;
	disabled?: boolean;
}

export interface ButtonProps extends StyledButtonProps {
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	tabIndex?: number;
}

const StyledButton = styled.button<StyledButtonProps>`
	width: ${(props) => (props.isFullWidth ? '100%' : 'unset')};
	filter: ${(props) => (props.disabled ? 'grayscale(50%)' : 'unset')};
	background-color: ${(props) =>
		(() => {
			if (props.buttonType === 'elevated') return props.theme.primaryColor;
			return 'unset';
		})()};
	border: ${(props) =>
		(() => {
			if (props.buttonType === 'outlined') return `1px solid ${props.theme.borderColor}`;
			return 'none';
		})()};
	font-size: ${(props) =>
		(() => {
			switch (props.size) {
				case 'large':
					return '18px';
				case 'small':
					return '14px';
				default:
					return '16px';
			}
		})()};
	color: ${(props) =>
		(() => {
			if (props.buttonType === 'elevated') return props.theme.backgroundColor;
			else if (props.buttonType === 'outlined') return props.theme.primaryColor;
			switch (props.state) {
				case 'dange':
					return props.theme.dangeColor;
				case 'success':
					return props.theme.successColor;
				case 'warn':
					return props.theme.warnColor;
				default:
					return props.theme.textColor;
			}
		})()};
	padding: ${(props) =>
		(() => {
			switch (props.size) {
				case 'large':
					return '0.5em 1em';
				case 'small':
					return '0 0.5em';
				default:
					return '0.25em 1em';
			}
		})()};
	border-radius: ${(props) =>
		(() => {
			switch (props.shape) {
				case 'rounded':
					return '1em';
				case 'circular':
					return '50%';
				default:
					return '4px';
			}
		})()};
	transition: ${(props) => props.theme.transition};
	user-select: none;
	touch-action: manipulation;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	position: relative;
	white-space: pre;
	flex: 0 0 auto;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&:hover,
	&:focus {
		border-color: ${(props) => (props.buttonType === 'outlined' ? props.theme.hoverColor : 'none')};
		background-color: ${(props) =>
			props.buttonType !== 'outlined' ? props.theme.hoverColor : 'unset'};
	}

	&:active {
		color: ${(props) =>
			(() => {
				switch (props.buttonType) {
					case 'elevated':
						return props.theme.backgroundColor;
					case 'outlined':
						return props.theme.activeColor;
					default:
						return props.theme.textColor;
				}
			})()};
		border-color: ${(props) =>
			props.buttonType === 'outlined' ? props.theme.activeColor : 'none'};
		background-color: ${(props) =>
			props.buttonType === 'elevated' ? props.theme.activeColor : 'unset'};
		transform: translateY(2px);
	}
`;

const Button: React.FC<PropsWithChildren<ButtonProps>> = memo((props) => {
	const {
		onClick,
		buttonType = 'outlined',
		state,
		size = 'middle',
		shape = 'rect',
		children = '按钮',
		disabled = false,
		tabIndex,
		isFullWidth = false,
	} = props;

	const handleClick: React.MouseEventHandler = useCallback(
		debounce(
			(event) => {
				if (disabled) {
					event.preventDefault();
					return;
				}

				if (onClick) addMediaEffect(onClick, TextPressSoundSrc)(event);
			},
			300,
			{ leading: true },
		),
		[onClick],
	);

	return (
		<StyledButton
			onClick={handleClick}
			buttonType={buttonType}
			state={state}
			shape={shape}
			size={size}
			disabled={disabled}
			type="button"
			tabIndex={tabIndex}
			isFullWidth={isFullWidth}
		>
			{children}
		</StyledButton>
	);
});

export default Button;
