import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { message } from 'antd';

import Comments from './Comments';

const SUBSCRIBE_COMMENTS = gql`
  subscription GetComments($event_id: uuid!) {
    comments(where: { event_id: { _eq: $event_id } }) {
      id
      body
      created
      user {
        first_name
        last_name
      }
    }
  }
`;

const GET_COMMENTS = gql`
  query GetComments($event_id: uuid!) {
    comments(where: { event_id: { _eq: $event_id } }) {
      id
      body
      created
      user {
        first_name
        last_name
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($object: comments_insert_input!) {
    insert_comments_one(object: $object) {
      id
    }
  }
`;

export default function CommentsContainer(props) {
  const [key, setKey] = useState(1);

  const { loading, data } = useQuery(GET_COMMENTS, {
    variables: { event_id: props.event.id }
  });

  const { data: liveData } = useSubscription(SUBSCRIBE_COMMENTS, {
    variables: { event_id: props.event.id }
  });

  const [createComment] = useMutation(CREATE_COMMENT);

  useEffect(() => {
    if (data?.comments || liveData?.comments) {
      setKey(Math.random());
    }
  }, [data, liveData]);

  if (loading) return 'Loading...';
  // if (error) return 'Error.';

  const handleCreateComment = async (object) => {
    try {
      await createComment({ variables: { object } });
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  const comments = liveData?.comments || data?.comments;
  console.log({  comments  });;

  return (
    <Comments
      {...props}
      key={key}
      comments={comments}
      onSubmit={(body) =>
        handleCreateComment({ event_id: props.event.id, body })
      }
    />
  );
}
