import { gapCursor } from 'prosemirror-gapcursor';
import { Plugin } from 'prosemirror-state';
import { PlainExtension } from '../..';

class GapCursorExtension extends PlainExtension {
	static extensionName: string = 'gapCursor';
	get name(): string {
		return GapCursorExtension.extensionName;
	}

	createPlugin(): void | Plugin<any> {
		return gapCursor();
	}
}

export default GapCursorExtension;
