import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin as ProseMirrorPlugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Extension, MarkExtension, NodeExtension, PlainExtension } from '../extensions/type';


export enum EditorStoreStatus {
	Init,
	EditorStateCreated,
	EditorViewCreated,
	Destroyed,
}

export type HandleDOMEvents = {
	[eventName in keyof HTMLElementEventMap]?: (
		view: EditorView,
		event: HTMLElementEventMap[eventName],
	) => void | boolean;
};

class EditorStore {
	status: EditorStoreStatus = EditorStoreStatus.Init;
	view: EditorView | null = null;
	schema: Schema | null = null;
	commands: EditorStore.Commands = {} as any;
	plugins: ProseMirrorPlugin[] = [];
	markExtensions: MarkExtension[] = [];
	nodeExtensions: NodeExtension[] = [];
	plainExtensions: PlainExtension[] = [];

	constructor(extensions: Extension[]) {
		const onCreate = (extension: Extension) => {
			if (extension instanceof MarkExtension) this.markExtensions.push(extension);
			else if (extension instanceof NodeExtension) this.nodeExtensions.push(extension);
			else this.plainExtensions.push(extension);
			extension.editorStore = this;
		};

		extensions.forEach(onCreate);
		if (this.status === EditorStoreStatus.Init) this.status = EditorStoreStatus.EditorStateCreated;
		extensions.forEach((extension: Extension) => {
			extension.onEditorStoreCreate?.();
		});
	}

	createEditorState(doc?: string, selection?: Selection) {
		if (!this.schema) throw new Error('editor store can not create editor status in this time');
		const editorState = EditorState.create({
			schema: this.schema,
			plugins: this.plugins,
			doc: doc ? ProseMirrorNode.fromJSON(this.schema, JSON.parse(doc)) : undefined,
			selection,
		});

		return editorState;
	}

	createEditorView(
		editorDOMContainer: HTMLElement,
		props: {
			state: EditorState;
			editable: boolean;
			autoFocus: boolean;
			onChange?: (view: EditorView) => void;
			handleDOMEvents?: HandleDOMEvents;
		},
	) {
		const editorView = new EditorView(editorDOMContainer, {
			state: props.state,
			editable: () => props.editable,
			dispatchTransaction(tr) {
				const newEditorState = editorView.state.apply(tr);
				editorView.updateState(newEditorState);
				props.onChange?.(editorView);
			},
			handleDOMEvents: props.handleDOMEvents,
		});

		this.view = editorView;

		if (props.autoFocus) this.view.focus();
		this.markExtensions.forEach((markExtension) => markExtension.onEditorViewCreate?.());
		this.nodeExtensions.forEach((nodeExtension) => nodeExtension.onEditorViewCreate?.());
		this.plainExtensions.forEach((plainExtension) => plainExtension.onEditorViewCreate?.());
		if (this.status === EditorStoreStatus.EditorStateCreated)
			this.status = EditorStoreStatus.EditorViewCreated;
		return editorView;
	}
}

export default EditorStore;

declare global {
	namespace EditorStore {
		interface Commands {
			[extensionName: string]: {
				[commandName: string]: (...args: any[]) => void;
			};
		}
	}
}
