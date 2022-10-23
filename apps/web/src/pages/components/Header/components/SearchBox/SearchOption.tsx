import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface Result {
  title: string;
  tag: string;
  _id: string;
}

const StyledSearchOption = styled.div`
  cursor: pointer;
  padding: 5px 1em;
  margin: 5px 0;
  user-select: none;
  border-radius: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: ${(props) => props.theme.surfaceColor};
  }
`;

interface SearchOptionProps {
  result: Result;
}

const SearchOption: React.FC<SearchOptionProps> = (props) => {
  const { result } = props;
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/${result.tag ? 'articles' : 'chapters'}/${result._id}`);
  };

  return <StyledSearchOption onClick={onClick}>{result.title}</StyledSearchOption>;
};

export default SearchOption;
