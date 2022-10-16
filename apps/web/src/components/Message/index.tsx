import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import appStore, { AppState } from '../../app/store';
import { addMessage, clearMessage } from '../../app/store/messages';

import CancelIcon from '../../static/icon/cancel.png';

const StyledMessageContainer = styled.div`
	position: fixed;
	z-index: 6;
	left: 50%;
	padding: 3em 0;
	transform: translateX(-50%);
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	overflow: hidden;
`;

const StyledCancelButton = styled.button`
	padding: 0;
	margin-left: 2em;
	border: none;
	transition: ${(props) => props.theme.transition};
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`;

export interface MessageProps {
	title?: string;
	state?: string;
	visible?: boolean;
	[key: string]: any;
}

const StyledMessage = styled.div<MessageProps>`
	margin: 0.5em 1em;
	border-radius: 4px;
	box-shadow: 1px 1px 3px ${(props) => props.theme.shadowColor};
	background-color: ${(props) => props.theme.surfaceColor};
	color: ${(props) => () => {
		if (props.state === 'warn') {
			return props.theme.warnColor;
		}
		if (props.state === 'error') {
			return props.theme.dangeColor;
		}

		if (props.state === 'success') {
			return props.theme.successColor;
		}

		return props.theme.primaryColor;
	}};
	display: ${(props) => (props.visible ? 'flex' : 'none')};
	padding: 0.5em 1em;
	transition: ${(props) => props.theme.transition};
	align-items: center;
	justify-content: space-between;
	z-index: 4;
	white-space: nowrap;
`;

const Message: React.FC<MessageProps> = (props) => {
	const { title, state } = props;

	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			appStore.dispatch(clearMessage());
		}, 1500);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	const handleClick = useCallback(() => {
		setVisible(false);
	}, [setVisible]);

	return (
		<StyledMessage visible={visible} state={state}>
			<div>{String(title)}</div>
			<StyledCancelButton type="button" onClick={handleClick}>
				<img src={CancelIcon} alt="关闭" width="14" />
			</StyledCancelButton>
		</StyledMessage>
	);
};

const MessageContainer = memo(() => {
	const messages = useSelector((state: AppState) => state.messages.value);

	return (
		<StyledMessageContainer id="message-container">
			{messages.map((message) => (
				<Message key={Math.random().toString(36)} title={message.title} state={message.state} />
			))}
		</StyledMessageContainer>
	);
});

const message = {
	info(title: string) {
		appStore.dispatch(addMessage({ title }));
	},
	warn(title: string) {
		appStore.dispatch(addMessage({ title, state: 'warn' }));
	},
	success(title: string) {
		appStore.dispatch(addMessage({ title, state: 'success' }));
	},
	error(title: string) {
		appStore.dispatch(addMessage({ title, state: 'error' }));
	},
};

export { MessageContainer, message };
