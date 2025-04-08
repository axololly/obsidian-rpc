import { Client } from "discord-rpc";
import { getLogger } from "./logging";
import { TFile, WorkspaceLeaf } from "obsidian";

let logger = getLogger("rpc-client");

const NORMAL = "https://github.com/axololly/obsidian-rpc/raw/main/icon.png";
const PAUSED = "https://github.com/axololly/obsidian-rpc/raw/main/icon-paused.png";

export class RPC {
    client: Client;
    idlingTimeout?: NodeJS.Timeout;
    lastOpenedFile?: TFile;
    openedSince: number;

    constructor (openedSince: number) {
        this.client = new Client({ transport: "ipc" });
        
        this.client.on("ready", () => {
            logger.info(`Authed for user ${this.client.user!.username!}`);
        });

        this.openedSince = openedSince;

        this.client.login({ clientId: "1359134847746183229" });
    }

    private updateNormal(file: TFile) {
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

        this.lastOpenedFile = file;

        this.updateNormal(file);
    }

    onChangeFocus(isFocused: boolean) {
        if (isFocused) {
            clearTimeout(this.idlingTimeout);
            
            this.updateNormal(this.lastOpenedFile!);
            
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
        let file = this.lastOpenedFile;

        if (!file) {
            logger.warning("Last opened file was undefined when attempting to update RPC on idling. RPC was not updated.");
            return;
        }
        
        this.client.setActivity({
            largeImageKey: PAUSED,
            largeImageText: "Editing an Obsidian vault.",
            details: `Editing: ${file.basename}`,
            state: `Idling in: ${file.vault.getName()}`,
            startTimestamp: this.openedSince
        });

        logger.debug([
            "Set paused (idling) activity.",
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