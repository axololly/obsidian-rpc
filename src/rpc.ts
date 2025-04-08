import { Client } from "discord-rpc";
import { getLogger } from "./logging";
import { WorkspaceLeaf } from "obsidian";

let logger = getLogger("rpc-client");

const NORMAL = "https://github.com/axololly/obsidian-rpc/raw/main/icon.png";
const PAUSED = "https://github.com/axololly/obsidian-rpc/raw/main/icon-paused.png";

export class RPC {
    client: Client;
    idlingTimeout?: NodeJS.Timeout;
    lastOpenedFile?: WorkspaceLeaf;
    openedSince: number;

    constructor (openedSince: number) {
        this.client = new Client({ transport: "ipc" });
        
        this.client.on("ready", () => {
            logger.info(`Authed for user ${this.client.user!.username!}`);
        });

        this.openedSince = openedSince;

        this.client.login({ clientId: "1359134847746183229" });
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
            largeImageKey: NORMAL,
            largeImageText: "Editing an Obsidian vault.",
            details: `Editing: ${file.basename}`,
            state: `Working in: ${file.vault.getName()}`,
            startTimestamp: this.openedSince
        });

        logger.debug([
            "Set normal activity.",
            `Details: "Editing: ${file.basename}"`,
            `State: "Working in: ${file.vault.getName()}"`,
            `Opened since: ${new Date(this.openedSince * 1000).toLocaleString()} (${this.openedSince})`
        ].join("\n"));
    }

    onChangeFocus(isFocused: boolean) {
        if (isFocused) {
            clearTimeout(this.idlingTimeout);
            return;
        }
        
        this.idlingTimeout = setTimeout(
            () => {
                this.onIdle();
            },
            60e3
        );
    }

    onIdle() {
        if (!this.lastOpenedFile) {
            logger.warning("Last opened file was undefined when attempting to update RPC on idling. RPC was not updated.");
            return;
        }

        let info = this.lastOpenedFile!.view.app.workspace.activeEditor;

        if (!info) {
            logger.warning("No active editor was found when attempting to update RPC on idling. RPC was not updated.");
            return;
        }

        let file = info.file;

        if (!file) {
            logger.warning("No file was found when attempting to update RPC on idling. RPC was not updated.");
            return;
        }
        
        this.client.setActivity({
            largeImageKey: NORMAL,
            largeImageText: "Editing an Obsidian vault.",
            details: `Editing: ${file.basename}`,
            state: `Idling in: ${file.vault.getName()}`,
            startTimestamp: this.openedSince
        });

        logger.debug([
            "Set idling activity.",
            `Details: "Editing: ${file.basename}"`,
            `State: "Idling in: ${file.vault.getName()}"`,
            `Opened since: ${new Date(this.openedSince * 1e3).toLocaleString()} (${this.openedSince})`
        ].join("\n"));
    }

    onUnload() {
        logger.info("Unloading extension.");
        
        this.client.destroy();

        clearTimeout(this.idlingTimeout);
    }
}