import { ChapterInfo } from '../../ChapterList';
import { ArticleInfo } from '../../Home';
import { NoteOption } from './AdminPage';
import ArticleBody from './ArticleBody';
import ChapterBody from './ChapterBody';

export interface AdminBodyProps {
  currentIndex: number;
  noteOptionsLength: number;
  articles: ArticleInfo[][];
  chapters: ChapterInfo[][];
  tagOptions: string[];
  noteOptions: NoteOption[];
}

function AdminBody(props: AdminBodyProps) {
  const { currentIndex, noteOptionsLength, articles, chapters, tagOptions, noteOptions } = props;

  if (currentIndex < noteOptionsLength) {
    return (
      <ChapterBody currentIndex={currentIndex} chapters={chapters} noteOptions={noteOptions} />
    );
  }
  return (
    <ArticleBody
      currentIndex={currentIndex - noteOptionsLength}
      articles={articles}
      tagOptions={tagOptions}
    />
  );
}

export default AdminBody;
