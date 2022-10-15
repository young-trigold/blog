import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

const markInputRule = (
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: { [key: string]: any } | ((p: string[]) => { [key: string]: any } | null | undefined),
) => {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const { tr } = state;
    if (match[1]) {
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;
      if (textEnd < end) {
        tr.delete(textEnd, end);
      }
      if (textStart > start) {
        tr.delete(start, textStart);
      }
      end = start + match[1].length;
    }
    return tr.addMark(start, end, markType.create(attrs || {}));
  });
};

export default markInputRule;
