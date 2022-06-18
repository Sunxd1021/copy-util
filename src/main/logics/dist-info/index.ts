import { DistStateEnmu } from '../../../common/interface';
import Base from './base';

class DistInfo extends Base {
  // usb 插入回调
  onDistAttach = () => this.checkExistState(true);

  // usb 拔出回调
  onDistDetach = () => this.checkExistState(false);

  // 更新磁盘state状态
  updateState = (name: string, state: DistStateEnmu) => {
    this.updateDistInfo(name, 'state', state);
  }
}

export default new DistInfo;