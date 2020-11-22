import React from 'react';
import styled from 'styled-components';
import { Tabs, Input } from 'antd';

import FinishSignup from '../../components/FinishSignup';
// import Map from '../components/Map';
import Events from '../../components/Events';
import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function HomeView(props) {
  const {
    loading,
    error,
    isMobile,
    user,
    showModal,
    setShowModal,
    categories,
    events,
    refetch,
    search
  } = props;

  if (loading) {
    return (
      <Centered height="calc(100vh - 64px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const MainContent = styled.main`
    padding: 0 20px 20px;
    min-height: calc(100vh - 64px);
  `;

  const HeroText = styled.div`
    position: relative;
    bottom: 14vh;
    color: white;
    font-size: 30px;
    font-weight: 800;
    text-align: center;
    opacity: 0.8;
  `;

  return (
    <React.Fragment>
      {/* {!isMobile && <Map events={events} />} */}
      {!isMobile && (
        <div style={{ height: '300px' }}>
          <video
            src="https://dam-media.s3.amazonaws.com/concert.mp4"
            width="100%"
            height="300px"
            autoPlay
            muted
            loop
            style={{ objectFit: 'cover', opacity: '0.2' }}
          />
          <HeroText>
            Premium Video Network.
            <br />
            Sell tickets. Earn up to 90% of every dollar.
          </HeroText>
        </div>
      )}

      <MainContent>
        {user && showModal && <FinishSignup setShowModal={setShowModal} />}
        <Tabs defaultActiveKey="Music">
          {categories.map((category) => {
            // @TODO use view count once we have pagination here
            let count = events.filter((e) => e.category.id === category.id);
            if (!count.length) return null;
            return (
              <TabPane tab={category.name} key={category.name}>
                <Input
                  placeholder="Search"
                  onChange={(e) => search(e.currentTarget.value)}
                  style={{ maxWidth: '40rem', marginBottom: '20px' }}
                  prefix={<SearchOutlined />}
                  size="large"
                />
                <Events
                  events={events}
                  category={category.id}
                  refetch={refetch}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </MainContent>
    </React.Fragment>
  );
}
