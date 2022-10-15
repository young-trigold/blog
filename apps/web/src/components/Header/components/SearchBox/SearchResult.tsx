import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import SearchOption, { Result } from './SearchOption';

interface StyledSearchResultProps {
  visible: boolean;
}

const StyledSearchResult = styled.nav<StyledSearchResultProps>`
  width: 100%;
  position: absolute;
  top: 36px;
  z-index: 3;
  background-color: ${(props) => props.theme.foregroundColor};
  border-radius: 6.4px;
  box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: ${(props) => props.theme.transition};
  transform-origin: 0 0;
  transform: ${(props) => (props.visible ? 'unset' : 'scaleY(0)')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

interface SearchResultProps extends StyledSearchResultProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  results: Result[];
}

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { visible, results } = props;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'ArrowUp') {
        console.debug('up');
      }
      if (key === 'ArrowDown') {
        console.debug('down');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <StyledSearchResult visible={visible} onMouseDown={(event) => event.preventDefault()}>
      {results.map((result) => (
        <SearchOption key={result._id} result={result} />
      ))}
    </StyledSearchResult>
  );
};

export default memo(SearchResult);
