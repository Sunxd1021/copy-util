const { usb } = require('usb');
const { existsSync } = require('fs');
// const event = require('../event');
import event from "../event";
const { ipcMain } = require('electron');
// u盘插拔事件
const liseners = [];

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

function onDistChange(cb: any) {
  if (typeof cb !== 'function') return;
  if (!liseners.length) {
    cb(getExistDist())
  }
  liseners.push(cb);
}

ipcMain.handle('dist:init', getExistDist)


module.exports.onDistChange = onDistChange;

module.exports.emitLisener = emitLisener;

module.exports.getExistDist = getExistDist;