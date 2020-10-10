import React from "react";
import { Link, useParams } from "react-router-dom";
import { Statistic, Row, Col, Button, Divider, Table } from "antd";
import moment from "moment";

import { gql, useQuery } from "@apollo/client";

import { CalendarOutlined, ThunderboltOutlined } from "@ant-design/icons";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

// @TODO only let certain roles select revenue..
const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!) {
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      location
      description
      transactions
      favorites
      revenue
      views
      account {
        name
        username
        photo
      }
      transaction {
        id
        price
        user {
          first_name
          last_name
          city
          country
        }
      }
      view {
        id
        city
        region
        country
        timezone
      }
    }
  }
`;

export default function ViewEvent() {
  let { id, username } = useParams();

  const { loading, error, data } = useQuery(GET_EVENT_AUTH, {
    fetchPolicy: "cache-and-network",
    variables: { id },
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error";

  const event = { ...data?.events_report[0] };

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ];

  const transactionData = event.transaction.map((t) => {
    return {
      id: t.id,
      price: t.price,
      first_name: t.user.first_name,
      last_name: t.user.last_name,
      city: t.user.city,
      country: t.user.country,
    };
  });

  const viewColumns = [
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "Region",
      dataIndex: "region",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Timezone",
      dataIndex: "timezone",
    },
  ];

  const viewData = event.view.map((v) => {
    return {
      id: v.id,
      city: v.city,
      country: v.country,
      region: v.region,
      timezone: v.timezone,
    };
  });

  return (
    <React.Fragment>
      <Button style={{ float: "right" }} type="secondary">
        <Link to={`/${username}/events/edit/${event.id}`}>Edit Event</Link>
      </Button>
      <h2>
        <ThunderboltOutlined />{" "}
        <Link to={`/events/${event.id}`}>{event.name}</Link>
      </h2>
      <div>
        <CalendarOutlined /> {moment(event.start).format("MMMM Do h:mm:ss a")}
      </div>
      <div>
        <CalendarOutlined /> {moment(event.end).format("MMMM Do h:mm:ss a")}
      </div>
      <div>Location: {event.location}</div>
      <Divider />
      {/* <div>{event.description}</div> */}

      <Row gutter={16}>
        <Col span={4}>
          <Statistic
            title="Revenue (USD)"
            value={event.revenue}
            precision={2}
          />
          <Button style={{ marginTop: 16 }} type="primary">
            Withdraw
          </Button>
        </Col>
        <Col span={4}>
          <Statistic title="Tickets Purchased" value={event.transactions} />
        </Col>
        <Col span={4}>
          <Statistic title="Views" value={event.views || 0} />
        </Col>
        <Col span={4}>
          <Statistic title="Favorites" value={event.favorites} />
        </Col>
      </Row>

      <Divider />

      {/* <h3>Statistics</h3>
      <img
        src="https://dam-media.s3.amazonaws.com/muxgraph.png"
        style={{ width: "100%" }}
        alt="graph"
      />
      <br />
      <br /> */}
      <h3>Transactions</h3>
      <Table rowKey="id" columns={columns} dataSource={transactionData} />

      <h3>Views</h3>
      <Table rowKey="id" columns={viewColumns} dataSource={viewData} />
    </React.Fragment>
  );
}
