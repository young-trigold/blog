import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCurrentIndex } from '@/app/store/pages/adminPage';
import LoadingIndicator from '@/components/LodingIndicator';
import AddArticleTagModal from '@/components/Modals/AddArticleTagModal';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import { useGetNotes } from '@/hooks/notes/useGetNotes';
import { NavigationBarTitle, Option, OptionContainer } from '.';
import AddArticleTagButton from '../buttons/AddArticleTagButton';

export const TagOption = () => {
  const {
    isLoading: isLoadingA,
    isError: isErrorA,
    error: errorA,
    data: articlesByTag,
  } = useGetArticles();
  const tagOptions = articlesByTag?.map((tag) => tag._id);

  const { currentIndex } = useAppSelector((state) => state.adminPage);

  const dispatch = useAppDispatch();
  const setIndex = (index: number) => {
    dispatch(setCurrentIndex(index));
  };

  const { isLoading: isLoadingB, isError: isErrorB, error: errorB, data: notes } = useGetNotes();

  if (isLoadingA || isLoadingB) return <LoadingIndicator />;
  if (isErrorA || isErrorB) return <span>{((errorA || errorB) as Error).message}</span>;

  return (
    <div>
      <NavigationBarTitle>我的文章</NavigationBarTitle>
      <OptionContainer currentIndex={currentIndex - (notes?.length ?? 0)}>
        {tagOptions?.map((tagOption, i) => (
          <Option
            key={i.toString() + Math.random().toString()}
            onClick={() => setIndex(i + (notes?.length ?? 0))}
          >
            {tagOption}
          </Option>
        ))}
        <AddArticleTagButton />
        <AddArticleTagModal />
      </OptionContainer>
    </div>
  );
};
