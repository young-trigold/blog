import { extensionName, PlainExtension } from '../../type';

@extensionName('decoration')
class DecorationExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default DecorationExtension;
