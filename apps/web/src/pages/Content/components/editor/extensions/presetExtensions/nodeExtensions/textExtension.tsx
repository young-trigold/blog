import { NodeSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, NodeExtension } from '../../type';

@extensionName('text')
class TextExtension extends NodeExtension {
	createTags() {
		return [ExtensionTag.Inline];
	}

	createNodeSpec(): NodeSpec {
		return {};
	}
}

export default TextExtension;
