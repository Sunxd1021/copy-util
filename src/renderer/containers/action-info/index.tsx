import React from 'react';
import MainContainer from '../../components/container';
import Button from '../../components/button';
import './index.css';

const ActionInfo = ({ onStartCopy }: { onStartCopy: () => void }) => {
  return (
    <MainContainer  name='操作' cls='action-container'>
      <Button txt='开始拷贝' onClick={onStartCopy} size='normal' />
      <Button txt='取消拷贝' onClick={() => {}} size='normal' />
    </MainContainer>
  )
}

export default ActionInfo;