import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { extensionName, PlainExtension } from '../..';

@extensionName('schema')
class SchemaExtension extends PlainExtension {
	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const marks: Record<string, MarkSpec> = {};
		this.editorStore.markExtensions.forEach((markExtension) => {
			marks[markExtension.name] = markExtension.createMarkSpec();
			marks[markExtension.name].group = markExtension.tags.join(' ');
		});

		const nodes: Record<string, NodeSpec> = {};
		this.editorStore.nodeExtensions.forEach((nodeExtension) => {
			nodes[nodeExtension.name] = nodeExtension.createNodeSpec();
			nodes[nodeExtension.name].group = nodeExtension.tags.join(' ');
		});
		const mySchema = new Schema({
			marks,
			nodes,
			topNode: 'doc',
		});
		// console.debug(schema);
		console.debug(mySchema);
		this.editorStore.schema = mySchema;
	}

	onEditorViewCreate?(): void {}
}

export default SchemaExtension;
