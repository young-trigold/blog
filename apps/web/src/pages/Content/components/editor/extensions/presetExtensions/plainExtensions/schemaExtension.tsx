import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import schema from '../../../schema';
import { extensionName, PlainExtension } from '../../type';

@extensionName('schema')
class SchemaExtension extends PlainExtension {
	onEditorStoreCreate(): void {
		if (!this.editorStore) return;

		const marks = this.editorStore.markExtensions.reduce((result, extension) => {
			result[extension.name] = extension.createMarkSpec();
			if (extension.tags.length) result[extension.name].group = extension.tags.join(' ');
			return result;
		}, {} as Record<string, MarkSpec>);

		const nodes = this.editorStore.nodeExtensions.reduce((result, extension) => {
			result[extension.name] = extension.createNodeSpec();
			if (extension.tags.length) result[extension.name].group = extension.tags.join(' ');
			return result;
		}, {} as Record<string, NodeSpec>);

		const mySchema = new Schema({
			marks,
			nodes,
			topNode: 'doc',
		});

		console.debug(schema);
		// console.debug(mySchema);
		this.editorStore.schema = mySchema;
	}

	onEditorViewCreate?(): void {}
}

export default SchemaExtension;
