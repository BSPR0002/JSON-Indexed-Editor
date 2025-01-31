import { read, readableTypes } from "/javascript/module/FileIO.mjs";
import { MiniWindow } from "/javascript/module/MiniWindow.mjs";
import { getTab } from "./ui.mjs";
import { openFile } from "./tree.mjs";
import { show as showWelcome } from "./components/welcome.mjs";
import { show as showEdit } from "./components/indexed_edit.mjs";
var working = false, pending = false;
async function loadFile(fileHandle) {
	if (pending || working) return;
	pending = true;
	const closeWaitWin = MiniWindow.wait("正在加载，请稍等……");
	let data
	try {
		data = JSON.parse(await read(await fileHandle.getFile(), readableTypes.TEXT));
		fileHandle.requestPermission({ mode: "readwrite" });
	} catch (error) {
		pending = false;
		MiniWindow.alert("无法解读该文件，请选择正确的 JSON 文件。", "错误！");
		closeWaitWin();
		return;
	}
	startWork(data, fileHandle);
	document.title = fileHandle.name;
	pending = false;
	closeWaitWin();
}
function preventDefault(event) { event.preventDefault() }
function startWork(data, fileHandle) {
	if (working) {
		MiniWindow.alert("此实例已经打开了文件，请启动一个新实例。");
		return;
	}
	working = true;
	openFile(data, fileHandle);
	getTab("welcome").close();
	showEdit();
}
function endWork() {
	working = false;
	document.title = "JSON 索引化编辑器"
	getTab("indexed-edit").close();
	showWelcome();
}
document.addEventListener("dragover", event => {
	event.preventDefault();
	event.dataTransfer.dropEffect = "none";
});
document.addEventListener("drop", preventDefault);
showWelcome();
// @ts-ignore
launchQueue.setConsumer(function (launchParams) {
	const file = launchParams.files[0];
	if (file) loadFile(file);
});
document.getElementById("loading-mask").remove();
export { endWork, loadFile }