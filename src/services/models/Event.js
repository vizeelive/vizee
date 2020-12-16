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
    return !!this?.access?.length || !!this?.account?.access?.length;
  }
  isConference() {
    return this?.type === 'conference';
  }
  hasStarted() {
    return moment().isAfter(this.start);
  }
  hasEnded() {
    return moment().isAfter(this.end);
  }
  belongsTo(user) {
    return user?.isAdmin || !!this?.account?.users?.find((u) => u?.user?.id === user.id)
  }
  canWatch(user, liveEvent) {
    let canWatch;
    if (this.type === 'video') {
      canWatch =
        this.belongsTo(user) ||
        (this.isLive() && (this.isFree() || this.isPurchased()));
    } else {
      canWatch =
        (liveEvent?.status !== 'idle' && this.belongsTo(user)) ||
        this.isFree() ||
        this.isPurchased();
    }
    return !!canWatch;
  }
}
