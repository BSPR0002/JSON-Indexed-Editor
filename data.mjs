import IndexedDatabase from "/javascript/module/IndexedDatabase.mjs";
const database = await IndexedDatabase.open("org.BSIF.JSONIndexedEditor", 2, upgrader => {
	if (!upgrader.hasObjectStore("config")) upgrader.createObjectStore("config");
	if (!upgrader.hasObjectStore("UI")) upgrader.createObjectStore("UI");
	if (!upgrader.hasObjectStore("indexors")) upgrader.createObjectStore("indexors", { keyPath: "name" });
}),
	config = database.getObjectStore("config"),
	uiData = database.getObjectStore("UI"),
	indexorStorage = database.getObjectStore("indexors");
export { config, uiData, indexorStorage };