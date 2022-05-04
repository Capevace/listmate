const { initRemix } = require('remix-electron');
const { app, components, BrowserWindow } = require('electron');
const { resolve } = require('node:path');

let win;

app.whenReady().then(async () => {
	try {
		await components.whenReady();
		const url = await initRemix({
			serverBuild: resolve(__dirname, '../../build'),
			publicFolder: resolve(__dirname, '../../public'),

			/** @type {import("~/models/context").LoadContext} */
			getLoadContext() {
				return {
					userId: '918db1b0-9382-47aa-bbb8-f842fef2067d',
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
