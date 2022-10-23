/* eslint-disable jsx-a11y/tabindex-no-positive */
import { UserInfo } from '@/app/store/user';
import watchedLocalStorage from '@/app/store/watchedLocalStorage';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import EyeClose from '@/static/icon/eye-close.png';
import EyeOpen from '@/static/icon/eye-open.png';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledTogglePwdVisibleButton = styled.button`
	background-color: transparent;
	padding: 0;
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0.5em;
	right: 1em;
	border: none;
	cursor: pointer;

	&:hover,
	&:active {
		background-color: ${(props) => props.theme.surfaceColor};
	}
`;

interface LoginFormProps {
	setLogging: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLoginModalVisible: (visible: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
	const { setIsLoginModalVisible, setLogging } = props;
	const initialFormState = useMemo(
		() => ({ password: { value: '', visible: false }, name: '' }),
		[],
	);

	const [formState, setFormState] = useState(initialFormState);

	const togglePwdVisible = useCallback(() => {
		const newFormState = {
			name: formState.name,
			password: { visible: !formState.password.visible, value: formState.password.value },
		};
		setFormState(newFormState);
	}, [setFormState, formState.password.visible, formState.password.value, formState.name]);

	const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const newFormState = {
				...formState,
				name: event.target.value,
			};
			setFormState(newFormState);
		},
		[setFormState, formState.password.value, formState.password.visible],
	);

	const handlePwdChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const newFormState = {
				name: formState.name,
				password: { visible: formState.password.visible, value: event.target.value },
			};
			setFormState(newFormState);
		},
		[setFormState, formState.password.visible, formState.name],
	);

	const toggleLogging: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setLogging(false);
	}, [setLogging]);

	const login = useCallback(async () => {
		try {
			const res = await axios.post<any, { data: UserInfo }>(
				'/api/login',
				{ name: formState.name, pwd: formState.password.value },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			message.success('登录成功!');
			setFormState(initialFormState);
			setIsLoginModalVisible(false);
			watchedLocalStorage.setItem('user', res.data);
		} catch (error) {
			if (axios.isAxiosError(error))
				return message.error((error.response?.data as { message: string })?.message);
			if (error instanceof Error) return message.error(error.message);
			return message.error(JSON.stringify(error));
		}
	}, [formState.name, formState.password.value, setIsLoginModalVisible, setFormState]);

	const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();
			login();
		},
		[login],
	);

	const disabled = useMemo(() => {
		let pass = true;

		if (
			formState.name.replace(/\s+/g, '') === '' ||
			formState.password.value.replace(/\s+/g, '') === ''
		)
			pass = false;
		if (formState.name.length < 1 || formState.name.length > 16) pass = false;
		if (formState.password.value.length < 6 || formState.password.value.length > 16) pass = false;

		return !pass;
	}, [formState.name, formState.password.value]);

	useEffect(() => {
		const onKeyPress = (event: KeyboardEvent) => {
			const { key } = event;
			if (key === 'Enter') {
				if (disabled) return message.warn('所填字段不满足要求');
				login();
			}
		};

		window.addEventListener('keypress', onKeyPress);

		return () => {
			window.removeEventListener('keypress', onKeyPress);
		};
	}, [formState.password.value, formState.name]);

	const nameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		nameInputRef.current?.focus();
	}, [nameInputRef.current]);

	return (
		<form>
			<Input
				tabIndex={1}
				value={formState.name}
				maxLength={16}
				minLength={1}
				onChange={handleNameChange}
				placeholder="用户名"
				ref={nameInputRef}
				style={{ marginBottom: '1em' }}
			/>

			<div style={{ position: 'relative' }}>
				<Input
					tabIndex={2}
					value={formState.password.value}
					maxLength={16}
					minLength={6}
					type={formState.password.visible ? 'text' : 'password'}
					placeholder="密码"
					onChange={handlePwdChange}
					style={{ marginBottom: '1em' }}
				/>
				<StyledTogglePwdVisibleButton type="button" onClick={togglePwdVisible}>
					<img alt="眼睛开合" src={formState.password.visible ? EyeOpen : EyeClose} width="16" />
				</StyledTogglePwdVisibleButton>
			</div>
			<ButtonBar>
				<Button tabIndex={4} onClick={toggleLogging}>
					去注册
				</Button>
				<Button tabIndex={3} buttonType="elevated" onClick={handleSubmit} disabled={disabled}>
					登录
				</Button>
			</ButtonBar>
		</form>
	);
};

export default LoginForm;
