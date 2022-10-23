import { AppState } from '@/app/store';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import ArticleBody from './ArticleBody';
import ChapterBody from './ChapterBody';

interface AdminBodyProps {}

const AdminBody: React.FC<AdminBodyProps> = (props) => {
	const { currentIndex } = useSelector((state: AppState) => state.adminPage);
	const { articlesByTag } = useSelector((state: AppState) => state.homePage);
	const tagOptions = articlesByTag.map((tag) => tag._id);
	const articles = articlesByTag.map((tag) => tag.articles);
	const { notes } = useSelector((state: AppState) => state.notePage);
	const noteOptions = notes.map((note) => ({ _id: note._id, title: note.title }));
	const { length: noteOptionsLength } = noteOptions;
	const chapters = notes.map((note) => note.chapters);

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
};

export default memo(AdminBody);
