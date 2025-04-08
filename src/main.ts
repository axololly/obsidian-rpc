import { App, Plugin, PluginManifest } from "obsidian";
import { RPC } from "./rpc";

const openedSince = Math.floor(Date.now() / 1e3);

export default class ObsidianRPC extends Plugin {
    rpc: RPC;

    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.rpc = new RPC(openedSince);
    }
    
    async onload() {
        let currentLeaf = this.app.workspace.getMostRecentLeaf();

        if (currentLeaf) {
            this.rpc.onChangeFile(currentLeaf);
        }
        
        this.app.workspace.on(
            "active-leaf-change",
            (leaf) => {
                this.rpc.onChangeFile(leaf);
            }
        );

        window.addEventListener(
            "focus",
            () => { this.rpc.onChangeFocus(true); }
        );
        window.addEventListener(
            "blur",
            () => { this.rpc.onChangeFocus(false); }
        );
    }

    async onunload() {
        this.rpc.onUnload();
    }
}