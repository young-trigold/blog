import { extensionName, PlainExtension } from '../../type';

@extensionName('input_rule')
class InputRuleExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default InputRuleExtension;
