import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Comment, Avatar, List } from 'antd';
import TextareaAutosize from 'react-autosize-textarea';
import { isMobile } from 'react-device-detect';

const CommentList = ({ comments }) => {
  return (
    <List
      dataSource={comments.map(comments.pop, [...comments])}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
    />
  );
};

const Editor = (props) => {
  const { onChange, onSubmit, submitting, value } = props;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Enter') {
        onSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="flex items-center">
      <div className="flex-grow">
        <TextareaAutosize
          className="text-white bg-gray-750 focus:bg-black focus:ring-pink-600 focus:border-pink-600 block w-full pr-12 sm:text-sm border-gray-750 rounded-md"
          onChange={onChange}
          value={value}
          disabled={submitting}
          placeholder="Write a comment..."
        />
      </div>
      {isMobile && (
        <button
          type="button"
          className="bg-gray-900 p-2 ml-2 rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary"
          onClick={onSubmit}
          disabled={value.length === 0}
        >
          <svg
            className="h-6 w-6 transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default function Comments(props) {
  const { comments: comments_, user, onSubmit, isCreatingComment } = props;

  const [comments] = useState(
    comments_?.map((comment) => {
      return {
        avatar: `https://avatars.dicebear.com/api/initials/${comment.user.first_name} ${comment.user.last_name}.svg`,
        author: `${comment.user.first_name}`,
        authorid: comment.user,
        content: comment.body,
        datetime: moment(comment.created).fromNow()
      };
    }) || []
  );
  const [value, setValue] = useState('');

  const listRef = useRef(null);

  // @todo: only scroll to bottom on comments change if the user is at/near the bottom
  useEffect(() => {
    if (listRef.current) {
      const scrollHeight = listRef.current.scrollHeight;
      const height = listRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      listRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [comments]);

  const handleSubmit = () => {
    if (!value) {
      return;
    }
    onSubmit(value);
  };

  return (
    <div className="flex flex-col bg-gray-900 h-full" data-test-id="comments">
      <div ref={listRef} className="flex-grow overflow-y-auto px-4">
        {comments.length > 0 && <CommentList comments={comments} />}
      </div>
      <div className="px-4">
        {user && (
          <Comment
            data-test-id="comments-editor"
            avatar={
              <Avatar
                src={`https://avatars.dicebear.com/api/initials/${user.nickname}.svg`}
                alt={`${user.nickname}`}
              />
            }
            content={
              <Editor
                onChange={(e) => setValue(e.target.value)}
                onSubmit={handleSubmit}
                submitting={isCreatingComment}
                value={value}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
