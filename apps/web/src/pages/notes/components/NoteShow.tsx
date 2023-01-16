import styled from 'styled-components';

import LoadingIndicator from '@/components/LodingIndicator';
import { useGetNotes } from '@/hooks/notes/useGetNotes';
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

const NoteShow: React.FC = () => {
  const { isLoading, isError, error, data: notes } = useGetNotes();

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledNoteShow>
      {notes?.map((note) => (
        <StyledNoteContainer key={note._id}>
          <Note note={note} />
        </StyledNoteContainer>
      ))}
    </StyledNoteShow>
  );
};

export default NoteShow;
