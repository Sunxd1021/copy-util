import React from 'react';
import MainContainer from '../../components/container';
import DistInfo from '../../components/card';
import './index.css';

const DistInfoList = ({ distInfos }: { distInfos: any }) => {
  return (
    <MainContainer name='磁盘信息' cls='dist-container'>
      {distInfos.map((ele: any) => {
        return <DistInfo {...ele} key={ele.name} onIgnore={window.electron.toggleDistState} />
      })}
    </MainContainer>
  )
}

export default DistInfoList;