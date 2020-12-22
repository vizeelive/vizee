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
        {this.props.user && !this.props.user.isAdmin && (
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

        {this.props.user && this.props.user.isAdmin && (
          <div className="rounded-md bg-gray-900 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Heroicon name: information-circle */}
                <svg
                  className="h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-300 m-0">
                  Admin cannot leave comments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
