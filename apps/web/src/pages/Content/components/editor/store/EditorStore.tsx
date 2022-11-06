import { Schema, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { Extension, MarkExtension, NodeExtension, PlainExtension } from '../extensions/extension';

export enum EditorStoreState {
	Init,
	Create,
}

class EditorStore {
	state: EditorStoreState = EditorStoreState.Init;
	schema: Schema | null = null;
	plugins: Plugin[] = [];
	markExtensions: MarkExtension[] = [];
	nodeExtensions: NodeExtension[] = [];
	plainExtensions: PlainExtension[] = [];

	constructor(extensions: Extension[]) {
		if (this.state === EditorStoreState.Init) this.state = EditorStoreState.Create;

		const onCreate = (extension: Extension) => {
			if (extension instanceof MarkExtension) this.markExtensions.push(extension);
			else if (extension instanceof NodeExtension) this.nodeExtensions.push(extension);
			else this.plainExtensions.push(extension);

			extension.editorStore = this;

			extension.onEditorStoreCreate?.();
		};

		extensions.forEach(onCreate);
		console.debug('run');
	}

	createEditorState(doc?: string, selection?: Selection) {
		if (!this.schema) throw new Error('editor store can not create editor state in this time');

		const editorState = EditorState.create({
			schema: this.schema,
			plugins: this.plugins,
			doc: doc ? ProseMirrorNode.fromJSON(this.schema, JSON.parse(doc)) : this.schema.nodes.doc.createAndFill()!,
			selection,
		});

		return editorState;
	}
}

export default EditorStore;
