import { AppState } from '@/app/store';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/Input/TextArea';
import DefaultAvatarSrc from '@/static/icon/default-avatar.png';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StyledUserInfoPanel = styled.form`
	padding: 1em;
  margin: 0 auto;
  max-width: 400px;
`;

const StyledAvatar = styled.figure`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const UserInfoPanel = () => {
	const { info } = useSelector((state: AppState) => state.user);

	const [userInfoFormState, setUserInfoFormState] = useState({
		avatar: null,
		name: info?.name ?? '',
		introduction: info?.introduction ?? '',
	});

	const onAvatarChange = () => {};

	const onNameInputChange = () => {};

	const onIntroInputChange = () => {};

	const updateUserInfo = () => {};

	const disabled =
		userInfoFormState.name === info?.name || userInfoFormState.introduction === info?.introduction;

	return (
		<StyledUserInfoPanel>
			<section>
				<h3>我的头像</h3>
				<StyledAvatar>
					<img src={info?.avatar ?? DefaultAvatarSrc} alt="用户图像" style={{ width: '100%' }} />
				</StyledAvatar>
			</section>
			<section>
				<h3>用户名</h3>
				<Input value={userInfoFormState.name} onChange={onNameInputChange}></Input>
			</section>
			<section>
				<h3>个人介绍</h3>
				<TextArea value={userInfoFormState.introduction} onChange={onIntroInputChange}></TextArea>
			</section>
			<Button buttonType="elevated" isFullWidth disabled={disabled} onClick={updateUserInfo}>
				保存修改
			</Button>
		</StyledUserInfoPanel>
	);
};

export default UserInfoPanel;
