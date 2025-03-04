import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

contextBridge.exposeInMainWorld("electron", {
	...electronAPI,
	ipcRenderer: {
		send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
		invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
		on: (channel: string, listener: (event: any, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
		removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
	},
});
