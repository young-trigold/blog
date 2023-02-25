import styled from 'styled-components';

import { useAppSelector } from '@/app/store';
import LoadingIndicator from '@/components/LodingIndicator';
import AddNoteModal from '@/components/Modals/AddNoteModal';
import { useGetNotes } from '@/hooks/notes/useGetNotes';
import AddNoteButton from './AddNoteButton';
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
  const { info } = useAppSelector((state) => state.user);
  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledNoteShow>
      {notes?.map((note) => (
        <StyledNoteContainer key={note._id}>
          <Note note={note} />
        </StyledNoteContainer>
      ))}
      {info?.role === 'admin' && (
        <>
          <AddNoteButton />
          <AddNoteModal />
        </>
      )}
    </StyledNoteShow>
  );
};

export default NoteShow;
