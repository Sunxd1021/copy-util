import React from 'react';
import './index.css';

const sizeList: string [] = ['normal', 'small'];

interface Props {
  size: string;
  txt: string;
  onClick: () => void;
}

const Button = ({ size, txt, onClick = () => {} }: Props) => {
  const _size = sizeList.includes(size) ? size : sizeList[0];

  return (
    <div className={`custom-button custom-button_${_size}`} onClick={onClick}>
      {txt}
    </div>
  )
}

export default Button;