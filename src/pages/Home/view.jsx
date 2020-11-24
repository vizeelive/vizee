import React from 'react';
import styled from 'styled-components';
import { Tabs, Input } from 'antd';

import FinishSignup from '../../components/FinishSignup';
// import Map from '../components/Map';
import Events from '../../components/Events';
import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';
import 'animate.css';

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

  const Hero = styled.div`
    height: 300px;

    video {
      height: 300px;
    }
  `;

  const HeroText = styled.div`
    position: relative;
    bottom: 75%;
    color: white;
    font-size: ${(props) => (props.isMobile ? 'x-large' : 'xxx-large')};
    font-weight: 100;
    text-align: center;
    opacity: 0.8;
  `;

  return (
    <React.Fragment>
      {/* {!isMobile && <Map events={events} />} */}
      <Hero>
        <video
          src="https://dam-media.s3.amazonaws.com/concert.mp4"
          width="100%"
          height="300px"
          autoPlay
          muted
          loop
          style={{ objectFit: 'cover', opacity: '0.2' }}
        />
        <HeroText
          className="animate__animated animate__zoomInRight"
          isMobile={isMobile}
        >
          Premium Video Network.
          <br />
          <small>Sell videos. Earn up to 90% of every dollar.</small>
        </HeroText>
      </Hero>

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
