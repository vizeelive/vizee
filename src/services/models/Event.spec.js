import Event from './Event';

// 2015-06-14T22:12:05.275Z
const MockDate = require('mockdate');
MockDate.set(1434319925275);

describe('Event', () => {
  describe('isBroadcast', () => {
    it('should return true when type is `live`', () => {
      let data = {
        type: 'live'
      };
      let event = new Event(data);
      expect(event.isBroadcast()).toBe(true);
    });
  });
  describe('isVideo', () => {
    it('should return true when type is `video`', () => {
      let data = {
        type: 'video'
      };
      let event = new Event(data);
      expect(event.isVideo()).toBe(true);
    });
  });
  describe('isFree', () => {
    it('should return true when price is $0.00', () => {
      let data = {
        price: '$0.00'
      };
      let event = new Event(data);
      expect(event.isFree()).toBe(true);
    });
  });
  describe('isPurchased', () => {
    it('should return true when there is access for the user', () => {
      let data = {
        access: [{}],
        account: {
          access: [{}]
        }
      };
      let event = new Event(data);
      expect(event.isPurchased()).toBe(true);
    });
  });
  describe('isConference', () => {
    it('should return true when type is `conference`', () => {
      let data = {
        type: 'conference'
      };
      let event = new Event(data);
      expect(event.isConference()).toBe(true);
    });
  });
  describe('belongsTo', () => {
    it('should return true when user manages the account the event belongs to', () => {
      let data = {
        account: {
          users: [
            {
              user: {
                id: 'auth0|5f8838b47119bc007640b4af'
              }
            }
          ]
        }
      };
      let user = { id: 'auth0|5f8838b47119bc007640b4af' };
      let event = new Event(data);
      expect(event.belongsTo(user)).toBe(true);
    });
  });
  describe('canWatch', () => {
    it('should return true when is video and user manages the event', () => {
      let data = {
        type: 'video',
        account: {
          users: [
            {
              user: {
                id: 'auth0|5f8838b47119bc007640b4af'
              }
            }
          ]
        }
      };
      let user = { id: 'auth0|5f8838b47119bc007640b4af' };
      let event = new Event(data);
      expect(event.canWatch(user)).toBe(true);
    });
    it('should return true when is video and its live and its free', () => {
      let data = {
        type: 'video',
        price: '$0.00',
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user_id = 'auth0|5f8838b47119bc007640b4af';
      let event = new Event(data);
      expect(event.canWatch(user_id)).toBe(true);
    });
    it('should return true when its broadcast and belongs to user', () => {
      let data = {
        type: 'video',
        price: '$0.00',
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user_id = 'auth0|5f8838b47119bc007640b4af';
      let event = new Event(data);
      let liveData = { status: 'completed' };
      expect(event.canWatch(user_id, liveData)).toBe(true);
    });
    it('should return true when its broadcast and is free', () => {
      let data = {
        type: 'broadcast',
        price: '$0.00',
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user_id = 'auth0|5f8838b47119bc007640b4af';
      let event = new Event(data);
      let liveData = { status: 'completed' };
      expect(event.canWatch(user_id, liveData)).toBe(true);
    });
    it('should return true when its broadcast and is live and is purchased', () => {
      let data = {
        type: 'broadcast',
        price: '$1.00',
        access: [{}],
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user = { id: 'auth0|5f8838b47119bc007640b4af' };
      let event = new Event(data);
      let liveData = { status: 'completed' };
      expect(event.canWatch(user, liveData)).toBe(true);
    });
    it('should return true when its broadcast and is purchased', () => {
      let data = {
        type: 'video',
        price: '$1.00',
        start: '2020-10-22 21:38:41.825+00',
        end: '2020-10-22 21:48:41.825+00',
        access: [{}],
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user = { id: 'auth0|5f8838b47119bc007640b4af' };
      let event = new Event(data);
      expect(event.canWatch(user)).toBe(true);
    });
    it('should return false when its broadcast and is not purchased', () => {
      let data = {
        type: 'video',
        price: '$1.00',
        start: '2020-10-22 21:38:41.825+00',
        end: '2020-10-22 21:48:41.825+00',
        access: null,
        account: {
          users: [
            {
              user: {
                id: 'auth0|nope'
              }
            }
          ]
        }
      };
      let user_id = 'auth0|5f8838b47119bc007640b4af';
      let event = new Event(data);
      expect(event.canWatch(user_id)).toBe(false);
    });
  });
});
