import { EVENT_LISTENERS, parse } from "/javascript/module/ArrayHTML.mjs";
import showMenu from "/javascript/module/ContextMenu.mjs";
const menus = [], menuElement = document.getElementById("menu");
var focused = false;
function renderMenu() {
	menuElement.innerHTML = "";
	// @ts-ignore
	menuElement.appendChild(parse(menus.map(menuItemMapper)))
}
/**
 * 
 * @param {KeyboardEvent} event 
 */
function preventTab(event) { if (!event.ctrlKey && event.shiftKey && event.altKey && event.key == "tab") event.preventDefault() }
function onMenuFocus(e) {
	console.log(e.type, document.activeElement, e)
	focused = true;
	document.addEventListener("keydown", preventTab);
	menuElement.removeEventListener("focusin", onMenuFocus);
}
function onMenuBlur(e) {
	console.log(e.type, document.activeElement, e)
	focused = false;
	document.removeEventListener("keydown", preventTab);
	menuElement.addEventListener("focusin", onMenuFocus);
}
function focusMenu() {

}
menuElement.addEventListener("focusin", onMenuFocus);
/**
 * 
 * @param {{ currentTarget: HTMLButtonElement }} param0 
 */
function clickMenu({ currentTarget }) { showMenu(menus[currentTarget.tabIndex].list, { element: currentTarget }, { darkStyle: true }) }
function menuItemMapper(item, tabindex) {
	return ["button", item.text, { class: "menu-item", tabindex, [EVENT_LISTENERS]: [["mouseenter", focusMenu], ["click", clickMenu]] }]
}
function menuMapper2(item) { return ["button", item.title, { class: "menu-option", [EVENT_LISTENERS]: [["click", item.action]] }] }
export { menus, renderMenu };