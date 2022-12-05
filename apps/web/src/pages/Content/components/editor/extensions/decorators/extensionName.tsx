import { Extension } from "../type";

export const extensionName = (name: string) => {
	const decorator = <
		F extends {
			new (...args: any[]): Extension;
		},
	>(
		constructor: F,
	) => {
		const Extension = class extends constructor {
			static extensionName = name;
			get name() {
				return name;
			}
		};

		return Extension;
	};

	return decorator;
};
