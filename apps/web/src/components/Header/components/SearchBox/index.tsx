import axios from 'axios';
import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import SearchImage from '@/static/icon/search.png';
import Input from '../../../Input';
import { message } from '../../../Message';
import SearchResult from './SearchResult';

const StyledSearchBox = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  flex: 0 1 auto;
`;

const SearchImg = styled.img`
  position: absolute;
  right: 0.5em;
`;

const SearchBox: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [results, setResults] = useState([]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const searchValue = event.target.value;
      setSearchKeyword(searchValue);
      if (!searchValue) setResults([]);
    },
    [setSearchKeyword],
  );

  useEffect(() => {
    if (!searchKeyword.replace(/\s+/g, '')) return;
    const fetchSearchData = async () => {
      const requests = Promise.all([
        axios.get(`/api/articles?keyword=${searchKeyword}`),
        axios.get(`/api/chapters?keyword=${searchKeyword}`),
      ]);

      const res = await requests;
      setResults(res[0]?.data.concat(res[1]?.data).slice(0, 10));
    };

    try {
      fetchSearchData();
    } catch (error) {
      if (axios.isAxiosError(error))
        return message.error((error.response?.data as { message: string })?.message);
      if (error instanceof Error) return message.error(error.message);
      return message.error(JSON.stringify(error));
    }
  }, [searchKeyword, setResults]);

  const onSearchBoxFocus = () => setIsVisible(true);
  const onSearchBoxBlur = () => setIsVisible(false);

  return (
    <div style={{ position: 'relative', margin: '0 1.5em' }}>
      <StyledSearchBox autoComplete="on">
        <Input
          shape="rounded"
          value={searchKeyword}
          placeholder="搜索文章"
          onChange={onChange}
          onFocus={onSearchBoxFocus}
          onBlur={onSearchBoxBlur}
        />
        <SearchImg src={SearchImage} width="24" alt="搜索" />
      </StyledSearchBox>
      <SearchResult setVisible={setIsVisible} visible={isVisible} results={results} />
    </div>
  );
};

export default memo(SearchBox);
