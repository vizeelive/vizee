import React from 'react';
import moment from 'moment';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <React.Fragment>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </React.Fragment>
);

export default class Comments extends React.Component {
  state = {
    comments:
      this.props?.comments?.map((comment) => {
        return {
          avatar: `https://avatars.dicebear.com/api/initials/${comment.user.first_name} ${comment.user.last_name}.svg`,
          author: `${comment.user.first_name}`,
          content: comment.body,
          datetime: moment(comment.created).fromNow()
        };
      }) || [],
    submitting: false,
    value: ''
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.props.onSubmit(this.state.value);
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { comments, value } = this.state;

    return (
      <>
        {this.props.user && !this.props.user.isAdmin && (
          <Comment
            avatar={
              <Avatar
                src={`https://avatars.dicebear.com/api/initials/${this.props.user.nickname}.svg`}
                alt={`${this.props.user.nickname}`}
              />
            }
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={this.props.isCreatingComment}
                value={value}
              />
            }
          />
        )}
        {comments.length > 0 && <CommentList comments={this.state.comments} />}
        {this.props.user &&
          this.props.user.isAdmin &&
          'Admin cannot leave comments.'}
      </>
    );
  }
}
