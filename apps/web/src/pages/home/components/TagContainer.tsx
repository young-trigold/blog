import { AppState, useAppDispatch } from '@/app/store';
import { setTagIndex } from '@/app/store/pages/homePage';
import LoadingIndicator from '@/components/LodingIndicator';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface StyledTagContainerProps {
  tagIndex: number;
}

const StyledTagContainer = styled.nav<StyledTagContainerProps>`
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

const Tag: React.FC<TagProps> = (props) => {
  const { tag, currentIndex } = props;
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    dispatch(setTagIndex(currentIndex));
  }, []);

  return <StyledTag onClick={onClick}>{tag}</StyledTag>;
};

const TagContainer: React.FC = () => {
  const { tagIndex } = useSelector((state: AppState) => state.homePage);
  const { isLoading, isError, error, data: articlesByTag } = useGetArticles();

  const tags = articlesByTag?.map((tag) => tag._id);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledTagContainer tagIndex={tagIndex}>
      {tags?.map((tag, currentIndex) => (
        <Tag key={tag} tag={tag} currentIndex={currentIndex}></Tag>
      ))}
    </StyledTagContainer>
  );
};

export default TagContainer;
