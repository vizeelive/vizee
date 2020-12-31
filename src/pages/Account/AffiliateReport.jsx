import React, { Suspense } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';
import currency from 'currency.js';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import styled from 'styled-components';
import moment from 'moment';

import {
  Button,
  Modal,
  Form,
  Select,
  Table,
  Popconfirm,
  Typography,
  Input
} from 'antd';

const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

const WATCH_AFFILIATE_REPORT = gql`
  subscription watchAffiliateReport {
    affiliate_report {
      price
      event_name
      created
      affiliate_id
      account_name
    }
  }
`;

export default function AffiliateReport() {
  const { loading, error, data, refetch } = useSubscription(
    WATCH_AFFILIATE_REPORT
  );

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const columns = [
    {
      title: 'Account Name',
      dataIndex: ['account_name'],
      key: 'account_name'
    },
    {
      title: 'Event Name',
      dataIndex: ['event_name'],
      key: 'event_name'
    },
    {
      title: 'Price',
      dataIndex: ['price'],
      key: 'price'
    },
    {
      title: 'Commission',
      dataIndex: ['price'],
      key: 'commission',
      render: (price) => {
        return '$' + currency(price).multiply(0.02).toString();
      }
    },
    {
      title: 'Purchase Date',
      dataIndex: ['created'],
      key: 'created',
      render: (created) => {
        return moment(created).format('MMMM Do h:mm a');
      }
    }
  ];

  let total = 0;
  data.affiliate_report.forEach((line) => {
    let commission = currency(line.price).multiply(0.2);
    total = currency(total).add(commission);
  });

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-3xl float-right">
          <span class="text-green-700">Total: ${total.toString()}</span>
        </div>
        <Header>
          <Title>Affiliate Sales</Title>
        </Header>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.affiliate_report}
          scroll={{ x: 800 }}
        />
      </div>
    </article>
  );
}
