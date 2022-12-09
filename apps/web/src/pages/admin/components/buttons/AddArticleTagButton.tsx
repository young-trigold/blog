import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import { setAddArticleTagModalVisible } from '@/app/store/modals';
import AddIcon from '@/static/icon/plus.png';

const StyledAddArticleTagButton = styled.button`
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

const AddArticleTagButton = () => {
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddArticleTagModalVisible(visible));
	}, []);

	const onClick = useCallback(() => {
		setVisible(true);
	}, [setVisible]);

	return (
		<StyledAddArticleTagButton type="button" onClick={onClick}>
			<img src={AddIcon} alt="添加标签" width="20" />
		</StyledAddArticleTagButton>
	);
};

export default memo(AddArticleTagButton);
