import React from 'react';
import './index.css'

interface Props {
  name: string;
  children: any;
  cls?: string;
};

const MainContainer = ({ name, children, cls }: Props) => {
  return (
    <div className={`main-container${cls ? ` ${cls}` : ''}`}>
      <div className='main-container_name'>{ name }</div>
      { children || null }
    </div>
  )
}

export default MainContainer;