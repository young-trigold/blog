import { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import { setEditorStore } from '@/app/store/pages/contentPage';
import px from '@/utils/realPixel';
import { EditorView } from 'prosemirror-view';
import { presetNodeExtensions, presetPlainExtensions } from './extensions';
import { Extension } from './extensions/type';
import EditorStore, { HandleDOMEvents } from './store';
import InsertTooltip from './tooltips/InsertTooltip';
import SelectionCommentTooltip from './tooltips/selectionCommentTooltip';
import SelectionTooltip from './tooltips/selectionTooltip';

const EditorContainer = styled.article`
  flex: 1 1 760px;
  min-width: 350px;
  z-index: 2;
  transition: ${(props) => props.theme.transition};
  position: relative;
  background-color: ${(props) => props.theme.foregroundColor};
  background-image: linear-gradient(
      to right,
      ${(props) => props.theme.shadowColor} ${px()},
      transparent 0
    ),
    linear-gradient(to bottom, ${(props) => props.theme.shadowColor} ${px()}, transparent 0);
  background-size: 1.2em 1.2em;
  background-position-x: 0.6em;
  border-radius: 6.4px;
  padding: 1.5em 2em 0.5em 2em;
  overflow-wrap: break-word;
  caret-color: ${(props) => props.theme.warnColor};

  @media (max-width: 530px) {
    border-radius: 0;
    padding: 1.5em 1em 0.5em 1em;
  }

  // 上下标
  sub,
  sup {
    font-size: 8px;
    position: relative;
    vertical-align: unset;
  }

  sup {
    bottom: 0.6em;
  }

  // 下划线
  u {
    text-decoration-color: ${(props) => props.theme.primaryColor};
    transition: ${(props) => props.theme.transition};
  }

  // 段落
  p {
    text-indent: 2em;

    & img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }

    & code {
      font-size: 14px;
      font-style: italic;
      font-weight: bold;
      color: ${(props) => props.theme.activeColor};
      background-color: ${(props) => props.theme.foregroundColor};
      font-family: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace';
      border-radius: 4px;
      transition: ${(props) => props.theme.transition};
    }
  }

  // 列表
  ol,
  ul {
    & p {
      text-indent: unset;
    }
  }

  // 代码块
  .cm-editor {
    font-size: 14px;
    border-radius: 6.4px;
    box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
    background-color: ${(props) => props.theme.foregroundColor};
    transition: ${(props) => props.theme.transition};


    &.cm-focused {
      outline: none;
    }

    // gutters
    .cm-gutters {
      color: ${(props) => props.theme.textColor};
      background-color: ${(props) => props.theme.surfaceColor};
      border-radius: 6.4px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: ${(props) => props.theme.borderColor};
      user-select: none;

      .cm-gutterElement.cm-activeLineGutter {
        color: ${(props) => props.theme.primaryColor};
      }
    }
  }
`;

interface EditorProps {
  editable: boolean;
  autoFocus?: boolean;
  onChange?: (view: EditorView) => void;
  extensions?: Extension[];
  doc?: string;
  handleDOMEvents?: HandleDOMEvents;
}

const Editor: React.FC<EditorProps> = (props) => {
  const {
    extensions = [],
    editable = false,
    autoFocus = true,
    onChange,
    handleDOMEvents,
    doc,
  } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const finalExtensions = [
      ...presetPlainExtensions.map((Extension) => new Extension()),
      ...presetNodeExtensions.map((Extension) => new Extension()),
      ...extensions,
    ];
    const editorStore = new EditorStore(finalExtensions);
    const state = editorStore.createEditorState(doc);
    const editorView = editorStore.createEditorView(editorContainerRef.current!, {
      state,
      editable,
      autoFocus,
      onChange,
      handleDOMEvents,
    });
    dispatch(setEditorStore(editorStore));

    return () => {
      editorView.destroy();
      dispatch(setEditorStore(null));
    };
  }, []);

  return (
    <EditorContainer ref={editorContainerRef}>
      {editable && (
        <>
          <InsertTooltip />
          <SelectionTooltip />
        </>
      )}
      {!editable && <SelectionCommentTooltip />}
    </EditorContainer>
  );
};

export default memo(Editor);
