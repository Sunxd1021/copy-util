import { ipcMain, IpcMainInvokeEvent } from "electron";
import { existsSync } from 'fs-extra';
import { fork } from "child_process";
import config from "../config";
import { resolve } from "path";
import customEvent from '../event';
import { getExistDist } from './dist-change-logic';
import messageToWeb from '../message-to-web';
import { cpus } from 'os';

let childs: any[] = [];

let dists: any[] = [];

const childCount = cpus().length || 4;

let win: any = null;

let lastDist: any = null;

function emit (data: any) {
  if (!win) return console.log('no win');

  win.webContents.send('copy:state-change', data)
}


customEvent.on('DistChange', (data: any) => {
  dists = data;
});

function getChildOptions () {
  const isProd: boolean = process.env.NODE_ENV === 'production';
  const childPath: string = resolve(__dirname, `copy.${isProd ? 'js' : 'ts'}`);
  const childOptions: { execArgv?: any } =  isProd ? {} : {
    // 开发环境使用ts node接续子进程
    execArgv: ['.\\node_modules\\ts-node\\dist\\bin.js']
  };

  return { childPath, childOptions };
}

function updateChilds(path: string) {
  childs = childs.filter(ele => !ele.__end__);
  
  if (childs.length < childCount) {
    const index = dists.findIndex(ele => ele.name === lastDist);
    if (index === -1) return;

    const next: string = dists[index+1];
    if (next) {
      if (config.ignoreDist.includes(next)) {
        lastDist = next;
        updateChilds(path);
      } else {
        startCopy(path, dists[index+1])
      }
    }
  }
}

function startCopy(path: any, dist: any) {
  console.log('startCopy', path, dist)
  if (!dist) return;

  dist = dist.name;

  lastDist = dist;

  emit({ type: 'start', dist });

  const { childPath, childOptions } = getChildOptions();
  const child: any = fork(childPath, [path, `${dist}:\/`], childOptions);
  child.on('message', ({ action }: { action: any }) => {
    if (action === 'success') {
      emit({ type: 'success', dist });
      console.log('copy success ', dist);
    } else if (action === 'fail') {
      console.log('copy fail ', dist);
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
  if (existsSync(path)) {
    if (config.targetPath !== path) config.update('targetPath', path);
    let i = 0;
    while(childs.length < childCount && dists[i]) {
      if (!config.ignoreDist.includes(dists[i])) {
        startCopy(path, dists[i]);
      }
      i++;
    }
    return { message: '开始复制' }
  } else {
    console.log('目标目录不存在', path);
    return { message: '目标目录不存在' }
  }
}

const onStateChange = (_event: IpcMainInvokeEvent, dist: string) => {
  const list = config.ignoreDist;
  if (list.includes(dist)) {
    config.update('ignoreDist', list.filter(ele => ele !== dist));
  } else {
    config.update('ignoreDist', [...list, dist]);
  }

  messageToWeb.send({ key: 'dist:change', data: getExistDist() });
}

export const initCopyEvents = (_win: any) => {
  if (!dists.length) dists = getExistDist();
  ipcMain.handle('copy:start', copy);
  ipcMain.handle('dist:stateChange', onStateChange);
  win = _win;
}
