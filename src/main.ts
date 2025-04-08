import { App, Plugin, PluginManifest } from "obsidian";
import { RPC } from "./rpc";

const openedSince = Date.now() / 1000;

export default class ObsidianRPC extends Plugin {
    rpc: RPC;

    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.rpc = new RPC(openedSince);
    }
    
    async onload() {
        this.app.workspace.on(
            "active-leaf-change",
            (leaf) => {
                this.rpc.onChangeFile(leaf);
            }
        );
    }

    async onunload() {
        this.rpc.onUnload();
    }
}