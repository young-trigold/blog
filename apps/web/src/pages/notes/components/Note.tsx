import styled from 'styled-components';
import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteInfo } from '..';

const StyledNote = styled.ol`
  box-sizing: border-box;
  list-style: none;
  width: 200px;
  height: 290px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  font-size: larger;
  font-weight: bolder;
  user-select: none;
  background-color: ${(props) => props.theme.foregroundColor};
  border-radius: 2px 16px 16px 2px;
  box-shadow: 4px 8px 16px ${(props) => props.theme.shadowColor};
  transform: perspective(600px) rotateY(-20deg);
  transition: ${(props) => props.theme.transition};
  padding: 1em;
  cursor: pointer;
  z-index: 2;
  border-left: 10px solid ${(props) => props.theme.primaryColor};
  touch-action: manipulation;

  &:hover {
    box-shadow: 5px 0px 5px ${(props) => props.theme.shadowColor};
    transform: rotateY(20deg);
    & > li {
      width: 200px !important;
    }
  }

  &:active {
    color: ${(props) => props.theme.activeColor};
  }
`;

const StyledPage = styled.li`
  height: 290px;
  border-right: 1px solid ${(props) => props.theme.shadowColor};
  border-radius: 2px 16px 16px 2px;
  position: absolute;
`;

export interface NoteProps {
  note: NoteInfo;
}

const Note = (props: NoteProps) => {
  const { note } = props;
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/notes/${note.title}`, { state: { noteId: note._id } });
  }, [navigate, note]);

  return (
    <StyledNote onClick={handleNavigate}>
      <h3>{note.title}</h3>
      <StyledPage style={{ zIndex: 1, width: '194px' }} />
      <StyledPage style={{ zIndex: 0, width: '198px' }} />
      <StyledPage style={{ zIndex: -1, width: '202px' }} />
      <StyledPage style={{ zIndex: -2, width: '206px' }} />
    </StyledNote>
  );
};

export default memo(Note);
