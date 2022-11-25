import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Extension, MarkExtension, NodeExtension, PlainExtension } from '../extensions';

export enum EditorStoreStatus {
	Init,
	EditorStateCreated,
	EditorViewCreated,
	Destroyed,
}

class EditorStore {
	status: EditorStoreStatus = EditorStoreStatus.Init;
	view: EditorView | null = null;
	schema: Schema | null = null;
	plugins: Plugin[] = [];
	markExtensions: MarkExtension[] = [];
	nodeExtensions: NodeExtension[] = [];
	plainExtensions: PlainExtension[] = [];

	constructor(extensions: Extension[]) {
		const onCreate = (extension: Extension) => {
			if (extension instanceof MarkExtension) this.markExtensions.push(extension);
			else if (extension instanceof NodeExtension) this.nodeExtensions.push(extension);
			else this.plainExtensions.push(extension);

			extension.editorStore = this;

			extension.onEditorStoreCreate?.();
		};

		extensions.forEach(onCreate);
		if (this.status === EditorStoreStatus.Init) this.status = EditorStoreStatus.EditorStateCreated;
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
			editable: boolean;
			autofocus: boolean;
		},
	) {
		const editorView = new EditorView(editorDOMContainer, {
			state: this.createEditorState(),
			editable: () => props.editable,
		});

		this.view = editorView;
		if (this.status === EditorStoreStatus.EditorStateCreated)
			this.status = EditorStoreStatus.EditorViewCreated;
		return editorView;
	}
}

export default EditorStore;
