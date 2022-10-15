import { MarkSpec } from 'prosemirror-model';
import { marks } from 'prosemirror-schema-basic';

// 下划线
export const underline: MarkSpec = {
  parseDOM: [{ tag: 'u' }],
  toDOM() {
    return ['u', 0];
  },
};

// 上标
export const sup: MarkSpec = {
  parseDOM: [{ tag: 'sup' }],
  toDOM() {
    return ['sup', 0];
  },
  excludes: 'sub',
};

// 下标
export const sub: MarkSpec = {
  parseDOM: [{ tag: 'sub' }],
  toDOM() {
    return ['sub', 0];
  },
  excludes: 'sup',
};

const markSpecs = {
  ...marks,
  underline,
  sup,
  sub,
};

export default markSpecs;
