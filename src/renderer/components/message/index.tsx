import React, { useCallback, useEffect, useState } from "react";
import event from '../../custom-event';
import './index.css';
import Button from "../button";

const Message = () => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    event.on('toast', (msg) => {
      if (typeof msg === 'string' && msg) setMsg(msg)
    });
  }, []);

  const onClick = useCallback(() => {
    setMsg('');
  }, []);

  if (!msg) return null;
  return (
    <div className="modal">
      <div className="box">
        <div className="title">{msg}</div>
        <Button txt="知道了" onClick={onClick} size='normal' />
      </div>
    </div>
  )
}

export default Message;