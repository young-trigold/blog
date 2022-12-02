import { extensionName, PlainExtension } from '../..';

@extensionName('decoration')
class DecorationExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default DecorationExtension;
