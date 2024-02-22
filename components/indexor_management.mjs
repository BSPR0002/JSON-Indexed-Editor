import { config } from "../data.mjs";
import { parse, parseAndGetNodes, EVENT_LISTENERS } from "/javascript/module/ArrayHTML.mjs";
import { changeTab, createTab, getTab } from "../ui.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";


const { listFrame, detail, list, saveSet, applySet, deleteSet } = parseAndGetNodes([
	["div", [
		["button", [
			["span", "当前使用方案", { class: "indexor-management-set-name" }],
			["span", ["n", "个索引器，", "n", "个变量"], { class: "indexor-management-set-detail" }]
		], { class: "indexor-management-set current", "data-id": "current" }],
		["div", "保存的方案", { id: "indexor-management-list-title" }],
		["div", [
			["button", [
				["span", "方案1", { class: "indexor-management-set-name" }],
				["span", ["n", "个索引器，", "n", "个变量"], { class: "indexor-management-set-detail" }]
			], { class: "indexor-management-set", "data-id": "0" }]
		], { id: "indexor-management-list" }, "list"]
	], { id: "indexor-management-list-frame" }, "listFrame"],
	["div", [
		["div", [
			["span", "方案名称", { id: "indexor-management-detail-name" }],
			["div", [
				["button", "保存方案", { class: "default-color" }, "saveSet"],
				["button", "使用方案", { class: "default-color" }, "applySet"],
				["button", "删除方案", { class: "default-color" }, "deleteSet"]
			], { id: "indexor-management-detail-buttons" }]
		], { id: "indexor-management-detail-top" }],
		["div", [
			["div", [
				["span", ["变量（", ["#text", 1, null, "variablesNumber"], "）"]],
				["div", [
					["span", "x", {title: "x"}]
				], { class: "indexor-management-detail-part-content", id: "indexor-management-detail-variables" }, "variables"]
			], { class: "indexor-management-detail-part" }],
			["div", [
				["span", ["索引器（", ["#text", 1, null, "indexoresNumber"], "）"]],
				["div", [
					["div", [
						['span',"名称："],['span',"示例名称"],
						['span',"路径："],['span',".examplePath"]
					]]
				], { class: "indexor-management-detail-part-content", id: "indexor-management-detail-indexores" }, "indexores"]
			], { class: "indexor-management-detail-part" }]
		], { id: "indexor-management-detail-content" }]
	], { id: "indexor-management-detail" }, "detail"]
]).nodes;



function show() { changeTab(getTab("indexor-management") || createTab("indexor-management", "索引器方案", [listFrame, detail])) }
export default show;
export { show };