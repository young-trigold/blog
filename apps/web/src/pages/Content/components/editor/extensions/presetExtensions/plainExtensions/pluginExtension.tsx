import { PlainExtension } from '../..';

class PluginExtension extends PlainExtension {
	get name() {
		return 'plugin' as const;
	}
}

export default PluginExtension;
