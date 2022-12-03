import { omit } from 'lodash';
import { baseKeymap, chainCommands, lift, setBlockType, toggleMark } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Node as ProseMirrorNode, ResolvedPos } from 'prosemirror-model';
import { Command, EditorState, NodeSelection, TextSelection } from 'prosemirror-state';

import isMacPlatform from '@/utils/isMacPlatform';
import { keymap } from 'prosemirror-keymap';
import { FunctionKeys, KeyMap, LetterKeys, SymbolKeys } from '../extensions';
import schema from '../schema';

export const shortcutKeys = (...keys: (FunctionKeys | LetterKeys | SymbolKeys | number)[]) =>
	keys.join('-');
// ======================================== backspace  ===================================================

export function hasWrapTitleNode(attrs: { [key: string]: unknown } = {}) {
	return (state: EditorState) => {
		const { from, to } = state.selection;
		let isMatchNode = false;
		// 只要最顶点是标题，则认为在标题里，如果跨越了俩个元素的话，这里第一次会返回彼此的最小父亲节点
		state.doc.nodesBetween(from, to, (node: ProseMirrorNode) => {
			isMatchNode =
				node.type === state.schema.nodes.heading &&
				(!attrs.level || attrs.level === node.attrs.level);
			return false;
		});
		return isMatchNode;
	};
}

const undoSetHeadingType: Command = (state, dispatch) => {
	const { selection } = state;
	// 如果是第一位标题
	if (selection.empty && selection?.$anchor?.pos === 1 && hasWrapTitleNode()(state)) {
		const { from, to } = selection;
		dispatch?.(state.tr.setBlockType(from, to, state.schema.nodes.paragraph));
		return true;
	}

	return false;
};

const findCutBefore = ($pos: ResolvedPos): ResolvedPos | null => {
	for (let i = $pos.depth - 1; i >= 0; i -= 1) {
		if ($pos.index(i) > 0) {
			return $pos.doc.resolve($pos.before(i + 1));
		}
		if ($pos.node(i).type.spec.isolating) {
			break;
		}
	}

	return null;
};

type TSide = 'start' | 'end';

const textblockAt = (node: ProseMirrorNode | null | undefined, side: TSide): boolean => {
	// eslint-disable-next-line no-param-reassign
	for (; node; node = side === 'start' ? node.firstChild : node.lastChild) {
		if (node.isTextblock) {
			return true;
		}
	}
	return false;
};

const handleBackspaceOnList: Command = (state, dispatch) => {
	const { selection } = state;
	if (state.selection.empty) {
		const { from, to } = state.selection;
		let parentNode: ProseMirrorNode | undefined;
		state.doc.nodesBetween(from, to, (node) => {
			parentNode = node;
			return false;
		});
		// 只处理list
		try {
			if (
				parentNode?.type === schema.nodes.ordered_list ||
				parentNode?.type === schema.nodes.unordered_list
			) {
				const { $cursor } = selection as TextSelection;
				const $cut = findCutBefore($cursor as ResolvedPos);
				const before = $cut?.nodeBefore;
				// eslint-disable-next-line max-depth
				if (
					($cursor?.parent?.content?.size === 0 &&
						(textblockAt(before, 'end') || (before && NodeSelection.isSelectable(before)))) ||
					// 代表cursor至前一个节点，没有字符了
					($cursor && $cut && $cursor.pos - $cut.pos === 2)
				) {
					// eslint-disable-next-line max-depth
					if (dispatch) {
						// 单个列表，无文本的时候应该lift
						return lift(state, dispatch);
					}
					return true;
				}
			}
		} catch (_) {
			return false;
		}
	}
	return false;
};

const undoToggleMark: Command = (state, dispatch) => {
	const { selection, storedMarks } = state;
	if (!selection.empty) return false;

	return false;
};

const backSpaceKeymap: KeyMap = {
	// undo inputrule 优先级最高
	[FunctionKeys.Backspace]: chainCommands(
		undoInputRule,
		undoSetHeadingType,
		handleBackspaceOnList,
		baseKeymap[FunctionKeys.Backspace],
	),
};

