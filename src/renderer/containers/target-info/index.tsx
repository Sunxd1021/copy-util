import React, { useState, useEffect } from 'react';
import MainContainer from '../../components/container';
import Button from '../../components/button';
import event from '../../custom-event';

import './index.css';

const txt = '尚未输入要复制的文件夹的路径';

const TargetFileInfo = ({ onPathChange }: { onPathChange: (value: any) => void }) => {
  const [path, setPath] = useState('');
  const [modify, setModify] = useState(false);

  const onButtonClick = () => {
    if (modify) {
      if (!path) return event.toast('请输入路径'); 
      window.electron.updateTargetPath(path).then(res => {
        const { message, result } = res;
        if (result) setModify(false);
        if(message) event.toast(message);
      }).catch(() => {
        event.toast('设置失败');
      })
    } else {
      setModify(true)
    }
  }

  const onChange = (e: any) => {
    const { value } = e.target;
    setPath(value);
    onPathChange(value);
  }

  useEffect(() => {
    const path = window.electron.getTargetPath();
    if (path) {
      setPath(path);
      onPathChange(path);
    }
  }, []);

  return (
    <MainContainer name='目标文件信息'>
      <div className='target-path'>
        文件路径：
        { modify ? <input type='text' value={path} placeholder={txt} onChange={onChange} /> : <span>{path || txt}</span> }
      </div>

      <Button txt={modify ? '保存路径' : '修改路径'} onClick={onButtonClick} size='normal' />
    </MainContainer>
  )
}

export default TargetFileInfo;