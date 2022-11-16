import { useAppSelector } from '@/app/store';
import getUniqueID from '@/utils/getUniqueID';
import { memo } from 'react';
import styled from 'styled-components';
import InsertLinkModal from '../Modals/InsertLinkModal';
import LoginModal from '../Modals/LoginModal';
import LogoutModal from '../Modals/LogoutModal';

interface StyledModalContainerProps {
	visible: boolean;
}

const StyledModalContainer = styled.div<StyledModalContainerProps>`
	display: flex;
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	transition: ${(props) => props.theme.transition};
	background-color: rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	z-index: 5;
	backdrop-filter: blur(6px);
	transform-origin: 50% 0;
	transform: ${(props) => (props.visible ? '' : 'scaleY(0)')};
`;

export const modalContainerId = getUniqueID();

const ModalContainer: React.FC = () => {
	const { visible } = useAppSelector((state) => state.modal.modalContainer);

	return (
		<StyledModalContainer visible={visible} id="modal-container">
			<LoginModal />
			<LogoutModal />
			<InsertLinkModal />
		</StyledModalContainer>
	);
};

export default memo(ModalContainer);
