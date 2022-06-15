import React from 'react';
import MainContainer from '../../components/container';
import DistInfo from '../../components/card';
import './index.css';

const DistInfoList = ({ distInfos }) => {
  return (
    <MainContainer name='磁盘信息' cls='dist-container'>
      {distInfos.map(ele => {
        return <DistInfo {...ele} key={ele.name} />
      })}
    </MainContainer>
  )
}

export default DistInfoList;