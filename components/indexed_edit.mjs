import { Indexor } from "../indexor.mjs";
import { parse as parseAH, parseAndGetNodes, EVENT_LISTENERS } from "/javascript/module/ArrayHTML.mjs";
import { createTab } from "../ui.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import { currentSet, modifyCurrentSet, show as showIndexorManager } from "./indexor_management.mjs";
import showMenu from "/javascript/module/ContextMenu.mjs";
const { stringify, parse } = JSON,
	/** @ts-ignore @type {{indexorFrame: HTMLDivElement, index: HTMLInputElement}} */
	{ indexorFrame, index } = parseAndGetNodes([
		["input", null, { id: "indexed-edit-index-set", type: "number", value: 0, min: 0, step: 1, max: 4294967295, title: "索引编号" }, "index"],
		["div", null, { id: "indexed-edit-indexor-frame" }, "indexorFrame"],
		["button", "+", { id: "indexed-edit-indexor-add", class: "default-color", title: "增加一个索引器", [EVENT_LISTENERS]: [["click", newIndexor]] }]
	]).nodes;
//索引器部分
var indexors, variables = [];
class IndexorItem {
	#indexor = new Indexor;
	#name = "";
	/** @type {HTMLInputElement} */
	#nameElement;
	get name() { return this.#name }
	set name(value) {
		if (typeof value != "string") throw new TypeError("Invalid type");
		this.#nameElement.value = this.#name = value;
	}
	#userChangedName() { this.#name = this.#nameElement.value }
	/** @type {HTMLInputElement} */
	#pathElement;
	get path() { return this.#indexor.path }
	set path(value) {
		this.#pathElement.value = this.#indexor.path = value;
		this.#updateNode();
	}
	#node = null;
	get route() { return this.#indexor.route }
	#userChangedPath() {
		this.#indexor.path = this.#pathElement.value
		this.#updateNode();
	}
	#updateNode() {
		const path = this.#pathElement,
			content = this.#contentElement;
		content.value = "";
		content.className = "indexor-content";
		var node;
		try {
			node = this.#node = this.#indexor.getNode(variables);
		} catch (e) {
			this.#node = null;
			content.disabled = true;
			content.placeholder = "索引路径错误";
			path.className = "indexor-path invalid";
			return;
		}
		if (!node) {
			path.className = "indexor-path";
			content.disabled = true;
			content.placeholder = "索引路径无效";
			return;
		}
		const type = node.type;
		switch (type) {
			case "string":
			case "number":
			case "boolean":
				path.className = "indexor-path " + type;
				content.disabled = false;
				content.placeholder = "请输入内容";
				content.value = stringify(node.value);
				return;
			case "null":
			case "undefined":
				content.disabled = true;
				content.placeholder = type;
				break;
			default:
				content.disabled = true;
				content.placeholder = "无法编辑的类型";
		}
		path.className = "indexor-path";
	}
	/** @type {HTMLInputElement} */
	#contentElement;
	#content;
	get content() { return this.#content }
	set content(value) {
		if (typeof value != "string") throw new TypeError("Invalid type");
		setContent(this.#node, this.#contentElement.value = this.#content = value.trim())
	}
	#userChangedContent() {
		const contentElement = this.#contentElement;
		contentElement.className = setContent(this.#node, this.#content = contentElement.value.trim()) ? "indexor-content" : "indexor-content invalid";
	}
	/** @type {HTMLDivElement} */
	#element;
	get element() { return this.#element }
	constructor(name = "", path = "") {
		const nodes = parseAndGetNodes([["div", [
			["input", null, { class: "indexor-name", spellcheck: "false", placeholder: "索引器名称", value: name, [EVENT_LISTENERS]: [["input", this.#userChangedName.bind(this)]] }, "name"],
			["button", null, { class: "indexor-remove", title: "移除索引器", [EVENT_LISTENERS]: [["click", removeIndexor.bind(null, this)]] }],
			["span", "索引路径：", { class: "indexor-path-d" }],
			["input", null, { class: "indexor-path", spellcheck: "false", placeholder: "索引路径", value: path, [EVENT_LISTENERS]: [["input", this.#userChangedPath.bind(this)]] }, "path"],
			["input", null, { class: "indexor-content", spellcheck: "false", placeholder: "请输入内容", [EVENT_LISTENERS]: [["input", this.#userChangedContent.bind(this)]] }, "content"]
		], { class: "indexor" }, "element"]]).nodes;
		// @ts-ignore
		this.#element = nodes.element;
		// @ts-ignore
		this.#nameElement = nodes.name;
		// @ts-ignore
		this.#pathElement = nodes.path;
		// @ts-ignore
		this.#contentElement = nodes.content;
		this.#name = name;
		this.#indexor.path = path;
	}
	update() { this.#updateNode() }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		})
	}
}
function newIndexor() {
	const indexor = new IndexorItem;
	indexor.update();
	indexors.push(indexor);
	indexorFrame.appendChild(indexor.element);
}
async function removeIndexor(instance) {
	const i = indexors.indexOf(instance);
	if (i != -1 && await MiniWindow.confirm("确定要移除这个索引器吗？")) {
		indexors.splice(i, 1);
		instance.element.remove();
		modifyCurrentSet({ indexors, variables });
	}
}
async function removeAllIndexor() {
	if (indexors.length) {
		if (await MiniWindow.confirm("确定要移除全部索引器吗？")) {
			indexorFrame.innerHTML = "";
			indexors = [];
		}
	}
}
function updateAllIndexor() { for (const item of indexors) item.update() }
function setContent(node, content) {
	if (!node) return false;
	var parseContent;
	try { parseContent = parse(content) } catch (e) { return false }
	const type = typeof parseContent;
	if (type == node.type) {
		node.value = parseContent;
		node.content.innerText = content;
		return true;
	}
	return false;
}





const identifierRegexp = /^[A-Za-z_$][\w$]*$/;

function indexorDataMapper(item) { return ["div", [["span", ["名称：", item.name]], ["br"], ["span", ["路径：", item.path]]]] }
function buildIndexorData(message, data) {
	return parseAH([["div", [
		["span", message],
		["div", data.length ? data.map(indexorDataMapper) : "空", { class: "indexor-data" }]
	], { class: "indexor-data-frame" }]])
}


async function userLoadSet() {
	//TODO
}

function loadSet() {
	const { indexors: indexorSet, variables: variableSet } = currentSet;
	indexorFrame.innerHTML = "";
	indexors = [];
	for (const index in variableSet) {
		//TODO
	}
	if (indexorSet.length) {
		const fragment = new DocumentFragment;
		for (const { name, path } of indexorSet) {
			const item = new IndexorItem(name, path);
			indexors.push(item);
			fragment.appendChild(item.element);
		}
		indexorFrame.appendChild(fragment);
	} else {
		const item = new IndexorItem;
		indexors.push(item);
		indexorFrame.appendChild(item.element);
	}
	updateAllIndexor();
}





loadSet();

function holdMenu(element, list) {
	const classList = element.classList;
	classList.add("hold");
	showMenu(list, { element }, { darkStyle: true, onClose: onMenuClose.bind(null, classList), pureList: true });
}
function onMenuClose(classList) { classList.remove("hold") }

/** @type {Parameters<showMenu>[0]} */
const indexorMenu = [{
	type: "item",
	text: "添加索引器",
	onSelect: newIndexor
}, {
	type: "item",
	text: "移除全部索引器",
	onSelect: removeAllIndexor
}, {
	type: "item",
	text: "索引器方案管理",
	onSelect: showIndexorManager
}],
	variableMenu = [];

createTab("indexed-edit", "索引式编辑", [
	["div", [
		"索引变量",
		["button", null, {
			class: "indexed-edit-options", title: "索引变量选项",
			[EVENT_LISTENERS]: [["click", function () { holdMenu(this, variableMenu) }]]
		}],
		index
	], { id: "indexed-edit-variables" }],
	["div", [
		"索引器",
		["button", null, {
			class: "indexed-edit-options", title: "索引器选项",
			[EVENT_LISTENERS]: [["click", function () { holdMenu(this, indexorMenu) }]]
		}]
	], { id: "indexed-edit-indexor" }],
	indexorFrame
], false);

export { updateAllIndexor, loadSet };