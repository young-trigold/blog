import styled from 'styled-components';

import { AppState } from '@/app/store';
import LoadingIndicator from '@/components/LodingIndicator';
import { message } from '@/components/Message';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Note from './Note';

const StyledNoteShow = styled.section`
	padding: 2em 1em;
	display: grid;
	grid-template-columns: repeat(auto-fill, 200px);
	grid-gap: 2em;
	justify-content: space-evenly;
`;

const StyledNoteContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const NoteShow = () => {
	const { notes, loading, error } = useSelector((state: AppState) => state.notePage);

	useEffect(() => {
		if (error) message.error(error?.message ?? '请求错误!');
	}, [error]);

	return (
		<StyledNoteShow>
			{loading ? (
				<LoadingIndicator text="笔记马上就好" />
			) : (
				notes.map((note) => (
					<StyledNoteContainer key={note._id}>
						<Note note={note} />
					</StyledNoteContainer>
				))
			)}
		</StyledNoteShow>
	);
};

export default NoteShow;
