export default class Event {
  constructor(data) {
    this.data = data;
  }
  isBroadcast() {
    return this.type === 'live';
  }
}
