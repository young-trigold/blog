import { AppDispatch, AppState } from '@/app/store';
import { setLogoutModalVisible } from '@/app/store/modals';
import Divider from '@/components/Divider';
import DefaultAvatarSrc from '@/static/icon/default-avatar.png';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface StyledAvatarPanelContainerProps {
	visible: boolean;
}

const StyledAvatarPanelContainer = styled.div<StyledAvatarPanelContainerProps>`
	position: absolute;
	z-index: 3;
	right: 0;
	top: 30px;
	width: 180px;
	background-color: ${(props) => props.theme.foregroundColor};
	border-radius: 6.4px;
	box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
	transform-origin: 0 0;
	transform: ${(props) => (props.visible ? 'unset' : 'scaleY(0)')};
	opacity: ${(props) => (props.visible ? 1 : 0)};
	transition: ${(props) => props.theme.transition};
`;

interface AvatarPanelProps extends StyledAvatarPanelContainerProps {
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledOption = styled.div`
	cursor: pointer;
	padding: 5px 1em;
	border-radius: 4px;
	user-select: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	&:hover {
		background-color: ${(props) => props.theme.surfaceColor};
	}
`;

const AvatarImgContainer = styled.figure`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100px;
	margin: 1em auto;
`;

const AvatarPanel: React.FC<AvatarPanelProps> = (props) => {
	const { visible, setVisible } = props;
	const { info } = useSelector((state: AppState) => state.user);

	const navigate = useNavigate();

	const enterAdminPage = () => {
		navigate('/admin');
	};

	const dispatch = useDispatch<AppDispatch>();
	const logout = () => {
		dispatch(setLogoutModalVisible(true));
	};

	const toUserPage = () => {
		navigate(`/users/${info?.id}`);
	};

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!visible) return;
		const onWindowClick = (event: MouseEvent) => {
			if (!ref.current) return;
			if (!(event.target instanceof HTMLElement)) return;
			if (!ref.current.contains(event.target)) setVisible(false);
		};
		window.addEventListener('click', onWindowClick);

		return () => {
			window.addEventListener('click', onWindowClick);
		};
	}, [visible]);

	return (
		<StyledAvatarPanelContainer visible={visible} ref={ref}>
			<AvatarImgContainer>
				<img
					src={DefaultAvatarSrc}
					alt="用户图像"
					style={{ width: '100%', borderRadius: '50%', overflow: 'hidden', marginBottom: '1em' }}
				/>
				<figcaption>
					<strong style={{ fontSize: 'large' }}>{info?.name}</strong>
				</figcaption>
			</AvatarImgContainer>

			<Divider />
			<section style={{ margin: '0.5em 0' }}>
				<StyledOption onClick={toUserPage}>个人主页</StyledOption>
				{info?.role === 'admin' ? (
					<StyledOption onClick={enterAdminPage}>进入后台</StyledOption>
				) : null}
				<Divider />
				<StyledOption onClick={logout}>退出登录</StyledOption>
			</section>
		</StyledAvatarPanelContainer>
	);
};

export default AvatarPanel;
