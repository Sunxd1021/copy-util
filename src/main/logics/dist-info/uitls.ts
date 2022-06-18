import { existsSync } from 'fs-extra';
import { DistStateEnmu } from '../../../common/interface';

export const computeDistName = () => {
  const list: string[] = [];
  let c: number = 67;
  const z: number = 90

  while(c <= z) {
    list.push(String.fromCodePoint(c));
    c++
  }

  return list;
}

export const isDistExist = (name: string) => {
  const { Unexist, Unstart } = DistStateEnmu;
  return existsSync(`${name}:\/`) ? Unstart : Unexist
}