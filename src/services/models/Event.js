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
  isAvailable() {
    return moment().isBetween(this.start, this.end);
  }
  isLive() {
    return this.status === 'live';
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
  image() {
    return this?.photo || this?.account?.photo;
  }
  belongsTo(user) {
    return (
      user?.isAdmin ||
      !!this?.account?.users?.find((u) => u?.user?.id === user?.id)
    );
  }
  canWatch(user, liveEvent) {
    let canWatch;
    if (this.type === 'video') {
      canWatch =
        this.belongsTo(user) ||
        (this.isAvailable() && (this.isFree() || this.isPurchased()));
    } else {
      canWatch =
        (liveEvent?.status !== 'idle' && this.belongsTo(user)) ||
        (this.isAvailable() && (this.isFree() || this.isPurchased()));
    }
    return !!canWatch;
  }
}
