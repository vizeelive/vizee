import React from "react";
import { Link, useParams } from "react-router-dom";
import { Statistic, Row, Col, Button, Divider, Table } from "antd";
import moment from "moment";

import { gql, useQuery } from "@apollo/client";

import { CalendarOutlined, ThunderboltOutlined } from "@ant-design/icons";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

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
      views
      account {
        name
        username
        photo
      }
      transaction {
        id
      }
    }
  }
`;

export default function ViewEvent() {
  let { id, username } = useParams();

  const { loading, error, data } = useQuery(GET_EVENT_AUTH, {
    fetchPolicy: 'cache-and-network',
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
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ];

  const tableData = [
    {
      id: "1",
      first_name: "Jeff",
      last_name: "Loiselle",
      location: "Mobile, AL",
      price: "$50",
    },
    {
      id: "2",
      first_name: "Doug",
      last_name: "Richar",
      location: "Colchester, CT",
      price: "$50",
    },
  ];

  return (
    <React.Fragment>
      <Button style={{ float: "right" }} type="secondary">
        <Link to={`/${username}/events/edit/${event.id}`}>Edit Event</Link>
      </Button>
      <h2>
        <ThunderboltOutlined /> <Link to={`/events/${event.id}`}>{event.name}</Link>
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
          <Statistic title="Revenue (USD)" value={30960} precision={2} />
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

      <h3>Statistics</h3>
      <img
        src="https://dam-media.s3.amazonaws.com/muxgraph.png"
        style={{ width: "100%" }}
        alt="graph"
      />
      <br />
      <br />
      <h3>Transactions</h3>
      <Table rowKey="id" columns={columns} dataSource={tableData} />
    </React.Fragment>
  );
}
