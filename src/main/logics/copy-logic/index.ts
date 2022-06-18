import { ipcMain } from "electron";
import { fork, ChildProcess } from "child_process";
import { cpus } from "os";
import config from '../../config';
import distInfo from "../dist-info";
import { DistStateEnmu, DistInfoInterface } from '../../../common/interface';
import { ChildProcessPath, ChildProcessOption } from "./options";
import { usb } from 'usb';

interface CustomChildProcess extends ChildProcess {
  __end__?: boolean;
}

class CopyFileLogic { 
  private childs: CustomChildProcess [];
  private readonly cpus: number;
  private copying: boolean;

  constructor() {
    this.childs = [];
    this.cpus = cpus().length || 4;
    this.copying = false;
    this.init();
  }

  private chechIsFinish = (): boolean => {
    const { Success, Fail } = DistStateEnmu;
    const dist = distInfo.getDistInfo().find(({ ignore, state }) => {
      // 没有被忽略且状态不是成功或失败 说明还在复制中
      return !ignore && ![Success, Fail].includes(state);
    });

    return !dist;
  }

  init = () => {
    ipcMain.handle('copy:start', this.startCopy);
    ipcMain.handle('dist:stateChange', this.ignoreStateChange);
    ipcMain.handle('dist:init', () => distInfo.getDistInfo());

    usb.on('detach', distInfo.onDistDetach);
    usb.on('attach', distInfo.onDistAttach);
  }

  ignoreStateChange = () => {

  }

  startCopy = () => {
    if (this.copying) return;
    if(!config.targetPath) return;

    this.startMainProcess();
  }

  startMainProcess = () => {
    const dists = distInfo.getDistInfo();
    const { Unstart } = DistStateEnmu;

    for (const dist of dists) {
      // 如果当前队列已满则退出循环
      if (this.childs.length >= this.cpus) break

      const { ignore, state } = dist;

      // 如果当前磁盘没有忽略且未开始复制 则开启一个子进程
      if(!ignore && state === Unstart) this.startChildProcess(dist);
    }
  }

  startChildProcess = ({ name }: DistInfoInterface) => {
    const argv = [config.targetPath, `${name}:\/`];
    const child: CustomChildProcess = fork(ChildProcessPath, argv, ChildProcessOption);

    child.on('message', ({ state } : { state: DistStateEnmu }) => {
      distInfo.updateState(name, state)
    });

    const onEnd = () => {
      this.childs = this.childs.filter(ele => ele !== child);

      if (this.chechIsFinish()) {
        this.copying = false;
      } else {
        this.startMainProcess();
      }
    }

    child.on('exit', onEnd);
    child.on('close', onEnd);
    child.on('error', onEnd);
  }

  updateChilds = () => {
    this.childs = this.childs.filter(ele => !ele.__end__);
  }
}

export default new CopyFileLogic;