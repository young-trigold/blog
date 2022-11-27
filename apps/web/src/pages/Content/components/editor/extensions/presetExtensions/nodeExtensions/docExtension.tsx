import { NodeSpec } from 'prosemirror-model';
import { ExtensionTag, NodeExtension } from '../..';

class DocExtension extends NodeExtension {
  static extensionName = 'doc';
	get name() {
		return DocExtension.extensionName;
	}

	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Block}+`,
		};
	}
}

export default DocExtension;
