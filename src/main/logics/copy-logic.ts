const { ipcMain } = require('electron');
const { existsSync } = require('fs');
const { fork } = require('child_process');
const config = require('../config');
const { resolve } = require('path');
const customEvent = require('../event');
const { getExistDist } = require('./dist-change-logic');

let childs: any[] = [];

let dists: any[] = [];

const liseners = [];

const childCount = 1;

let win: any = null;

let lastDist: any = null;

function emit (data: any) {
  console.log('emit', data)
  if (!win) return console.log('no win');

  win.webContents.send('copy:state-change', data)
}


customEvent.on('DistChange', (data: any) => {
  dists = data;
});

function updateChilds(path: string) {
  childs = childs.filter(ele => !ele.__end__);
  
  if (childs.length < childCount) {
    const index = dists.findIndex(ele => ele.name === lastDist);
    if (index === -1) return;

    if (dists[index+1]) startCopy(path, dists[index+1])
  }
}

function startCopy(path: any, dist: any) {
  console.log('startCopy', path, dist)
  if (!dist) return;

  dist = dist.name;

  lastDist = dist;

  emit({ type: 'start', dist });
  const child = fork(resolve(__dirname, 'copy.js'), [path, `${dist}:\/`]);
  child.on('message', ({ action }: { action: any }) => {
    console.log(action, 'action');
    if (action === 'success') {
      emit({ type: 'success', dist });
      console.log('copy success');
    } else if (action === 'fail') {
      console.log('copy fail');
      emit({ type: 'fail', dist });
    }
  });

  const handle = () => {
    child.__end__ = true;
    updateChilds(path);
  }

  child.on('exit', handle);
  child.on('close', handle);
  child.on('error', handle);

  childs.push(child);
}

function copy(e: any, path: any) {
  console.log('entry copy');
  if (existsSync(path)) {
    if (config.targetPath !== path) config.update('targetPath', path);
    let i = 0;
    while(i < childCount) {
      console.log('entry while')
      startCopy(path, dists[i]);
      i++;
    }
  } else {
    console.log('目标目录不存在', path);
    return { message: '目标目录不存在' }
  }

}

function initCopyEvents (_win: any) {
  if (!dists.length) dists = getExistDist();
  ipcMain.handle('copy:start', copy);
  win = _win;
}

module.exports.initCopyEvents = initCopyEvents;

module.exports.onCopyStateChange = (cb: any) => {
  console.log('add cb')
  if (typeof cb !== 'function') return;
  liseners.push(cb);
}