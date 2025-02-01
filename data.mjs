import IndexedDatabase from "/javascript/module/IndexedDatabase.mjs";
const database = await IndexedDatabase.open("org.BSIF.JSONIndexedEditor", 2, upgrader => {
	if (upgrader.hasObjectStore("config")) upgrader.deleteObjectStore("config");
	if (upgrader.hasObjectStore("UI")) upgrader.deleteObjectStore("UI");
	if (upgrader.hasObjectStore("indexors")) upgrader.deleteObjectStore("indexors");
	upgrader.createObjectStore("config");
	upgrader.createObjectStore("UI");
	upgrader.createObjectStore("indexors", { keyPath: "name" });
}),
	config = database.getObjectStore("config"),
	uiData = database.getObjectStore("UI"),
	indexorStorage = database.getObjectStore("indexors");
export { config, uiData, indexorStorage };