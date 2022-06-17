import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
const config = require('./config');

export type Channels = 'ipc-example';
interface S {
  [key: string]: any
}

const data: S = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  startCopy: (path: string) => ipcRenderer.invoke('copy:start', path),
  toggleDistState: (dist: string) => ipcRenderer.invoke('dist:stateChange', dist),
  getInitDist: () => ipcRenderer.invoke('dist:init'),
  onDistChange: (cb: () => any) => {
    if (typeof cb !== 'function') return;
    ipcRenderer.on('dist:change', cb);
  },
  getTargetPath: () => config.targetPath,
  onCopyStateChange: (cb: () => void) => {
    if (typeof cb !== 'function') return;
    ipcRenderer.on('copy:state-change', cb);
  },
}

contextBridge.exposeInMainWorld('electron', data);
