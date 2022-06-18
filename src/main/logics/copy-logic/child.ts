import fs from 'fs-extra';
import { DistStateEnmu } from '../../../common/interface';

const exit = () => process.exit();

const send = (data: any): void => {
  if (typeof process.send === 'function') process.send(data);
}

const copy = (target: string, dir: string) => {
  fs.copy(target, dir).then(() => {
    send({ state: DistStateEnmu.Success });
    exit();
  }).catch((err: any) => {
    console.log(err, 'copy error')
    send({ state: DistStateEnmu.Fail });
    exit();
  })
}

const [ , , target, dir] = process.argv;

copy(target, dir);

