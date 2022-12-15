import { setBlockType } from 'prosemirror-commands';
import { Node, NodeType } from 'prosemirror-model';
import { Command, EditorState, NodeSelection, Selection } from 'prosemirror-state';
import ParagraphExtension from '../extensions/presetExtensions/nodeExtensions/ParagraphExtension';

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
