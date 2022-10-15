import { NodeViewConstructor } from 'prosemirror-view';

import CodeBlockView from './CodeBlockView';

const nodeViews: {
  [key: string]: NodeViewConstructor;
} = {
  code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos),
};

export default nodeViews;
