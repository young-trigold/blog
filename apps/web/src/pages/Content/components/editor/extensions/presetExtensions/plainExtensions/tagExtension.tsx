import { extensionName, MarkExtension, NodeExtension, PlainExtension } from '../..';

@extensionName('tag')
class TagExtension extends PlainExtension {
	onEditorStoreCreate() {
		if (!this.editorStore) return;

		const addTagsToEachExtension = (extension: MarkExtension | NodeExtension) => {
			if (extension.createTags) extension.tags = extension.createTags();
		};

		this.editorStore.markExtensions.forEach(addTagsToEachExtension);
		this.editorStore.nodeExtensions.forEach(addTagsToEachExtension);
	}
}

export default TagExtension;
