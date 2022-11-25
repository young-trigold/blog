import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '../..';

class TextExtension extends NodeExtension {
	get name() {
		return 'text' as const;
	}

	createTags() {
		return [ExtensionTag.Inline];
	}

	createNodeSpec(): NodeSpec {
		return {};
	}
}

export default TextExtension;
