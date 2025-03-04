import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import fs from "fs";
import path from "path";
import icon from "../../resources/icon.png?asset";

function createWindow(): void {
	const mainWindow = new BrowserWindow({
		width: 700,
		height: 650,
		show: false,
		autoHideMenuBar: true,
		icon: icon,
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

app.whenReady().then(() => {
	electronApp.setAppUserModelId("com.electron");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

const findFoldersRecursive = (dir: string, folderName: string, results: string[] = []) => {
	try {
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const fullPath = path.join(dir, file);
			if (fs.statSync(fullPath).isDirectory()) {
				if (file === folderName) {
					results.push(fullPath);
				}
				findFoldersRecursive(fullPath, folderName, results);
			}
		}
	} catch (error) {
		console.error("Erro ao acessar:", dir, error);
	}
	return results;
};

ipcMain.handle("find-folders", async (_event, rootPath: string, folderName: string) => {
	return findFoldersRecursive(rootPath, folderName);
});

ipcMain.handle("delete-folders", async (_event, folders: string[]) => {
	try {
		folders.forEach((folder) => {
			fs.rmSync(folder, { recursive: true, force: true });
		});
		return { success: true };
	} catch (error) {
		console.error("Erro ao deletar pastas:", error);
		return { success: false, error };
	}
});
