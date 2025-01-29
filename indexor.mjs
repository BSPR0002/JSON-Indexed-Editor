import { TreeCollectionNode, tree } from "./tree.mjs";
const parse = JSON.parse,
	literalRegexp = /\[('(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|\d+)]/y,
	propertyRegexp = /\.([A-Za-z_$][\w$]*)/y,
	variableRegexp = /\[([A-Za-z_$][\w$]*)]/y;
class Expression extends String {
	constructor(value) {
		super(value);
		Object.freeze(this);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		})
	}
}
class Indexor {
	#route = Object.freeze([]);
	get route() { return this.#route }
	#path = "";
	get path() { return this.#path }
	set path(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		const route = [], length = (this.#path = value).length;
		var index = 0;
		while (index < length) {
			literalRegexp.lastIndex = propertyRegexp.lastIndex = variableRegexp.lastIndex = index;
			let temp;
			if (temp = literalRegexp.exec(value)) {
				route.push(parse(temp[1]));
				index = literalRegexp.lastIndex;
			} else if (temp = propertyRegexp.exec(value)) {
				route.push(temp[1]);
				index = propertyRegexp.lastIndex;
			} else if (temp = variableRegexp.exec(value)) {
				route.push(new Expression(temp[1]));
				index = variableRegexp.lastIndex;
			} else {
				this.#route = null;
				return;
			}
		}
		this.#route = Object.freeze(route);
	}
	/**
	 * Find node from JSON data.
	 * @param {Map<string, {value: number}>} variables
	 * @returns
	 */
	getNode(variables) {
		const route = this.#route;
		if (!route) throw new Error("Invalid path.");
		var target = tree;
		for (let key of route) if (target instanceof TreeCollectionNode) {
			if (key instanceof Expression) {
				const variable = variables?.get(key.toString());
				if (variable) { target = target.get(variable.value) } else return;
			} else target = target.get(key);
		} else return null;
		return target;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		})
	}
}
export { Indexor };