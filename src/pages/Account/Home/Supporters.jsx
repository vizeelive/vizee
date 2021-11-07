import React from 'react';
import BuyButton from 'components/Event/BuyButton';
import Pricing from 'pages/Account/Home/Pricing';

export default function Supporters({ account, user }) {
  return (
    <div className="md:mt-11 rounded-lg md:w-80 border-1 p-5">
      <div className="text-center content-center">
        <div className="mb-5">Can we please get your support? ❤️</div>
        <BuyButton isTip={true} user={user} account={account} />
      </div>
      {account.supporters_report.map((user, index) => (
        <Card className="mt-3" key={index}>
          <img
            src={
              index <= 2
                ? `/icons/medal-${index + 1}.png`
                : `/icons/medal-4.png`
            }
            width="40"
            className="float-left mr-2"
          />
          <div className="text-l">
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : 'Anonymous'}{' '}
          </div>
        </Card>
      ))}
    </div>
  );
}
