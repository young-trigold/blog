import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '../..';

class DocExtension extends NodeExtension {
	get name() {
		return 'doc' as const;
	}

	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Block}+`,
		};
	}
}

export default DocExtension;
