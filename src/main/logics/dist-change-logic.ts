import { usb } from 'usb';
import { existsSync } from 'fs-extra';
import event from "../event";
import { ipcMain } from 'electron';
import config from "../config";
import messageToWeb from "../message-to-web";
// u盘插拔事件

const files = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

function getExistDist() {
  const list = [];
  const { ignoreDist } = config;

  for (const dist of files) {
    if (existsSync(`${dist}:\/`)) {
      list.push({ name: dist, ignore: ignoreDist.includes(dist) });
    }
  }

  event.emit('DistChange', list);
  return list;
}

function emitLisener() {
  const info = getExistDist();
  messageToWeb.send({ key: 'dist:change', data: info });
}

usb.on('attach', emitLisener);

usb.on('detach', emitLisener);

ipcMain.handle('dist:init', getExistDist)

export { getExistDist }