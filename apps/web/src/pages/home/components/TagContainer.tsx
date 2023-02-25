import { useAppDispatch, useAppSelector } from '@/app/store';
import { setTagIndex } from '@/app/store/pages/homePage';
import LoadingIndicator from '@/components/LodingIndicator';
import AddArticleTagModal from '@/components/Modals/AddArticleTagModal';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import AddArticleButton from './AddArticleButton';

interface StyledTagContainerProps {
  tagIndex: number;
}

const StyledTagContainer = styled.nav<StyledTagContainerProps>`
  z-index: 2;
  background-color: transparent;
  user-select: none;
  background-color: ${(props) => props.theme.foregroundColor};
  box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};
  display: grid;
  grid-template-columns: repeat(auto-fill, 4em);
  grid-gap: 1em;
  justify-content: space-between;
  padding: 0.5em 1em;

  & > button:nth-of-type(${(props) => props.tagIndex + 1}) {
    color: ${(props) => props.theme.backgroundColor};
    box-shadow: 0 0 3px ${(props) => props.theme.shadowColor};
    background-color: ${(props) => props.theme.activeColor};
  }
`;

const StyledTag = styled.button`
  width: 4em;
  user-select: none;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: no-wrap;
  color: ${(props) => props.theme.textColor};
  border: none;
  border-radius: 1em;
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
  const { tagIndex } = useAppSelector((state) => state.homePage);
  const { isLoading, isError, error, data: articlesByTag } = useGetArticles();

  const tags = articlesByTag?.map((tag) => tag._id);
  const { info } = useAppSelector((state) => state.user);
  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledTagContainer tagIndex={tagIndex}>
      {tags?.map((tag, currentIndex) => (
        <Tag key={tag} tag={tag} currentIndex={currentIndex}></Tag>
      ))}
      {info?.role === 'admin' && (
        <>
          <AddArticleButton />
          <AddArticleTagModal />
        </>
      )}
    </StyledTagContainer>
  );
};

export default TagContainer;
