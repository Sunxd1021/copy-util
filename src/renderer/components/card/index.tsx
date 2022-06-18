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

const cls: Record<DistStateEnmu, string> = {
  [DistStateEnmu.Unstart]: '#c1bedb',
  [DistStateEnmu.Copying]: '#8c8f5e',
  [DistStateEnmu.Success]: '#52db41',
  [DistStateEnmu.Fail]: '#e57221',
  [DistStateEnmu.Unexist]: '#e57221',
  [DistStateEnmu.CopyError]: '#e57221',
}

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

  const style = useMemo(() => {
    let s = '';

    if (ignore) s += ` ignore`;
    if (state === DistStateEnmu.Unexist) s += ' unexist';

    return s;
  }, [ignore, state]);

  const txtStyle = useMemo(() => {
    const color = cls[state];

    return color ? { color } : {};
  }, [state]);

  return (
    <div className={`dist-info${style}`}>
      <div className='dist_avatar'>
        <i className='icon iconfont icon-cipan' />
        <span className='dist_name'>磁盘{name}</span>
      </div>
      <div>状态：<span style={txtStyle}>{process}</span></div>
      <Button txt={ ignore ? '取消忽略' : '忽略磁盘' } size='small' onClick={_onIgnore} />
    </div>
  );
}

export default DistInfo