import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import { setCurrentIndex } from '@/app/store/pages/adminPage';
import AddArticleTagModal from '@/components/Modals/AddArticleTagModal';
import AddNoteModal from '@/components/Modals/AddNoteModal';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArticlesByTag } from 'src/pages/home';
import { NoteInfo } from 'src/pages/notes';
import AddArticleTagButton from '../buttons/AddArticleTagButton';
import AddNoteButton from '../buttons/AddNoteButton';

const NavigationBar = styled.nav`
	padding: 1em;
	min-width: 180px;
	flex: 2;
	border-right: 1px solid ${(props) => props.theme.borderColor};

	@media (max-width: 500px) {
		min-width: 120px;
	}
`;

const NavigationBarTitle = styled.h2`
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
	padding: 6px;
	transition: ${(props) => props.theme.transition};
	user-select: none;
	font-size: 18px;
`;

const OptionContainer = styled.ol<{ currentIndex: number }>`
	user-select: none;
	padding-left: 0;
	margin-left: 2em;
	list-style: none;
	overflow-y: hidden;
	color: ${(props) => props.theme.textColor};
	background-color: ${(props) => props.theme.foregroundColor};

	& > li:nth-of-type(${(props) => props.currentIndex + 1}) {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}

	@media (max-width: 500px) {
		margin-left: 0;
	}
`;

const Option = styled.li`
	margin-top: 0.5em;
	padding: 6px;
	border-bottom: 1px solid ${(props) => props.theme.borderColor};

	&:hover {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.hoverColor};
	}

	&:active {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}
`;

const NavBar = () => {
	const { articlesByTag } = useSelector((state: AppState) => state.homePage);
	const { notes } = useSelector((state: AppState) => state.notePage);
	const noteOptions = notes.map((note: NoteInfo) => ({ title: note.title, _id: note._id }));
	const tagOptions = articlesByTag.map((tag: ArticlesByTag) => tag._id);
	const { currentIndex } = useSelector((state: AppState) => state.adminPage);

	const dispatch = useDispatch<AppDispatch>();
	const setIndex = useCallback((index: number) => {
		dispatch(setCurrentIndex(index));
	}, []);

	return (
		<NavigationBar>
			<div>
				<NavigationBarTitle>我的笔记</NavigationBarTitle>
				<OptionContainer currentIndex={currentIndex}>
					{noteOptions?.map((noteOption, i) => (
						<Option key={noteOption._id} onClick={() => setIndex(i)}>
							{noteOption.title}
						</Option>
					))}
					<AddNoteButton />
					<AddNoteModal />
				</OptionContainer>
			</div>
			<div>
				<NavigationBarTitle>我的文章</NavigationBarTitle>
				<OptionContainer currentIndex={currentIndex - noteOptions.length}>
					{tagOptions.map((tagOption, i) => (
						<Option
							key={i.toString() + Math.random().toString()}
							onClick={() => setIndex(i + noteOptions.length)}
						>
							{tagOption}
						</Option>
					))}
					<AddArticleTagButton />
					<AddArticleTagModal />
				</OptionContainer>
			</div>
		</NavigationBar>
	);
};

export default memo(NavBar);
