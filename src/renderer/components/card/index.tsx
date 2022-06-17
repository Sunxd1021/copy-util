import React, { useCallback, useMemo } from 'react';
import Button from '../button';

import './index.css';

const map: Record<string, string> = {
  start: '复制中',
  success: '复制完成',
  fail: '复制失败'
};

interface PropsInterface {
  state: string;
  name: string;
  ignore: boolean;
  onIgnore: (name: string) => void;
}

const DistInfo = (props: PropsInterface) => {
  const process = useMemo(() => {
    
    console.log('state', props.state);
    const state: string = props.state;
    return map[state] || '未开始';
  }, [props.state]);

  const _onIgnore = useCallback(() => {
    props.onIgnore(props.name);
  }, [props.name]);

  return (
    <div className='dist-info'>
      <div className='dist_avatar'>
        <i className='icon iconfont icon-cipan' />
        <span className='dist_name'>磁盘{props.name}</span>
      </div>
      <div>复制进度：{process}</div>
      <Button txt={ props.ignore ? '取消忽略' : '忽略磁盘' } size='small' onClick={_onIgnore} />
    </div>
  );
}

export default DistInfo