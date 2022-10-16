/* eslint-disable jsx-a11y/tabindex-no-positive */
import { UserInfo } from '@/app/store/user';
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

  const togglePwdVisible = () => {
    const newFormState = {
      ...formState,
      password: { visible: !formState.password.visible, value: formState.password.value },
    };
    setFormState(newFormState);
  };

  const togglePwdConfirmedVisible = () => {
    const newFormState = {
      ...formState,
      passwordConfirmed: {
        visible: !formState.passwordConfirmed.visible,
        value: formState.passwordConfirmed.value,
      },
    };
    setFormState(newFormState);
  };

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFormState = {
      ...formState,
      name: event.target.value,
    };
    setFormState(newFormState);
  };

  const handlePwdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFormState = {
      ...formState,
      password: { visible: formState.password.visible, value: event.target.value },
    };
    setFormState(newFormState);
  };

  const handlePwdConfirmedChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFormState = {
      ...formState,
      passwordConfirmed: {
        visible: formState.passwordConfirmed.visible,
        value: event.target.value,
      },
    };
    setFormState(newFormState);
  };

  const toggleLogging: React.MouseEventHandler<HTMLButtonElement> = () => {
    setLogging(true);
  };

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
  }, [formState.name, formState.password.value, setFormState]);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    register();
  };

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
        <StyledTogglePwdVisibleButton type="button" onClick={togglePwdVisible}>
          <img alt="眼睛开合" src={formState.password.visible ? EyeOpen : EyeClose} width="16" />
        </StyledTogglePwdVisibleButton>
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
        <StyledTogglePwdVisibleButton type="button" onClick={togglePwdConfirmedVisible}>
          <img
            alt="眼睛开合"
            src={formState.passwordConfirmed.visible ? EyeOpen : EyeClose}
            width="16"
          />
        </StyledTogglePwdVisibleButton>
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

export default RegisterForm;
