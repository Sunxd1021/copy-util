const fs = require('fs-extra');

const exit = () => process.exit();

// const send = (data: any) => {
//   if (typeof process.send === 'function') process.send(data);
// }
let send: (data: any) => void

send = data => {
  if (typeof process.send === 'function') process.send(data);
}

const copy = (target: string, dir: string) => {
  console.log(target, dir)
  fs.copy(target, dir).then(() => {
    send({ action: 'success' });
    exit();
  }).catch((err: any) => {
    console.log(err, 'copy error')
    send({ action: 'fail' });
    exit();
  })
}

const [ , , ...reset] = process.argv;

copy(reset[0], reset[1]);

