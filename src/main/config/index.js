const { writeFile } = require('fs');
const { join } = require('path');

class Config {
  constructor() {
    this.data = require('./config.json');
    this.writing = false;
    this.hasCache = false;
    this.targetPath = undefined;
    this.ignoreDist = []
  }

  update = (key, value) => {
    if (key) this.data[key] = value;

    if (this.writing) {
      this.hasCache = true;
      return;
    }
    this.writing = true;

    writeFile(join(__dirname, 'config.json'), JSON.stringify(this.data, null, 2), (err) => {
      if (err) console.log(err, 'write file');
      this.writing = false;
      if (this.hasCache) {
        this.hasCache = false;
        this.update();
      }
    });
  }

  toggle = (name) => {
    const { ignoreDist } = this.data;
    if (ignoreDist.includes(name)) {
      this.data.ignoreDist = ignoreDist.filter(ele => ele !== name);
      return -1;
    } else {
      ignoreDist.push(name);
      return 1;
    }
  }
}

const config = new Proxy(new Config, {
  get(target, key) {
    if (key === 'update') {
      return target.update
    } else if (key === 'toggle') {
      return target.toggle;
    } else {
      return target.data[key];
    }
  }
})

module.exports = config;