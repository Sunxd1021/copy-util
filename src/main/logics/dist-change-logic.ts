const { usb } = require('usb');
const { existsSync } = require('fs');
import event from "../event";
const { ipcMain } = require('electron');
// u盘插拔事件

const files = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

function getExistDist() {
  const list = [];

  for (const dist of files) {
    if (existsSync(`${dist}:\/`)) {
      list.push({ name: dist });
    } else {
      // break;
    }
  }

  event.emit('DistChange', list);
  return list;
}

function emitLisener() {
  const info = getExistDist();
  event.emit('postMessageToWindow', { key: 'dist:change', data: info });
}

usb.on('attach', emitLisener);

usb.on('detach', emitLisener);

ipcMain.handle('dist:init', getExistDist)

export { getExistDist }