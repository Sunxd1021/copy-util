import React, { useCallback, useMemo } from 'react';
import Button from '../button';
import { DistStateEnmu } from 'common/interface';

import './index.css';

const map: Record<DistStateEnmu, string> = {
  [DistStateEnmu.Unstart]: '未开始',
  [DistStateEnmu.Copying]: '复制中',
  [DistStateEnmu.Success]: '复制成功',
  [DistStateEnmu.Fail]: '复制失败',
  [DistStateEnmu.Unexist]: '未插入',
  [DistStateEnmu.CopyError]: '发生错误',
};

interface PropsInterface {
  state: DistStateEnmu;
  name: string;
  ignore: boolean;
  onIgnore: (name: string) => void;
}

const DistInfo = ({ name, state, ignore, onIgnore }: PropsInterface) => {
  const process = useMemo(() => {
    return map[state] || '未知状态';
  }, [state]);

  const _onIgnore = useCallback(() => {
    onIgnore(name);
  }, [name]);

  return (
    <div className={`dist-info${ignore ? ' ignore' : ''}`}>
      <div className='dist_avatar'>
        <i className='icon iconfont icon-cipan' />
        <span className='dist_name'>磁盘{name}</span>
      </div>
      <div>复制进度：{process}</div>
      <Button txt={ ignore ? '取消忽略' : '忽略磁盘' } size='small' onClick={_onIgnore} />
    </div>
  );
}

export default DistInfo