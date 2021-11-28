import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import cdnImage from 'lib/cdn-image';

const { Title } = Typography;

const MainContent = styled.div`
  margin: ${({ isAdmin }) => (isAdmin ? '0' : '20px')};
  min-height: calc(100vh - 64px);
`;

export default function TicketsView(props) {
  const { isAdmin, purchases, refetch, loading, error } = props;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  return (
    <Layout>
      <MainContent isAdmin={isAdmin}>
        <div style={{ marginTop: '20px', height: '800px' }}>
          <Title level={4}>My Subscriptions</Title>
          <div className="grid grid-flow-row gap-5 grid-cols-1 md:grid-cols-2">
            {purchases.map((purchase) => (
              <Link to={purchase.url} key={purchase.id}>
                <article
                  id={`card-${purchase.id}`}
                  className="event-card relative cursor-pointer bg-gray-950 overflow-hidden shadow rounded-3xl hover:border-red-500"
                  data-test-id="event-card"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      className="object-cover text-white"
                      alt={purchase.name}
                      src={purchase.cover}
                    />
                  </div>
                  <div className="event-card-info px-6 mt-6 md:mt-4">
                    <h2 className="font-sans">
                      <React.Fragment>
                        <div>{purchase.name}</div>
                      </React.Fragment>
                    </h2>
                    <p className="mb-4 font-sans">
                      <React.Fragment>{purchase.account}</React.Fragment>
                    </p>
                    {!!purchase.product && (
                      <p className="mb-4 font-sans">
                        <React.Fragment>
                          Renews every {purchase.product.access_length} days
                        </React.Fragment>
                      </p>
                    )}
                    {!!!purchase.product && (
                      <p className="mb-4 font-sans">
                        <React.Fragment>All Access</React.Fragment>
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </MainContent>
    </Layout>
  );
}
