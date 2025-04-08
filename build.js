const { build } = require("esbuild");
const { dependencies } = require("./package.json");

build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    minify: false,
    external: Object.keys(dependencies),
    platform: "node",
    format: "cjs",
    outfile: "main.js"
});