import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { Extension, KeyMap, PlainExtension } from '../../type';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		if (!this.editorStore) return;
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
		const keyMapPlugin = keymap(keyMap);
		return keyMapPlugin;
	}
}

export default KeyMapExtension;
