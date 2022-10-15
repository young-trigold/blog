import { EditorState, Transaction } from 'prosemirror-state';
import getUniqueID from '@/utils/getUniqueID';
import schema from '../schema';

// 给 heading node 加上 id
const addHeadingID = (editorState: EditorState, transaction: Transaction) => {
  let tr = transaction;

  editorState.doc.descendants((node, position) => {
    if (node.type !== schema.nodes.heading) return;
    const { headingID } = node.attrs;
    // 如果不存在 headingID
    if (headingID) return;

    tr = tr.setNodeMarkup(position, node.type, {
      ...node.attrs,
      headingID: getUniqueID(),
    });
  });

  const newEditorState = editorState.apply(tr);
  return newEditorState;
};

export default addHeadingID;
