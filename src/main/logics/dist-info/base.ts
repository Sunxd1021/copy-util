
import { DistInfoInterface, DistStateEnmu } from '../../../common/interface';
import config from '../../config';
import { computeDistName, isDistExist } from './uitls';
import messageToWeb from './../../message-to-web';

class BaseDist {
  private distInfo: DistInfoInterface[];

  constructor() {
    this.distInfo = [];
    this.initDistInfo();
  }

  private initDistInfo = () => {
    const names = computeDistName();

    this.distInfo = names.map(name => ({
      name,
      ignore: config.ignoreDist.includes(name),
      state: isDistExist(name),
    }));
  }

  private sendToWeb = () => messageToWeb.send({ key: 'dist:change', data: this.distInfo });

  protected checkExistState = (attach: boolean) => {
    let changed = false;
    console.log('check state ', attach)

    for(const value of this.distInfo) {
      const { name, state } = value;

      const _state = isDistExist(name);
      const { Unexist, Unstart } = DistStateEnmu;
      // u盘插入 上一次状态是 未插入 当前状态是 已插入
      const at = attach && state === Unexist && _state === Unstart;
      // u盘拔出 上一次状态是 已插入 当前状态是 未插入
      const de = !attach && state !== Unexist && _state === Unexist;

      if (at || de) {
        value.state = _state;
        changed = true;
        break;
      }
    }

    if (changed) this.sendToWeb();
  }

  protected updateDistInfo = (name: string, key: string, value: any) => {
    const target: DistInfoInterface | undefined = this.distInfo.find(ele => ele.name === name);

    if (target) {
      if (target[key] === value) return;
      target[key] = value;
      // 通知web发生变化
      this.sendToWeb();
    } else {
      return console.log('no target dist ', name);
    }
  }

  getDistInfo = () => this.distInfo;
}

export default BaseDist;