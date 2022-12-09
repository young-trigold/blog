import CancelIcon from '@/static/icon/cancel.png';
import React, { memo, PropsWithChildren, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { modalContainerId } from './ModalContainer';

interface StyledModalProps {
	visible: boolean;
}

export interface ModalProps extends StyledModalProps {
	setVisible: (visible: boolean) => void;
	title: string;
}

const StyledModal = styled.dialog<StyledModalProps>`
	display: block;
	padding: 0;
	width: 300px;
	color: ${(props) => props.theme.textColor};
	background-color: ${(props) => props.theme.surfaceColor};
	border-radius: 8px;
	border: none;
	box-shadow: ${(props) => `1px 1px 4px ${props.theme.shadowColor}`};
	transition: ${(props) => props.theme.transition};
	position: relative;
	transform: ${(props) => (props.visible ? 'unset' : 'translateY(-200px)')};
	overflow: hidden;
`;

const StyledIconButton = styled.img`
	user-select: none;
	position: absolute;
	top: 1em;
	right: 1em;
	cursor: pointer;
	width: 20px;
	transition: ${(props) => props.theme.transition};
	&:hover {
		filter: brightness(1.2);
	}
	&:active {
		scale: 0.9;
	}
`;

const StyledModalTitle = styled.h3`
	color: ${(props) => props.theme.textColor};
`;

const Modal: React.FC<PropsWithChildren<ModalProps>> = (props) => {
	const { title, visible, setVisible, children } = props;

	const onClick: React.MouseEventHandler = useCallback((event) => {
		event.stopPropagation();
	}, []);

	const onClose = useCallback(() => {
		setVisible(false);
	}, []);

	if (!visible) return null;

	return createPortal(
		<StyledModal visible={visible} onClick={onClick}>
			<StyledIconButton src={CancelIcon} alt="关闭弹窗" draggable={false} onClick={onClose} />
			<header style={{ margin: '1em 2em' }}>
				<StyledModalTitle>{title}</StyledModalTitle>
			</header>
			<main style={{ margin: '1em 2em' }}>{children}</main>
		</StyledModal>,
		document.getElementById('modal-container')!,
	);
};

export default memo(Modal);
