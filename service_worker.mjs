import CacheController from "../support.mjs"
const cacheController = new CacheController(2); // version
self.addEventListener("install", event => {
    event.waitUntil(cacheController.install({
        own: [
            // [".git",".gitattributes","info.json","service_worker.mjs"]
            "buttons.svg",
            "components/indexed_edit.mjs",
            "components/indexor_management.mjs",
            "css/indexed_edit.css",
            "css/main.css",
            "data.mjs",
            "icon_monochrome.svg",
            "icon.png",
            "icon.svg",
            "index.html",
            "indexor.mjs",
            "main.mjs",
            "manifest.webmanifest",
            "menu.mjs",
            "tree.mjs",
            "ui.mjs"
        ],
        requiredScripts: [
            "ArrayHTML.mjs",
            "MiniWindow.mjs",
            "IndexedDatabase.mjs",
            "PromiseWithResolvers.mjs",
            "FileIO.mjs",
            "BinaryOperate.mjs"
        ],
        shared: [
            "/css/BSIF_style.css"
        ]
    }))
});
self.addEventListener("fetch", event => { event.respondWith(cacheController.respond(event.request)) });
self.addEventListener("activate", event => { event.waitUntil(cacheController.clean()) });