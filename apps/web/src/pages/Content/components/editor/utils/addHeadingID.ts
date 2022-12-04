import { EditorState, Transaction } from 'prosemirror-state';
import getUniqueId from '@/utils/getUniqueId';
import schema from '../schema';

// 给 heading node 加上 id
const addHeadingId = (editorState: EditorState) => {
  let tr = editorState.tr;

  editorState.doc.descendants((node, position) => {
    if (node.type !== schema.nodes.heading) return;
    const { headingId } = node.attrs;
    // 如果不存在 headingId
    if (headingId) return;

    tr = tr.setNodeMarkup(position, node.type, {
      ...node.attrs,
      headingId: getUniqueId(),
    });
  });

  const newEditorState = editorState.apply(tr);
  return newEditorState;
};

export default addHeadingId;
