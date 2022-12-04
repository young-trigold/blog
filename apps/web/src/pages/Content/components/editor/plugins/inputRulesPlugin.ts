import {
  ellipsis,
  InputRule,
  inputRules,
  smartQuotes,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

import getUniqueId from '@/utils/getUniqueId';
import schema from '../schema';

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

const strongMarkInputRule = markInputRule(/\*\*[^*]+\*\*\s$/, schema.marks.strong);

const emMarkInputRule = markInputRule(/_(\S(?:|.*?\S))_$/, schema.marks.em);

const blockquoteInputRule = wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote);
const codeBlockInputRule = textblockTypeInputRule(/^```([\dA-Za-z]*) $/, schema.nodes.code_block);

const unorderedListInputRule = wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.unordered_list);

const orderedListInputRule = wrappingInputRule(
  /^(\d+)\.\s$/,
  schema.nodes.ordered_list,
  (match: RegExpMatchArray) => ({ order: Number.parseInt(match[1], 10) }),
  (match, node) => node.childCount + (node.attrs.order as number) === Number(match[1]),
);

const headingInputRule = textblockTypeInputRule(
  new RegExp(`^(#{1,${3}})\\s$`),
  schema.nodes.heading,
  (match: RegExpMatchArray) => ({
    level: match[1].length,
    headingId: getUniqueId(),
  }),
);

const rules: InputRule[] = [
  ellipsis,
  ...smartQuotes,
  strongMarkInputRule,
  emMarkInputRule,
  headingInputRule,
  blockquoteInputRule,
  codeBlockInputRule,
  unorderedListInputRule,
  orderedListInputRule,
];

const inputRulesPlugin = inputRules({ rules });

export default inputRulesPlugin;
