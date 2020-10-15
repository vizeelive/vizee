import styled from 'styled-components';
import { Typography, Button, Tag } from 'antd';

export const Container = styled.div`
  .ant-card-bordered {
    margin: 5px;
    height: ${({ loggedIn }) => (loggedIn ? '35rem' : '29rem')};
    overflow: hidden;
  }

  .ant-card-cover {
    height: 50%;
  }

  .ant-card-body {
    height: 50%;
  }

  .ant-card-cover img {
    object-fit: cover;
    height: 100%;
  }

  .ant-card-cover video {
    object-fit: cover;
    height: 100%;
  }
`;

export const EventName = styled(Typography.Title)`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
`;

export const AccountName = styled(Typography.Title)`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-top: 0 !important;
`;

export const DateText = styled(Typography.Text)``;

export const TagsContainer = styled.div`
  padding: 1rem 0 0.5rem;

  .ant-tag {
    margin-bottom: 0.5rem;
  }
`;

export const Favorite = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: ${({ isActive }) => (isActive ? '#ffd666' : '#d9d9d9')};
`;

export const EditLink = styled(Button)`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const LiveTag = styled(Tag)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: 700;
`;
