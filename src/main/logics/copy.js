const fs = require('fs-extra');

const exit = () => process.exit();

const send = data => process.send(data);

const copy = (target, dir) => {
  fs.copy(target, dir).then(() => {
    send({ action: 'success' });
    exit();
  }).catch((err) => {
    send({ action: 'fail' });
    exit();
  })
}

const [ , , ...reset] = process.argv;

copy(...reset);
