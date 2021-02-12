import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

const GET_UMAMI_TOKEN = gql`
  query GetUmamiToken($account_id: uuid!) {
    getUmamiToken(account_id: $account_id) {
      accessToken
    }
  }
`;

export default function Traffic() {
  const { id } = useParams();
  const [ready, setReady] = useState(false);
  const { loading, error, data } = useQuery(GET_UMAMI_TOKEN, {
    variables: { account_id: id }
  });

  useEffect(() => {
    if (data) {
      let token = data.getUmamiToken.accessToken;
      // this is silly. it gets around CORS by fetching an image with a url to set the cookie
      let element = document.createElement('img');
      element.src = `https://umami.vizee.live/api/auth/login?token=${token}`;
      setReady(true);
    }
  }, [data]);

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  return (
    <React.Fragment>
      {ready && (
        <iframe
          style={{
            height: 'calc(100vh - 184px)',
            minHeight: '640px'
          }}
          title="analytics"
          src={`https://umami.vizee.live`}
          frameBorder="0"
          width="100%"
          height="100%"
          referrerPolicy="origin"
        />
      )}
    </React.Fragment>
  );
}
