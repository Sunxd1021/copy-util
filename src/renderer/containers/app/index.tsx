import React, { useState, useRef, useEffect } from "react";

import DistInfoList from "../dist-list";
import TargetFileInfo from "../target-info";
import ActionInfo from "../action-info";
import { DistInfoInterface } from "common/interface";

import './index.css';

const App = () => {
  const [distInfos, setDistInfos] = useState<Array<DistInfoInterface>>([]);

  const path = useRef('');

  const onStartopy = () => {
    window.electron.startCopy(path.current);
  }

  const onPathChange = (_path: string) => {
    path.current = _path;
  }

  useEffect(() => {
    const { electron } = window;
    electron.onDistChange((_, data) => setDistInfos(data));
    electron.onCopyStateChange((_, data) => {
      const { dist, type } = data;
      setDistInfos(state => {
        const target = state.find(ele => ele.name === dist);
        if (target) {
          target.state = type;
          return [...state];
        } else {
          return state;
        }
      })
    });

    electron.getInitDist().then(setDistInfos);
    // electron.getInitDist();
  }, []);

  return (
    <div className="app">
      <DistInfoList distInfos={distInfos} />
      <div className="footer">
        <TargetFileInfo onPathChange = {onPathChange} />
        <ActionInfo onStartCopy = { onStartopy } />
      </div>
    </div>
  )
}

export default App