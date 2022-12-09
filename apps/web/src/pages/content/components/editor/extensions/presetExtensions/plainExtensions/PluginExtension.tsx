import { Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { Extension, PlainExtension } from '../../type';

@extensionName('plugin')
class PluginExtension extends PlainExtension {
	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const createPlugin = (extension: Extension) => extension.createPlugin?.();
		const markPlugins = this.editorStore.markExtensions.map(createPlugin);
		const nodePlugins = this.editorStore.nodeExtensions.map(createPlugin);
		const plainPlugins = this.editorStore.plainExtensions.map(createPlugin);
		const plugins = [...markPlugins, ...nodePlugins, ...plainPlugins].filter(Boolean);
		this.editorStore.plugins = plugins as ProseMirrorPlugin[];
	}
}

export default PluginExtension;
