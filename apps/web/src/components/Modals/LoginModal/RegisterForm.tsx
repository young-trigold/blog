/* eslint-disable jsx-a11y/tabindex-no-positive */
import { UserInfo } from '@/app/store/user';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import EyeClose from '@/static/icon/eye-close.png';
import EyeOpen from '@/static/icon/eye-open.png';
import axios from 'axios';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledPasswordButton } from './LoginForm';

interface RegisterFormProps {
	setLogging: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
	const { setLogging } = props;

	const initialFormState = useMemo(
		() => ({
			name: '',
			password: { value: '', visible: false },
			passwordConfirmed: { value: '', visible: false },
		}),
		[],
	);

	const [formState, setFormState] = useState(initialFormState);

	const showPassword = useCallback(() => {
		const newFormState = {
			...formState,
			password: { visible: true, value: formState.password.value },
		};
		setFormState(newFormState);
	}, [formState]);

	const hidePassword = useCallback(() => {
		const newFormState = {
			...formState,
			password: { visible: false, value: formState.password.value },
		};
		setFormState(newFormState);
	}, [formState]);

	const showConfirmPassword = useCallback(() => {
		const newFormState = {
			...formState,
			passwordConfirmed: {
				visible: true,
				value: formState.passwordConfirmed.value,
			},
		};
		setFormState(newFormState);
	}, [formState]);

	const hideConfirmPassword = useCallback(() => {
		const newFormState = {
			...formState,
			passwordConfirmed: {
				visible: false,
				value: formState.passwordConfirmed.value,
			},
		};
		setFormState(newFormState);
	}, [formState]);

	const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const newFormState = {
				...formState,
				name: event.target.value,
			};
			setFormState(newFormState);
		},
		[formState],
	);

	const handlePwdChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const newFormState = {
				...formState,
				password: { visible: formState.password.visible, value: event.target.value },
			};
			setFormState(newFormState);
		},
		[formState],
	);

	const handlePwdConfirmedChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const newFormState = {
				...formState,
				passwordConfirmed: {
					visible: formState.passwordConfirmed.visible,
					value: event.target.value,
				},
			};
			setFormState(newFormState);
		},
		[formState],
	);

	const toggleLogging: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setLogging(true);
	}, []);

	const register = useCallback(async () => {
		try {
			await axios.post<any, { data: UserInfo }>(
				'/api/register',
				{ name: formState.name, pwd: formState.password.value },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			message.success('注册成功!');
			setFormState(initialFormState);
		} catch (error) {
			if (axios.isAxiosError(error))
				return message.error((error.response?.data as { message: string })?.message);
			if (error instanceof Error) return message.error(error.message);
			return message.error(JSON.stringify(error));
		}
	}, [formState.name, formState.password.value]);

	const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();
			register();
		},
		[register],
	);

	const disabled = useMemo(() => {
		let pass = true;

		if (
			formState.name.replace(/\s+/g, '') === '' ||
			formState.password.value.replace(/\s+/g, '') === '' ||
			formState.passwordConfirmed.value.replace(/\s+/g, '') === ''
		)
			pass = false;
		if (formState.name.length < 1 || formState.name.length > 16) pass = false;
		if (formState.password.value.length < 6 || formState.password.value.length > 16) pass = false;
		if (formState.passwordConfirmed.value !== formState.password.value) pass = false;
		return !pass;
	}, [formState.name, formState.password.value, formState.passwordConfirmed.value]);

	useEffect(() => {
		const onKeyPress = (event: KeyboardEvent) => {
			const { key } = event;
			if (key === 'Enter') {
				if (disabled) return message.warn('所填字段不满足要求');
				register();
			}
		};

		window.addEventListener('keypress', onKeyPress);

		return () => {
			window.removeEventListener('keypress', onKeyPress);
		};
	}, [formState.name, formState.password.value, formState.passwordConfirmed.value]);

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
				<StyledPasswordButton onMouseEnter={showPassword} onMouseLeave={hidePassword}>
					<img alt="眼睛开合" src={formState.password.visible ? EyeOpen : EyeClose} width="16" />
				</StyledPasswordButton>
			</div>
			<div style={{ position: 'relative' }}>
				<Input
					tabIndex={3}
					value={formState.passwordConfirmed.value}
					maxLength={16}
					minLength={6}
					type={formState.passwordConfirmed.visible ? 'text' : 'password'}
					placeholder="确认密码"
					onChange={handlePwdConfirmedChange}
					style={{ marginBottom: '1em' }}
				/>
				<StyledPasswordButton onMouseEnter={showConfirmPassword} onMouseLeave={hideConfirmPassword}>
					<img
						alt="眼睛开合"
						src={formState.passwordConfirmed.visible ? EyeOpen : EyeClose}
						width="16"
					/>
				</StyledPasswordButton>
			</div>
			<ButtonBar>
				<Button tabIndex={5} onClick={toggleLogging}>
					去登录
				</Button>
				<Button tabIndex={4} buttonType="elevated" onClick={handleSubmit} disabled={disabled}>
					注册
				</Button>
			</ButtonBar>
		</form>
	);
};

export default memo(RegisterForm);
