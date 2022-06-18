export type DistState = 'unstart' | 'fail' | 'success' | 'copying';

export interface DistInfo {
  name: string;
  ignore: boolean;
  state: DistState;
}