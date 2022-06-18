
class CustomEvent {
  private lisener: any;
  constructor() {
    this.lisener = {};
  }

  on = (key: string, cb: (data: any) => void) => {
    if (!this.lisener[key]) this.lisener[key] = [];

    this.lisener[key].push(cb);
  }

  emit = (key: string, data: any) => {
    const l = this.lisener[key];

    if (Array.isArray(l)) {
      l.forEach(fn => fn(data));
    }
  }

  toast = (data: any) => {
    this.emit('toast', data);
  }
}

export default new CustomEvent;