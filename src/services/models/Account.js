export default class Account {
  constructor(data) {
    Object.assign(this, data);
  }
  canSell() {
    return !!this.stripe_id;
  }
}
