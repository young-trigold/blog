import styled from 'styled-components';

import LoadingIndicator from '@/components/LoadingIndicator';
import useLoadResource from '@/hooks/useLoadResource';
import { NoteInfo } from '..';
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
  const { resource: notes } = useLoadResource<NoteInfo[]>('/api/notes');

  return notes ? (
    <StyledNoteShow>
      {notes.map((note) => (
        <StyledNoteContainer>
          <Note key={note._id} note={note} />
        </StyledNoteContainer>
      ))}
    </StyledNoteShow>
  ) : (
    <LoadingIndicator text="笔记马上就好" />
  );
};

export default NoteShow;
