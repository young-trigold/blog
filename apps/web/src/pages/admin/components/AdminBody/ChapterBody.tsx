import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import AddChapterModal from '@/components/Modals/AddChapterModal';
import { useNavigate } from 'react-router-dom';
import { ChapterInfo } from '../../../chpaters';
import { NoteOption } from '../AdminPage';
import AddChapterButton from '../buttons/AddChapterButton';
import DeleteChapterButton from '../buttons/DeleteChapterButton';

const StyledChapterBody = styled.main`
  flex: 8;
  overflow: auto;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export interface OptionInfo {
  _id: string;
  title: string;
}

export interface ChapterBodyProps {
  currentIndex: number;
  chapters: ChapterInfo[][];
  noteOptions: NoteOption[];
}

const ChapterBody: React.FC<ChapterBodyProps> = (props) => {
  const { currentIndex, chapters, noteOptions } = props;
  const navigate = useNavigate();

  const updateItem = useCallback(
    (articleId: string) => {
      navigate(`/edit/chapters/${articleId}`);
    },
    [navigate],
  );

  return (
    <StyledChapterBody>
      <table>
        <thead>
          <tr>
            <th>项目</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {chapters[currentIndex]?.map((chapter) => (
            <tr key={chapter._id}>
              <td>{chapter.title}</td>
              <td>
                <ButtonBar>
                  <DeleteChapterButton
                    chapterId={chapter._id}
                    noteId={noteOptions[currentIndex]._id}
                  />
                  <Button
                    onClick={() => updateItem(chapter._id)}
                    size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
                  >
                    修改
                  </Button>
                </ButtonBar>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddChapterButton currentOption={noteOptions[currentIndex]} />
      <AddChapterModal currentOption={noteOptions[currentIndex]} />
    </StyledChapterBody>
  );
};

export default ChapterBody;
