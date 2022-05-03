const { initRemix } = require('remix-electron');
const { app, BrowserWindow } = require('electron');
const { resolve } = require('node:path');

let win;

app.on('ready', async () => {
	try {
		const url = await initRemix({
			serverBuild: resolve(__dirname, '../../build'),
			publicFolder: resolve(__dirname, '../../public'),

			/** @type {import("~/models/context").LoadContext} */
			getLoadContext() {
				return {
					userId: '123',
				};
			},
		});

		win = new BrowserWindow({ show: false });
		await win.loadURL(url);
		win.show();
	} catch (error) {
		console.error(error);
	}
});
