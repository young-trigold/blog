import { baseKeymap } from 'prosemirror-commands';
import { keydownHandler } from 'prosemirror-keymap';
import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { Extension, KeyMap, PlainExtension } from '../../type';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	createPlugins() {
		if (!this.editorStore) return [];
		const createKeyMap = (result: KeyMap, extension: Extension) => {
			if (extension.createKeyMap)
				result = {
					...result,
					...extension.createKeyMap(),
				};
			return result;
		};
		const markKeyMap = this.editorStore.markExtensions.reduce(createKeyMap, {} as KeyMap);
		const nodeKeyMap = this.editorStore.nodeExtensions.reduce(createKeyMap, {} as KeyMap);
		const pluginKeyMap = this.editorStore.plainExtensions.reduce(createKeyMap, {} as KeyMap);
		const keyMap = {
			...baseKeymap,
			...markKeyMap,
			...nodeKeyMap,
			...pluginKeyMap,
		};
		const key = new PluginKey(KeyMapExtension.extensionName);
		const plugin = new Plugin({
			key,
			props: {
				handleKeyDown(view, event) {
					return keydownHandler(keyMap)(view, event);
				},
			},
		});
		return [plugin];
	}
}

export default KeyMapExtension;
