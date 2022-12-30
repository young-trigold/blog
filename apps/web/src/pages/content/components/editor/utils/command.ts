import { setBlockType } from 'prosemirror-commands';
import { Fragment, Node, NodeRange, NodeType, Slice } from 'prosemirror-model';
import {
	Command,
	EditorState,
	NodeSelection,
	Selection,
	TextSelection,
	Transaction,
} from 'prosemirror-state';
import ParagraphExtension from '../extensions/presetExtensions/nodeExtensions/ParagraphExtension';
import { ExtensionTag } from '../extensions/type';

type FindSelectedNodeOfTypeProps = {
	type: NodeType;
	selection: Selection;
};

export function findSelectedNodeOfType(props: FindSelectedNodeOfTypeProps) {
	const { type, selection } = props;

	if (!(selection instanceof NodeSelection) || !(type === selection.node.type)) return;

	return {
		pos: selection.$from.pos,
		depth: selection.$from.depth,
		start: selection.$from.start(),
		end: selection.$from.pos + selection.node.nodeSize,
		node: selection.node,
	};
}

type FindParentNodeProps = {
	predicate: (node: Node, pos: number) => boolean;
	selection: Selection;
};

export function findParentNode(props: FindParentNodeProps) {
	const { predicate, selection } = props;
	const $pos = selection.$from;

	for (let depth = $pos.depth; depth > 0; depth--) {
		const node = $pos.node(depth);
		const pos = depth > 0 ? $pos.before(depth) : 0;
		const start = $pos.start(depth);
		const end = pos + node.nodeSize;

		if (predicate(node, pos)) {
			return { pos, depth, node, start, end };
		}
	}

	return;
}

type GetActiveAttrsProps = {
	state: EditorState;
	type: NodeType;
	attrs: Record<string, unknown>;
};

export function getActiveNode(props: GetActiveAttrsProps) {
	const { state, type, attrs } = props;
	const { selection } = state;

	const active =
		findSelectedNodeOfType({ selection, type }) ??
		findParentNode({ predicate: (node: Node) => node.type === type, selection });

	if (!attrs || Object.keys(attrs).length === 0 || !active) {
		return active;
	}

	return active.node.hasMarkup(type, { ...active.node.attrs, ...attrs }) ? active : undefined;
}

type ToggleBlockItemProps = {
	type: NodeType;
	toggleType?: NodeType;
	attrs: Record<string, unknown>;
	// 是否保留原节点属性
	preserveAttrs?: boolean;
};

export function toggleBlockItem(toggleProps: ToggleBlockItemProps): Command {
	return (state, dispatch, view) => {
		const { type, attrs, preserveAttrs = true } = toggleProps;
		const activeNode = getActiveNode({ state, type, attrs });
		const toggleType =
			toggleProps.toggleType ?? state.schema.nodes[ParagraphExtension.extensionName];

		if (activeNode) {
			return setBlockType(toggleType, {
				...(preserveAttrs ? activeNode.node.attrs : {}),
				...attrs,
			})(state, dispatch, view);
		}

		const toggleNode = getActiveNode({ state, type: toggleType, attrs });

		return setBlockType(type, { ...(preserveAttrs ? toggleNode?.node.attrs : {}), ...attrs })(
			state,
			dispatch,
			view,
		);
	};
}

export function isList(type: NodeType): boolean {
	return !!type.spec.group?.includes(ExtensionTag.ListContainerNode);
}

export function isListItem(type: NodeType): boolean {
	return !!type.spec.group?.includes(ExtensionTag.ListItemNode);
}

export function isListNode(node: Node): boolean {
	return isList(node.type);
}

export function isListItemNode(node: Node): boolean {
	return isListItem(node.type);
}

export function calculateItemRange(selection: Selection): NodeRange | null {
	const { $from, $to } = selection;
	return $from.blockRange($to, isListNode) ?? null;
}

function wrapItems({
	listType,
	itemType,
	tr,
	range,
}: {
	listType: NodeType;
	itemType: NodeType;
	tr: Transaction;
	range: NodeRange;
}): boolean {
	const oldList = range.parent;

	// A slice that contianes all selected list items
	const slice: Slice = tr.doc.slice(range.start, range.end);

	if (oldList.type === listType && slice.content.firstChild?.type === itemType) {
		return false;
	}

	const newItems: Node[] = [];

	for (let i = 0; i < slice.content.childCount; i++) {
		const oldItem = slice.content.child(i);

		if (!itemType.validContent(oldItem.content)) {
			return false;
		}

		const newItem = itemType.createChecked(null, oldItem.content);
		newItems.push(newItem);
	}

	const newList = listType.createChecked(null, newItems);

	tr.replaceRange(range.start, range.end, new Slice(Fragment.from(newList), 0, 0));
	return true;
}

export function wrapSelectedItems({
	listType,
	itemType,
	tr,
}: {
	listType: NodeType;
	itemType: NodeType;
	tr: Transaction;
}): boolean {
	const range = calculateItemRange(tr.selection);

	if (!range) {
		return false;
	}

	const atStart = range.startIndex === 0;

	const { from, to } = tr.selection;

	if (!wrapItems({ listType, itemType, tr, range })) {
		return false;
	}

	tr.setSelection(
		TextSelection.between(
			tr.doc.resolve(atStart ? from : from + 2),
			tr.doc.resolve(atStart ? to : to + 2),
		),
	);
	tr.scrollIntoView();

	return true;
}

// export function toggleList(listType: NodeType, itemType: NodeType): CommandFunction {
//   return (props) => {
//     const { dispatch, tr } = props;
//     const state = chainableEditorState(tr, props.state);
//     const { $from, $to } = tr.selection;
//     const range = $from.blockRange($to);

//     if (!range) {
//       return false;
//     }

//     const parentList = findParentNode({
//       predicate: (node) => isList(node.type),
//       selection: tr.selection,
//     });

//     if (
//       // the selection range is right inside the list
//       parentList &&
//       range.depth - parentList.depth <= 1 &&
//       // the selectron range is the first child of the list
//       range.startIndex === 0
//     ) {
//       if (parentList.node.type === listType) {
//         return liftListItemOutOfList(itemType)(props);
//       }

//       if (isList(parentList.node.type)) {
//         if (listType.validContent(parentList.node.content)) {
//           dispatch?.(tr.setNodeMarkup(parentList.pos, listType));
//           return true;
//         }

//         // When you try to toggle a bullet list into a task list or vice versa, since these two lists
//         // use different type of list items, you can't directly change the list type.
//         if (deepChangeListType(tr, parentList, listType, itemType)) {
//           dispatch?.(tr.scrollIntoView());
//           return true;
//         }

//         return false;
//       }
//     }

//     return wrapInList(listType)(state, dispatch);
//   };
// }
