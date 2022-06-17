import { ipcMain } from "electron";
import { existsSync } from 'fs-extra';
import { fork } from "child_process";
import config from "../config";
import { resolve } from "path";
import customEvent from '../event';
import { getExistDist } from './dist-change-logic';

let childs: any[] = [];

let dists: any[] = [];

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
  const child: any = fork(resolve(__dirname, 'copy.ts'), [path, `${dist}:\/`], {
    // 指定子进程使用ts-node
    execArgv: ['.\\node_modules\\ts-node\\dist\\bin.js']
  });
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

function copy(_e: any, path: any) {
  console.log('entry copy');
  if (existsSync(path)) {
    if (config.targetPath !== path) config.update('targetPath', path);
    let i = 0;
    while(i < childCount) {
      console.log('entry while')
      startCopy(path, dists[i]);
      i++;
    }
    return { message: '开始复制' }
  } else {
    console.log('目标目录不存在', path);
    return { message: '目标目录不存在' }
  }

}

export const initCopyEvents = (_win: any) => {
  if (!dists.length) dists = getExistDist();
  ipcMain.handle('copy:start', copy);
  win = _win;
}
