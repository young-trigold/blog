import { PlainExtension } from '../..';

class CommandExtension extends PlainExtension {
	get name() {
		return 'command' as const;
	}
}

export default CommandExtension;
