import React, { useState } from 'react';
import logger from 'logger';
import config from '../../config';
import { useParams } from 'react-router-dom';
import { Button, Select, message } from 'antd';

import { gql, useQuery } from '@apollo/client';

import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

const GET_ACCOUNT = gql`
  query GetAccount($id: uuid!, $username: String!) {
    accounts_by_pk(id: $id) {
      stripe_data
      stripe_id
      id
    }
    getStripeUrl(username: $username) {
      url
    }
  }
`;

export default function StripeAccount(props) {
  let { id, username, status } = useParams();
  const [creating, setCreating] = useState(false);
  const [country, setCountry] = useState(null);

  id = props.id || id;
  username = props.username || username;

  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id, username }
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const account = data?.accounts_by_pk;
  const accountNotStarted = !account?.stripe_id;
  const accountNeedsFinish =
    account?.stripe_id && !account?.stripe_data?.details_submitted;
  const accountIsReady =
    account?.stripe_id && account?.stripe_data?.details_submitted;

  const handleStripeConnect = async () => {
    setCreating(true);
    logger.info('Running handleStripeConnect');
    try {
      let res = await fetch(
        `${config.api}/stripe/account/create?id=${id}&username=${username}&country=${country}`
      ).then((res) => res.json());
      window.mixpanel.track('Stripe Connect Started');
      window.location.replace(res.url);
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
      throw e;
    }
  };

  const handleStripeFinish = async () => {
    logger.info('Running handleStripeFinish');
    try {
      let res = await fetch(
        `${config.api}/stripe/account/create?account_id=${account.stripe_id}&username=${username}`
      ).then((res) => res.json());
      window.mixpanel.track('Stripe Connect Continued');
      window.location.replace(res.url);
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
      throw e;
    }
  };

  const handleStripeDashboard = () => {
    window.open(data.getStripeUrl.url);
  };

  if (status === 'refresh') {
    handleStripeConnect();
  }

  const countries = [
    {
      value: 'US',
      label: 'United States'
    },
    {
      value: 'AT',
      label: 'Austria'
    },
    {
      value: 'AR',
      label: 'Argentina'
    },
    {
      value: 'AU',
      label: 'Australia'
    },
    {
      value: 'BE',
      label: 'Belgium'
    },
    {
      value: 'BG',
      label: 'Bulgaria'
    },
    {
      value: 'BO',
      label: 'Bolivia'
    },
    {
      value: 'CA',
      label: 'Canada'
    },
    {
      value: 'CH',
      label: 'Switzerland'
    },
    {
      value: 'CL',
      label: 'Chile'
    },
    {
      value: 'CO',
      label: 'Colombia'
    },
    {
      value: 'CR',
      label: 'Costa Rica'
    },
    {
      value: 'CY',
      label: 'Cyprus'
    },
    {
      value: 'CZ',
      label: 'Czechia'
    },
    {
      value: 'DE',
      label: 'Germany'
    },
    {
      value: 'DK',
      label: 'Denmark'
    },
    {
      value: 'DO',
      label: 'Dominican Republic'
    },
    {
      value: 'EE',
      label: 'Estonia'
    },
    {
      value: 'EG',
      label: 'Egypt'
    },
    {
      value: 'ES',
      label: 'Spain'
    },
    {
      value: 'FI',
      label: 'Finland'
    },
    {
      value: 'FR',
      label: 'France'
    },
    {
      value: 'GB',
      label: 'Great Britain'
    },
    {
      value: 'GR',
      label: 'Greece'
    },
    {
      value: 'HK',
      label: 'Hong Kong'
    },
    {
      value: 'HR',
      label: 'Croatia'
    },
    {
      value: 'HU',
      label: 'Hungary'
    },
    {
      value: 'ID',
      label: 'Indonesia'
    },
    {
      value: 'IE',
      label: 'Ireland'
    },
    {
      value: 'IL',
      label: 'Israel'
    },
    {
      value: 'IS',
      label: 'Iceland'
    },
    {
      value: 'IT',
      label: 'Italy'
    },
    {
      value: 'LI',
      label: 'Liechtenstein'
    },
    {
      value: 'LT',
      label: 'Lithuania'
    },
    {
      value: 'LU',
      label: 'Luxembourg'
    },
    {
      value: 'LV',
      label: 'Latvia'
    },
    {
      value: 'MT',
      label: 'Malta'
    },
    {
      value: 'MX',
      label: 'Mexico'
    },
    {
      value: 'NL',
      label: 'Netherlands'
    },
    {
      value: 'NO',
      label: 'Norway'
    },
    {
      value: 'NZ',
      label: 'New Zealand'
    },
    {
      value: 'PE',
      label: 'Peru'
    },
    {
      value: 'PL',
      label: 'Poland'
    },
    {
      value: 'PT',
      label: 'Portugal'
    },
    {
      value: 'PY',
      label: 'Paraguay'
    },
    {
      value: 'RO',
      label: 'Romania'
    },
    {
      value: 'SE',
      label: 'Sweden'
    },
    {
      value: 'SG',
      label: 'Singapore'
    },
    {
      value: 'SI',
      label: 'Slovenia'
    },
    {
      value: 'SK',
      label: 'Slovakia'
    },
    {
      value: 'TH',
      label: 'Thailand'
    },
    {
      value: 'TT',
      label: 'Trinidad and Tobago'
    },
    {
      value: 'UY',
      label: 'Uruguay'
    }
  ];

  return (
    <React.Fragment>
      {accountNotStarted && (
        <div>
          <Select
            className="mr-3"
            options={countries.sort((a, b) => a.label.localeCompare(b.label))}
            style={{ width: 220 }}
            onChange={setCountry}
          />
          <Button
            onClick={handleStripeConnect}
            type="primary"
            loading={creating}
            disabled={!country}
          >
            Connect to Stripe
          </Button>
        </div>
      )}
      {accountNeedsFinish && (
        <Button onClick={handleStripeFinish} type="primary">
          Connect to Stripe
        </Button>
      )}
      {accountIsReady && (
        <Button onClick={handleStripeDashboard} type="secondary">
          View Stripe Dashboard
        </Button>
      )}
    </React.Fragment>
  );
}
