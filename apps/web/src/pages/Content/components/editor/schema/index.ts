import { Schema } from 'prosemirror-model';
import marks from './marks';
import nodes from './nodes';

const schema = new Schema({
  nodes,
  marks,
});

export default schema;
