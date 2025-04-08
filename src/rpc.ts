import { Client } from "discord-rpc";
import { getLogger } from "./logging";
import { MarkdownFileInfo, MarkdownView, WorkspaceLeaf } from "obsidian";

let logger = getLogger("rpc-client");

export class RPC {
    client: Client;
    openedSince: number;

    constructor (openedSince: number) {
        this.client = new Client({ transport: "ipc" });
        
        this.client.on("ready", () => {
            logger.info(`Authed for user ${this.client.user!.username!}`);
        });

        this.openedSince = openedSince;

        this.client.login({ clientId: "773953458901352488" });
    }

    onChangeFile(leaf: WorkspaceLeaf | null) {
        if (!leaf) {
            logger.warning("Could not locate a workspace leaf.");
            return;
        }
        
        let info = leaf.view.app.workspace.activeEditor;

        if (!info) {
            logger.warning("Could not locate an active editor.");
            return;
        }
        
        let file = info.file;

        if (!file) {
            logger.warning("Could not locate a file when changing file.");
            return;
        }

        this.client.setActivity({
            largeImageKey: "https://github.com/axololly/obsidian-rpc/tree/main/icon.png",
            largeImageText: "Editing an Obsidian vault.",
            details: `Editing: ${file.name}`,
            state: `Working in: ${file.vault.getName()}`,
            startTimestamp: this.openedSince
        });
    }

    onUnload() {
        logger.info("Destroying client.");
        this.client.destroy();
    }
}