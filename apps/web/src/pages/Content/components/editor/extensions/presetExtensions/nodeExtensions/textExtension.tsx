import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '../..';

class TextExtension extends NodeExtension {
	static extensionName = 'text';
	get name() {
		return TextExtension.extensionName;
	}

	createTags() {
		return [ExtensionTag.Inline];
	}

	createNodeSpec(): NodeSpec {
		return {};
	}
}

export default TextExtension;
