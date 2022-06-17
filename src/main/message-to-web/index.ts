import { BrowserWindow } from 'electron';

interface ParmasInterface {
  key: string;
  data?: any;
}

class CustomMessageChannel {
  window: BrowserWindow | null = null

  constructor() {
    this.window = null;
  }

  init = (window: BrowserWindow) => {
    this.window = window;
  }

  send = ({ key, data }: ParmasInterface) => {
    if (this.window) this.window.webContents.send(key, data);
  }
}

export default new CustomMessageChannel;