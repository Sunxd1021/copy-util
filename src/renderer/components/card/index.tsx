import React, { useMemo } from 'react';
import Button from '../button';

import './index.css';

const map: Record<string, string> = {
  start: '复制中',
  success: '复制完成',
  fail: '复制失败'
};

const DistInfo = (props: { state: string; name: string }) => {
  const process = useMemo(() => {
    
    console.log('state', props.state);
    const state: string = props.state;
    return map[state] || '未开始';
  }, [props.state]);

  return (
    <div className='dist-info'>
      <div className='dist_avatar'>
        <i className='icon iconfont icon-cipan' />
        <span className='dist_name'>磁盘{props.name}</span>
      </div>
      <div>复制进度：{process}</div>
      <Button txt='忽略该磁盘' size='small' onClick={() => {}} />
    </div>
  );
}

export default DistInfo