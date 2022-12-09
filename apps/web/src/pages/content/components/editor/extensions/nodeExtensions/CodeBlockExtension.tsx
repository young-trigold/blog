import { javascript } from '@codemirror/lang-javascript';
import { EditorState as CMState, Transaction as CMTransaction } from '@codemirror/state';
import { Command, EditorView as CodeMirrorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { exitCode } from 'prosemirror-commands';
import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';
import { EditorView, NodeView, NodeViewConstructor } from 'prosemirror-view';
import { extensionName } from '../decorators/extensionName';
import TextExtension from '../presetExtensions/nodeExtensions/TextExtension';
import { ExtensionTag, NodeExtension } from '../type';

@extensionName('code_block')
export class CodeBlockExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			defining: true,
			isolating: true,
			draggable: false,
			code: true,
			marks: '',
			group: [ExtensionTag.Block].join(' '),
			content: `${TextExtension.extensionName}*`,
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
	}
	createNodeView(): NodeViewConstructor {
		const nodeViewConstructor: NodeViewConstructor = (node, view, getPos) =>
			new CodeBlockView(node, view, getPos);

		return nodeViewConstructor;
	}
}

interface ComputeChange {
	from: number;
	to: number;
	text: string;
}

const computeChange = (oldVal: string, newVal: string): ComputeChange | null => {
	if (oldVal === newVal) {
		return null;
	}

	let start = 0;
	let oldEnd = oldVal.length;
	let newEnd = newVal.length;

	while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start)) {
		start += 1;
	}

	while (
		oldEnd > start &&
		newEnd > start &&
		oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)
	) {
		oldEnd -= 1;
		newEnd -= 1;
	}

	return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
};

class CodeBlockView implements NodeView {
	node: ProseMirrorNode;

	view: EditorView;

	dom: HTMLElement;

	cm: CodeMirrorView;

	getPos: () => number;

	updating = false;

	constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;

		const changeFilter = CMState.changeFilter.of((tr) => {
			if (!tr.docChanged && !this.updating) {
				this.forwardSelection();
			}
			return true;
		});

		this.cm = new CodeMirrorView({
			dispatch: this.dispatch.bind(this),
		});

		// The editor's outer node is our DOM representation
		this.dom = this.cm.dom;

		const cmState = CMState.create({
			doc: this.node.textContent,
			extensions: [
				basicSetup,
				javascript(),
				changeFilter,
				keymap.of([
					{
						key: 'ArrowUp',
						run: this.mayBeEscape('line', -1),
					},
					{
						key: 'ArrowLeft',
						run: this.mayBeEscape('char', -1),
					},
					{
						key: 'ArrowDown',
						run: this.mayBeEscape('line', 1),
					},
					{
						key: 'ArrowRight',
						run: this.mayBeEscape('char', 1),
					},
					{
						key: 'Ctrl-Enter',
						run: () => {
							if (exitCode(this.view.state, this.view.dispatch)) {
								this.view.focus();
								return true;
							}
							return false;
						},
					},
				]),
			],
		});

		this.cm.setState(cmState);
	}

	forwardSelection() {
		if (!this.cm.hasFocus) {
			return;
		}

		const { state } = this.view;
		const selection = this.asProseMirrorSelection(state.doc);

		if (!selection.eq(state.selection)) {
			this.view.dispatch(state.tr.setSelection(selection));
		}
	}

	asProseMirrorSelection(doc: ProseMirrorNode) {
		const offset = this.getPos() + 1;
		const { anchor, head } = this.cm.state.selection.main;
		return TextSelection.create(doc, anchor + offset, head + offset);
	}

	dispatch(cmTr: CMTransaction) {
		this.cm.setState(cmTr.state);

		if (cmTr.docChanged && !this.updating) {
			const start = this.getPos() + 1;

			const cmValue = cmTr.state.doc.toString();
			const change = computeChange(this.node.textContent, cmValue);

			if (!change) {
				return;
			}

			const content = change.text ? this.view.state.schema.text(change.text) : null;

			const tr = this.view.state.tr.replaceWith(
				change.from + start,
				change.to + start,
				content as ProseMirrorNode,
			);
			this.view.dispatch(tr);
			this.forwardSelection();
		}
	}

	mayBeEscape(unit: 'char' | 'line', dir: -1 | 1): Command {
		return (view) => {
			const { state } = view;
			const { selection } = state;

			const offsetToPos = () => {
				const offset = selection.main.from;
				const line = state.doc.lineAt(offset);
				return { line: line.number, ch: offset - line.from };
			};

			const pos = offsetToPos();
			const hasSelection = state.selection.ranges.some((r) => !r.empty);

			const firstLine = 1;
			const lastLine = state.doc.lineAt(state.doc.length).number;

			if (
				hasSelection ||
				pos.line !== (dir < 0 ? firstLine : lastLine) ||
				(unit === 'char' && pos.ch !== (dir < 0 ? 0 : state.doc.line(pos.line).length))
			) {
				return false;
			}

			const targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
			const pmSelection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
			this.view.dispatch(this.view.state.tr.setSelection(pmSelection).scrollIntoView());
			this.view.focus();
			return true;
		};
	}

	update(node: ProseMirrorNode) {
		if (node.type !== this.node.type) {
			return false;
		}

		this.node = node;
		const change = computeChange(this.cm.state.doc.toString(), node.textContent);

		if (change) {
			this.updating = true;
			this.cm.dispatch({
				changes: { from: change.from, to: change.to, insert: change.text },
			});
			this.updating = false;
		}

		return true;
	}

	setSelection(anchor: number, head: number): void {
		this.focus();
		this.updating = true;
		this.cm.dispatch({ selection: { anchor, head } });
		this.updating = false;
	}

	focus() {
		this.cm.focus();
		this.forwardSelection();
	}

	selectNode() {
		this.focus();
	}

	stopEvent() {
		return true;
	}

	destroy() {
		this.cm.destroy();
	}
}
