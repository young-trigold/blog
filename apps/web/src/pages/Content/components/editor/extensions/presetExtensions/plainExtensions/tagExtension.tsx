import { Extension, MarkExtension, NodeExtension, PlainExtension } from '../..';

class TagExtension extends PlainExtension {
	get name() {
		return 'tag' as const;
	}

	onEditorStoreCreate() {
		if (!this.editorStore) return;

		const addTagsToEachExtension = (extension: Extension) => {
			extension.tags = extension.createTags?.() ?? [];
		};

		this.editorStore.markExtensions.forEach(addTagsToEachExtension);
		this.editorStore.nodeExtensions.forEach(addTagsToEachExtension);
	}
}

export default TagExtension;
