import axios from 'axios';
import { useQuery } from 'react-query';
import { CommentInfo } from 'src/pages/content/components/comment/CommentList';

export interface ItemInfo {
  title: string;
  content: string;
  comments: CommentInfo[];
}

const getArticle = async (itemId: string | undefined, isChapter: boolean) => {
  const url = `/api/${isChapter ? 'notes' : 'articles'}/${itemId}`;
  const res = await axios.get<ItemInfo>(url);
  return res.data;
};

export const useGetArticle = (itemId: string | undefined, isChapter: boolean) =>
  useQuery({
    queryKey: [itemId, isChapter],
    queryFn: () => getArticle(itemId, isChapter),
  });
