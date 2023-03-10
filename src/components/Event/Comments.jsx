import React from 'react';
import moment from 'moment';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} Comment${comments.length > 1 ? 's' : ''}`}
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
      <div data-test-id="comments">
        {this.props.user && (
          <Comment
            data-test-id="comments-editor"
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
      </div>
    );
  }
}
