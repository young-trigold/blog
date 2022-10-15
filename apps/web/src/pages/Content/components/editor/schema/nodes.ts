/* eslint-disable camelcase */
import { Node as ProseMirrorNode, NodeSpec, ParseRule } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';

import getUniqueID from '@/utils/getUniqueID';

export const MaxHeadingLevel = 3;

// 标题
const heading: NodeSpec = {
  content: 'text*',
  marks: 'sup sub underline em link',
  group: 'block',
  defining: true,
  attrs: { level: { default: 1 }, headingID: { default: '' } },
  // 粘贴
  parseDOM: [
    ...new Array(MaxHeadingLevel).fill(0).map(
      (_, i): ParseRule => ({
        tag: `h${i + 1}`,
        getAttrs: () => {
          return {
            level: i + 1,
            headingID: getUniqueID(),
          };
        },
      }),
    ),
  ],
  toDOM: (node) => [
    `h${node.attrs.level}`,
    {
      'heading-id': node.attrs.headingID,
    },
    0,
  ],
};

// 块级代码
const code_block: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  isolating: true,
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
    },
  ],
  toDOM() {
    return ['pre', ['code', 0]];
  },
};

const list_item: NodeSpec = {
  group: 'list_item',
  content: 'paragraph block*',
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
  defining: true,
};

// 无序列表
const unordered_list: NodeSpec = {
  group: 'block',
  content: 'list_item+',
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ['ul', 0];
  },
};

// 无序列表
const ordered_list: NodeSpec = {
  group: 'block',
  content: 'list_item+',
  parseDOM: [{ tag: 'ol' }],
  toDOM() {
    return ['ol', 0];
  },
};

// 表格
const table: NodeSpec = {
  content: '(thead | tbody)*',
  tableRole: 'table',
  isolating: true,
  group: 'block',
  // allowGapCursor: true,
  parseDOM: [
    {
      tag: 'table',
    },
  ],
  toDOM() {
    return ['table', 0];
  },
};

const thead: NodeSpec = {
  content: 'tr*',
  tableRole: 'table_head',
  isolating: true,
  group: 'block',
  // allowGapCursor: true,
  parseDOM: [
    {
      tag: 'thead',
    },
  ],
  toDOM() {
    return ['thead', 0];
  },
};

const tbody: NodeSpec = {
  content: 'tr*',
  tableRole: 'table_body',
  isolating: true,
  group: 'block',
  // allowGapCursor: true,
  parseDOM: [
    {
      tag: 'tbody',
    },
  ],
  toDOM() {
    return ['tbody', 0];
  },
};

// 表格一行
const tr: NodeSpec = {
  content: '(td | th)*',
  tableRole: 'row',
  parseDOM: [
    {
      tag: 'tr',
    },
  ],
  toDOM() {
    return ['tr', 0];
  },
};

const getCellAttrs = (dom: HTMLElement, extraAttrs: Record<string, any>) => {
  const widthAttr = dom.getAttribute('data-colwidth');
  const widths =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(',').map((s) => Number(s)) : null;
  const colspan = Number(dom.getAttribute('colspan') || 1);
  const result: Record<string, unknown> = {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: widths && widths.length === colspan ? widths : null,
    align: dom.getAttribute('align') || 'left',
  };
  for (const prop in extraAttrs) {
    const getter = extraAttrs[prop].getFromDOM;
    const value = getter && getter(dom);
    if (value !== null) {
      result[prop] = value;
    }
  }
  return result;
};

const setCellAttrs = (node: ProseMirrorNode, extraAttrs: Record<string, any>) => {
  const attrs: Record<string, any> = {};
  if (node.attrs.colspan !== 1) {
    attrs.colspan = node.attrs.colspan;
  }
  if (node.attrs.rowspan !== 1) {
    attrs.rowspan = node.attrs.rowspan;
  }
  if (node.attrs.colwidth) {
    attrs['data-colwidth'] = node.attrs.colwidth.join(',');
  }
  for (const prop in extraAttrs) {
    const setter = extraAttrs[prop].setDOMAttr;
    if (setter) {
      setter(node.attrs[prop], attrs);
    }
  }
  attrs.align = node.attrs.align;
  return attrs;
};

const cellAttrs = {
  colspan: { default: 1 },
  rowspan: { default: 1 },
  colwidth: { default: null },
  align: { default: 'center' },
};

// 表头单元格
const th: NodeSpec = {
  content: `text*`,
  marks: 'strong sup sub underline em link',
  attrs: cellAttrs,
  tableRole: 'header_cell',
  isolating: true,
  parseDOM: [
    {
      tag: 'th',
      getAttrs: (dom): Record<string, unknown> => getCellAttrs(dom as HTMLElement, cellAttrs),
    },
  ],
  toDOM(node) {
    return ['th', setCellAttrs(node, cellAttrs), 0];
  },
};

// 表格单元格
const td: NodeSpec = {
  content: 'text*',
  marks: 'strong sup sub underline em link',
  attrs: cellAttrs,
  tableRole: 'cell',
  isolating: true,
  parseDOM: [
    {
      tag: 'td',
      getAttrs: (dom: Node | string): Record<string, unknown> =>
        getCellAttrs(dom as HTMLElement, cellAttrs),
    },
  ],
  toDOM(node) {
    return ['td', setCellAttrs(node, cellAttrs), 0];
  },
};

const nodeSpecs = {
  ...nodes,
  heading,
  code_block,
  list_item,
  unordered_list,
  ordered_list,
  td,
  tr,
  th,
  tbody,
  thead,
  table,
};

export default nodeSpecs;