// ==================================  历史 keyMap: 回退，前进  =================================================
const historyKeymapForMac: KeyMap = {
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.z)]: undo,
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.y)]: redo,
	// 大写
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.Z)]: undo,
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.Y)]: redo,
};

const historyKeymapForWin: KeyMap = {
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.z)]: undo,
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.y)]: redo,
	// 大写
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.Z)]: undo,
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.Y)]: redo,
};

const historyKeymap: KeyMap = isMacPlatform() ? historyKeymapForMac : historyKeymapForWin;

// ==================================  标记 keyMap: 粗体，斜体，下划线，上下标, code  ===============================================
const markKeymapForMac: KeyMap = {
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.b)]: toggleMark(schema.marks.strong),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.i)]: toggleMark(schema.marks.em),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.u)]: toggleMark(schema.marks.underline),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.m)]: toggleMark(schema.marks.sup),
	[shortcutKeys(FunctionKeys.Mod, FunctionKeys.Alt, LetterKeys.m)]: toggleMark(schema.marks.sub),
	// 大写
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.B)]: toggleMark(schema.marks.strong),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.I)]: toggleMark(schema.marks.em),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.U)]: toggleMark(schema.marks.underline),
	[shortcutKeys(FunctionKeys.Mod, LetterKeys.M)]: toggleMark(schema.marks.sup),
	[shortcutKeys(FunctionKeys.Mod, FunctionKeys.Alt, LetterKeys.M)]: toggleMark(schema.marks.sub),
	// code
	[shortcutKeys(FunctionKeys.Ctrl, SymbolKeys['`'])]: toggleMark(schema.marks.code),
};

const markKeymapForWin: KeyMap = {
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.b)]: toggleMark(schema.marks.strong),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.i)]: toggleMark(schema.marks.em),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.u)]: toggleMark(schema.marks.underline),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.m)]: toggleMark(schema.marks.sup),
	[shortcutKeys(FunctionKeys.Ctrl, FunctionKeys.Alt, LetterKeys.m)]: toggleMark(schema.marks.sub),
	// 大写
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.B)]: toggleMark(schema.marks.strong),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.I)]: toggleMark(schema.marks.em),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.U)]: toggleMark(schema.marks.underline),
	[shortcutKeys(FunctionKeys.Ctrl, LetterKeys.M)]: toggleMark(schema.marks.sup),
	[shortcutKeys(FunctionKeys.Ctrl, FunctionKeys.Alt, LetterKeys.M)]: toggleMark(schema.marks.sub),
	// code
	[shortcutKeys(FunctionKeys.Ctrl, SymbolKeys['`'])]: toggleMark(schema.marks.code),
};

const markKeymap = isMacPlatform() ? markKeymapForMac : markKeymapForWin;

// ========================================  标题  ===================================================
const headingKeymapForMac: KeyMap = {};

new Array(3).fill(0).forEach((_, i) => {
	const level = i + 1;
	headingKeymapForMac[shortcutKeys(FunctionKeys.Mod, level)] = setBlockType(schema.nodes.heading, {
		level,
	});
});

const headingKeymapForWin: KeyMap = {};

new Array(3).fill(0).forEach((_, i) => {
	const level = i + 1;
	headingKeymapForMac[shortcutKeys(FunctionKeys.Ctrl, level)] = setBlockType(schema.nodes.heading, {
		level,
	});
});

const headingKeymap = isMacPlatform() ? headingKeymapForMac : headingKeymapForWin;

// ========================================  list  ===================================================
// @TODO
// const listTabKeymap: KeyMap = {
//   [FunctionKeys.Tab]: sink
// };

// ========================================  总的自定义 keyMap  ===================================================
const customKeymap: KeyMap = {
	...omit(baseKeymap, FunctionKeys.Backspace),
	...historyKeymap,
	...markKeymap,
	...headingKeymap,
	...backSpaceKeymap,
};

const keymapPlugin = keymap(customKeymap);

export default keymapPlugin;
