#! /usr/bin/env node

const path = require('path');
const os = require('os');
const { createApp } = require('@remix-run/serve');

let port = Number.parseInt(process.env.PORT || "3000", 10);
if (Number.isNaN(port)) {
  port = 3000;
}

const buildPathArg = process.env.BUILD_DIR ?? process.argv[3];

if (process.argv[2] !== 'serve') {
	console.error(`\nUsage: listmate serve [build-dir]`);
	process.exit(1);
}

const buildPath = buildPathArg ? path.resolve(process.cwd(), buildPathArg) : path.resolve(__dirname, '../build');

const findHost = () => {
	const host = Object.values(os.networkInterfaces())
		.flat()
		.find((ip) => ip && ip.family === "IPv4" && !ip.internal);

	return host ? host.address : null;
};

function onListen() {
	const address = process.env.HOST ?? findHost();
	
	if (!address) {
		console.log(`Listmate server started at http://localhost:${port}`);
	} else {
		console.log(
			`Listmate server started at http://localhost:${port} (http://${address}:${port})`
		);
	}
}

const app = createApp(buildPath);
const server = process.env.HOST
	? app.listen(port, process.env.HOST, onListen)
	: app.listen(port, onListen);

["SIGTERM", "SIGINT"].forEach((signal) => {
	process.once(signal, () => server && server.close(console.error));
});