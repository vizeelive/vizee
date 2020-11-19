import moment from 'moment';

export default class Event {
  constructor(data) {
    Object.assign(this, data);
  }
  isBroadcast() {
    return this?.type === 'live';
  }
  isVideo() {
    return this?.type === 'video';
  }
  isFree() {
    return this?.price === '$0.00';
  }
  isLive() {
    return moment().isBetween(this.start, this.end);
  }
  isPurchased() {
    return !!this?.transaction?.length;
  }
  isConference() {
    return this?.type === 'conference';
  }
  belongsTo(user_id) {
    return !!this?.account?.users?.find((user) => user?.user?.id === user_id);
  }
  canWatch(user_id, liveEvent) {
    let canWatch;
    if (this.type === 'video') {
      canWatch =
        this.belongsTo(user_id) ||
        (this.isLive() && (this.isFree() || this.isPurchased()));
    } else {
      canWatch =
        (liveEvent?.status !== 'idle' && this.belongsTo(user_id)) ||
        this.isFree() ||
        this.isPurchased();
    }
    return !!canWatch;
  }
}
