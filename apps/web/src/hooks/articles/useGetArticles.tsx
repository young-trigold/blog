import axios from 'axios';
import { useQuery } from 'react-query';
import { ArticlesByTag } from 'src/pages/home';

const getArticles = async () => {
  const res = await axios.get<ArticlesByTag[]>('/api/articles', { timeout: 2000 });
  return res.data;
};

export const useGetArticles = () =>
  useQuery({
    queryKey: 'articles',
    queryFn: getArticles,
  });
