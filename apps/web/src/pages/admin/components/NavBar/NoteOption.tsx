import { useGetNotes } from '@/hooks/notes/useGetNotes';
import { NoteInfo } from 'src/pages/notes';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCurrentIndex } from '@/app/store/pages/adminPage';
import LoadingIndicator from '@/components/LodingIndicator';
import AddNoteModal from '@/components/Modals/AddNoteModal';
import { NavigationBarTitle, Option, OptionContainer } from '.';
import AddNoteButton from '../buttons/AddNoteButton';

export const NoteOption = () => {
  const { isLoading, isError, error, data: notes } = useGetNotes();
  const noteOptions = notes?.map((note: NoteInfo) => ({ title: note.title, _id: note._id }));
  const { currentIndex } = useAppSelector((state) => state.adminPage);
  const dispatch = useAppDispatch();

  const setIndex = (index: number) => {
    dispatch(setCurrentIndex(index));
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
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
  );
};
