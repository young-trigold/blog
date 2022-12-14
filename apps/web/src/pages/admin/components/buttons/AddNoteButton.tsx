import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import AddIcon from '@/static/icon/plus.png';

const StyledAddNoteButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	width: 100%;
	text-align: center;
	border-radius: 4px;
	padding: 0.5em 0;
	background-color: ${(props) => props.theme.foregroundColor};

	&:hover {
		background-color: ${(props) => props.theme.surfaceColor};
	}

	&:active {
		background-color: ${(props) => props.theme.primaryColor};
	}
`;

const AddNoteButton = () => {
	const dispatch = useAppDispatch();
	const onClick = useCallback(() => {
		dispatch(openModal(CurrentModal.AddNote));
	}, []);

	return (
		<StyledAddNoteButton type="button" onClick={onClick}>
			<img src={AddIcon} alt="添加" width={20} />
		</StyledAddNoteButton>
	);
};

export default memo(AddNoteButton);
