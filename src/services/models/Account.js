export default class Account {
  constructor(data) {
    Object.assign(this, data);
  }
  canSell() {
    return !!this.stripe_id;
  }
  belongsTo(user) {
    return user?.isAdmin || !!this.users?.find((u) => u?.user?.id === user?.id);
  }
  cover() {
    let name = this.name.split('@').shift();
    return (
      this?.photo ||
      `https://ogi.sh/gzzIXzt5-?title=**${name}**&imageUrl=https://source.unsplash.com/featured?nature`
      // `https://ogi.sh/gzzIXzt5-?title=**${this.name}**&imageUrl=https://source.unsplash.com/random`
      // `https://dummyimage.com/1216x684/000/fff.png&text=${this.name}`
    );
  }
}
