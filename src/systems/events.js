export class EventBus {
  constructor() {
    this.handlers = new Map();
  }
  on(name, handler) {
    if (!this.handlers.has(name)) this.handlers.set(name, []);
    this.handlers.get(name).push(handler);
  }
  emit(name, detail) {
    const list = this.handlers.get(name) || [];
    for (const fn of list) {
      try { fn(detail); } catch (e) { console.error('EventBus handler error', e); }
    }
  }
}

export const bus = new EventBus();
