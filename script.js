const sassPlugin = {
	name: "scss",
	setup(build) {
		const path = require("path")
		const sass = require("sass")

		build.onResolve({ filter: /\.scss$/ }, args => ({
			path: args.path,
			namespace: "scss-ns",
		}))

		build.onLoad({ filter: /.*/, namespace: "scss-ns" }, async args => {
			const result = sass.renderSync({
				file: path.join("src", args.path),
			})
			return {
				contents: result.css.toString(),
				loader: "css",
				watchFiles: result.stats.includedFiles,
			}
		})
	},
}

async function main() {
	await require("esbuild").build({
		bundle: true,
		entryPoints: ["src/index.js"],
		outdir: "out",
		watch: {
			onRebuild(error, result) {
				console.log("a watch.onRebuild event occurred")
			},
		},
		plugins: [sassPlugin],
	})
}

main()
