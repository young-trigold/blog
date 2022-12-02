import { extensionName, PlainExtension } from '../..';

@extensionName('input_rule')
class InputRuleExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default InputRuleExtension;
