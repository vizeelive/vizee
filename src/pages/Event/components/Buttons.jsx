import React from 'react';
import BuyButton from 'components/Event/BuyButton';
import ShareButton from 'components/Event/ShareButton';
import FollowButton from 'components/Event/FollowButton';
import { Link } from 'react-router-dom';
import Button from 'components/ui/Button';
import StartStreamButton from 'components/Event/StartStreamButton';

function Buttons({ account, event, user, isMyAccount }) {
  return (
    <div className="mx-3 xs:mt-5 sm:mx-0 md:mx-7 lg:mx-0 sm:mt-0 md:space-x-3 space-y-3">
      {!user?.isAdmin &&
        !isMyAccount &&
        event.account.stripe_data &&
        !event.isFree() &&
        !event.isPurchased() &&
        !event.hasEnded() && (
          <BuyButton
            classes="md:inline w-full md:w-auto"
            user={user}
            event={event}
          />
        )}

      {event.master ? (
        <div className="md:inline mr-3 lg:mr-0 lg:ml-3">
          <a
            type="button"
            className="w-full md:w-auto inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm lg:text-base font-medium text-gray-300 bg-black hover:bg-white-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
            href={event.master}
            download
          >
            Download
          </a>
        </div>
      ) : null}

      {event.account.stripe_data && (
        <BuyButton
          classes="md:inline w-full md:w-auto"
          isTip={true}
          account={event.account}
          user={user}
          event={event}
        />
      )}

      {/* {user && (
          <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
            <RedeemCode event_id={event.id} user_id={user.id} />
          </span>
        )} */}

      {user && !user.isAdmin && !isMyAccount && (
        <span className="md:inline mr-3 mb-3 lg:mr-0 lg:ml-3">
          <FollowButton
            account_id={event.account.id}
            follower_id={account?.followers?.[0]?.id}
          />
        </span>
      )}

      {/* {user && !user.isAdmin && !isMyAccount && (
          <SubscribeButton />
        )} */}

      {(user?.isAdmin || isMyAccount) && event.isBroadcast() && (
        <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
          <StartStreamButton event_id={event.id} />
        </span>
      )}

      <ShareButton
        className="w-full md:w-auto"
        url={`${origin}/${event.account.username}/${event.id}`}
        user={user}
      />

      {(user?.isAdmin || isMyAccount) && (
        <div className="md:inline w-full md:w-auto">
          <Link to={`/${event.account.username}/manage/events/${event.id}`}>
            <Button classes="w-full md:w-auto">Manage</Button>
          </Link>
        </div>
      )}

      {(user?.isAdmin || isMyAccount) && (
        <div className="md:inline w-full md:w-auto">
          <Link
            to={`/${event.account.username}/manage/events/edit/${event.id}`}
          >
            <Button classes="w-full md:w-auto">Edit</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Buttons;
