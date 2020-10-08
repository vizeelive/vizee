import React from "react";
import { useParams } from "react-router-dom";
import { Statistic, Row, Col, Button, Divider, Table } from "antd";
import moment from "moment";

import { gql, useQuery } from "@apollo/client";

import { CalendarOutlined, ThunderboltOutlined } from "@ant-design/icons";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

const GET_EVENT_AUTH = gql`
  query MyQuery($id: uuid!) {
    events_by_pk(id: $id) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      description
      account {
        name
        username
        photo
      }
      transactions {
        id
      }
      favorites {
        id
      }
    }
  }
`;

export default function ViewEvent() {
  let { id } = useParams();

  const { loading, error, data } = useQuery(GET_EVENT_AUTH, {
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

  const event = { ...data.events_by_pk };

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
      <h2>
        <ThunderboltOutlined /> {event.name}
      </h2>
      <div>
        <CalendarOutlined /> {moment(event.start).format("MMMM Do h:mm:ss a")}
      </div>
      <div>
        <CalendarOutlined /> {moment(event.end).format("MMMM Do h:mm:ss a")}
      </div>
      <div>Location: Los Angeles, CA</div>
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
          <Statistic title="Tickets Purchased" value={1032} />
        </Col>
        <Col span={4}>
          <Statistic title="Views" value={3423} />
        </Col>
        <Col span={4}>
          <Statistic title="Favorites" value={272} />
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
