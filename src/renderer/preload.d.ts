import { Channels } from 'main/preload';

interface PromiseInterface {
  <T = any>(): Promise<T>
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        // on(
        //   channel: string,
        //   func: (...args: unknown[]) => void
        // ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      getTargetPath: () => string;
      startCopy: (path: string) => void;
      onDistChange: (fn: (event: any, data: any) => void) => void;
      onCopyStateChange: (fn: (event: any, data: any) => void) => void;
      getInitDist: PromiseInterface
    };
  }
}

export {};
