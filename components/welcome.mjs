import { loadFile } from "../main.mjs";
import { createTab } from "../ui.mjs";
import { EVENT_LISTENERS, parse } from "/javascript/module/ArrayHTML.mjs";
import { open } from "/javascript/module/FileIO.mjs";
const content = Array.from(parse([
	["div", null, { id: "welcome-icon" }],
	["button", "打开 JSON 文件", {
		id: "welcome-open", class: "default-color", [EVENT_LISTENERS]: [["click", async function () {
			try { loadFile(await open({ types: [{ accept: { "application/json": [".json"] } }] })) } catch (e) { }
		}]]
	}]
]).childNodes);
function show() { createTab("welcome", "欢迎", content, false) }
show();
export { show };