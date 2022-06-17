import React, { useState, useRef, useEffect } from "react";

import DistInfoList from "../dist-list";
import TargetFileInfo from "../target-info";
import ActionInfo from "../action-info";

import './index.css';

interface Dist {
  name: string;
  state: string;
}

const App = () => {
  const [distInfos, setDistInfos] = useState<Array<Dist>>([]);

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
  }, []);

  return (
    <div className="app">
      <DistInfoList distInfos={distInfos} />
      <TargetFileInfo onPathChange = {onPathChange} />
      <ActionInfo onStartCopy = { onStartopy } />
    </div>
  )
}

export default App