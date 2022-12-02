import { history } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import { PlainExtension } from "../..";

class HistoryExtension extends PlainExtension {
	static extensionName: string = 'history';
	get name(): string {
		return HistoryExtension.extensionName;
	}

	createPlugin(): void | Plugin<any> {
		return history();
	}
}

export default HistoryExtension;
