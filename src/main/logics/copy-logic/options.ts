import { resolve } from "path";

const isProd: boolean = process.env.NODE_ENV === 'production';

export const ChildProcessPath: string = resolve(__dirname, `child.${isProd ? 'js' : 'ts'}`);

export const ChildProcessOption: { execArgv?: string[] } = isProd ? {} : { execArgv: ['.\\node_modules\\ts-node\\dist\\bin.js'] }