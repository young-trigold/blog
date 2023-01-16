import { useAppSelector } from '@/app/store';
import LoadingIndicator from '@/components/LodingIndicator';
import { useGetNotes } from '@/hooks/notes/useGetNotes';
import ArticleBody from './ArticleBody';
import ChapterBody from './ChapterBody';

const AdminBody: React.FC = () => {
  const { currentIndex } = useAppSelector((state) => state.adminPage);
  const { isLoading, isError, error, data: notes } = useGetNotes();
  const noteOptions = notes?.map((note) => ({ _id: note._id, title: note.title }));
  const { length: noteOptionsLength = 0 } = noteOptions ?? {};
  const chapters = notes?.map((note) => note.chapters);
  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  if (currentIndex < noteOptionsLength) {
    return (
      <ChapterBody currentIndex={currentIndex} chapters={chapters!} noteOptions={noteOptions!} />
    );
  }
  return <ArticleBody currentIndex={currentIndex - noteOptionsLength} />;
};

export default AdminBody;
