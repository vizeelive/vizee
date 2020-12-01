import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

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
      element.src = `https://vizee-umami.herokuapp.com/api/auth/login?token=${token}`;
      setReady(true);
    }
  }, [data]);

  if (loading) return 'Loading...';

  if (error) return 'Error.';

  return (
    <React.Fragment>
      {ready && (
        <iframe
          title="analytics"
          src={`https://vizee-umami.herokuapp.com`}
          frameBorder="0"
          width="100%"
          height="100%"
          refererpolicy="origin"
        ></iframe>
      )}
    </React.Fragment>
  );
}
