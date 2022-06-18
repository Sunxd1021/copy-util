export enum DistStateEnmu {
  Unstart,
  Fail,
  Success,
  Copying,
  Unexist,
  CopyError,
}

export interface DistInfoInterface {
  [key: string]: string | boolean | DistStateEnmu;
  name: string;
  ignore: boolean;
  state: DistStateEnmu;
}
