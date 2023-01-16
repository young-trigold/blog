import axios from 'axios';
import { useQuery } from 'react-query';
import { NoteInfo } from 'src/pages/notes';

const getNotes = async () => {
  const res = await axios.get<NoteInfo[]>('/api/notes', { timeout: 2000 });
  return res.data;
};

export const useGetNotes = () =>
  useQuery({
    queryKey: 'notes',
    queryFn: getNotes,
  });
