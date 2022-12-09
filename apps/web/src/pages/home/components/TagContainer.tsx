import { useAppDispatch } from '@/app/store';
import { setTagIndex } from '@/app/store/pages/homePage';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

export interface TagContainerProps {
	tagIndex: number;
	tags?: string[];
}

const StyledTagContainer = styled.nav<TagContainerProps>`
	z-index: 2;
	background-color: transparent;
	user-select: none;
	display: flex;
	flex-wrap: wrap;
	background-color: ${(props) => props.theme.foregroundColor};
	justify-content: center;
	box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};

	& > button:nth-of-type(${(props) => props.tagIndex + 1}) {
		color: ${(props) => props.theme.backgroundColor};
		box-shadow: 0 0 3px ${(props) => props.theme.shadowColor};
		background-color: ${(props) => props.theme.activeColor};
	}
`;

const StyledTag = styled.button`
	user-select: none;
	font-size: 16px;
	color: ${(props) => props.theme.textColor};
	border: none;
	border-radius: 1em;
	margin: 0.5em;
	cursor: pointer;
	background-color: ${(props) => props.theme.foregroundColor};

	&:hover {
		color: ${(props) => props.theme.backgroundColor};
		background-color: ${(props) => props.theme.hoverColor};
	}

	&:active {
		color: ${(props) => props.theme.backgroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}
`;

interface TagProps {
	tag: string;
	currentIndex: number;
}

const Tag: React.FC<TagProps> = memo((props) => {
	const { tag, currentIndex } = props;
	const dispatch = useAppDispatch();
	const onClick = useCallback(() => {
		dispatch(setTagIndex(currentIndex));
	}, []);

	return <StyledTag onClick={onClick}>{tag}</StyledTag>;
});

const TagContainer: React.FC<TagContainerProps> = (props) => {
	const { tags, tagIndex } = props;

	return (
		<StyledTagContainer tagIndex={tagIndex}>
			{tags?.map((tag, currentIndex) => (
				<Tag key={tag} tag={tag} currentIndex={currentIndex}></Tag>
			))}
		</StyledTagContainer>
	);
};

export default TagContainer;
