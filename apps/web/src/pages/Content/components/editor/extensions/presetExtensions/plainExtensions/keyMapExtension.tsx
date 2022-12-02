import { extensionName, PlainExtension } from '../..';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default KeyMapExtension;
