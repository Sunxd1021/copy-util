import { DistStateEnmu } from '../../../common/interface';
import Base from './base';
import config from './../../config';

class DistInfo extends Base {
  // usb 插入回调
  onDistAttach = () => this.checkExistState(true);

  // usb 拔出回调
  onDistDetach = () => this.checkExistState(false);

  // 更新磁盘state状态
  updateState = (name: string, state: DistStateEnmu) => {
    this.updateDistInfo(name, 'state', state);
  }

  onIgnoreStateChange = (_: any, name: string) => {
    const result = config.toggle(name);
    config.update();
    this.updateDistInfo(name, 'ignore', result === 1)
  }
}

export default new DistInfo;