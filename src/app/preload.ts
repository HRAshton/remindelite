// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window {
        electron: {
            getData: (key: string) => Promise<string | null>;
            setData: (key: string, value: string) => Promise<void>;
            getAllData: () => Promise<Record<string, string>>;
        };
    }
}

contextBridge.exposeInMainWorld('electron', {
    getData: (key: string) => ipcRenderer.invoke('getData', key),
    setData: (key: string, value: string) => ipcRenderer.invoke('setData', key, value),
    getAllData: () => ipcRenderer.invoke('getAllData'),
});