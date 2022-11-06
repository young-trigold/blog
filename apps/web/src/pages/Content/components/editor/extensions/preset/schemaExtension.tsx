import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import EditorStore from '../../store/EditorStore';
import { PlainExtension } from '../extension';

class SchemaExtension extends PlainExtension {
	get name() {
		return 'schema' as const;
	}

	editorStore: EditorStore | null = null;

	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const marks: MarkSpec = {};
		this.editorStore.markExtensions.forEach((markExtension) => {
			marks[markExtension.name] = markExtension.createMarkSpec();
		});

		const nodes: NodeSpec = {};
		this.editorStore.nodeExtensions.forEach((nodeExtension) => {
			nodes[nodeExtension.name] = nodeExtension.createNodeSpec();
		});
		console.debug(marks, nodes);
		// const mySchema = new Schema({
		// 	marks,
		// 	nodes,
		// 	topNode: 'doc',
		// });
		// console.debug('mySchema', mySchema);
		// console.debug('schema', schema);
		this.editorStore.schema = schema;
		console.debug(this.editorStore);
	}

	onEditorViewCreate?(): void {}
}

export default SchemaExtension;
