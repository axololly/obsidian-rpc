# Obsidian RPC Extension

[![Current Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Faxololly%2Fobsidian-rpc%2Fraw%2Fmain%2Fmanifest.json&query=%24.version&label=version&color=default)](https://github.com/axololly/obsidian-rpc/releases/tag/v0.1.0)

I saw a plugin on the community plugins section that did exactly this, but it used an outdated logo, so I figured I'd put together something that just about fits my needs, which is this project. With much of it being a dumbed-down version of my [Visual Studio Code extension](https://github.com/axololly/discode/tree/main), I now can display the current document and vault on my Discord account's rich presence, complete with a pause screen for whenever I go idle for longer than a minute.

> [!warning]
> This doesn't have any settings menu, so nothing about it is customisable. The subtext always shows the current document and vault, and it will always go idle after more than 60 seconds of unfocusing from the client.

## Setup

This uses `esbuild` to compile all the TypeScript files into a single file for ease of transfer, so if you want to clone and build from source, install it as a depedency and run the [`build.js`](./build.js) file with `node`, which will output a single JavaScript file called `main.js`. This is the extension.

> [!info]
> If you _don't_ want to build it yourself and just want to get straight to the action, you can install it from the releases on the side.

You can now take that file and in your designated vault (denoted as `~`):

1. Enter `~/.obsidian/plugins`
2. Make a folder for the extension (I have `Obsidian RPC Extension` for mine)
3. Paste in the `main.js` file from earlier

You can now go back into your client, and:

1. Open settings
2. Open community plugins, allowing running them if you haven't before
3. Refresh the plugins to include the new extension
4. Enable the extension

This should now update your Discord client with information about your Obsidian vault.

## Issues

If the extension isn't working correctly, check the development tools and see what ends up in the console, and include this in the issue you make. Usually that's a telltale sign of what's wrong with the extension.