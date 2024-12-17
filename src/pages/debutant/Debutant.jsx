import React, { useState } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Typography, Flex } from 'antd';
import SiderMenu from './sider_menu.jsx';
import './Debutant.css';


// Overall page layout
const { Header, Content, Sider } = Layout;

// Variable of title
const { Title } = Typography;

// Function application
const Debutant = () => {
  return (
    <Layout style={{ height: '100%', width: '100vw', background: '#d9ebe5' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#c7dbd5' }}>
        {/* QueryBox */}
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>

        {/* Welcome Message */}
        <div style={{ fontSize: '20px', color: 'black' }}>Bienvenue sur QueryBox !</div>

        {/* Icons and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button 
            shape="round" 
            style={{
              backgroundColor: 'transparent',
              borderColor: '#54877c',
              color: 'black',
            }}>
            Collaborateur
          </Button>
          <UserAddOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          <BellOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          <SettingOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
        </div>
      </Header>

      <Layout style={{ height: '100%', width: '100%', background: '#ebf9f4' }}>
        <Sider
          width={400}
          collapsible={false} // disable collapse
          breakpoint="md"
          collapsedWidth="0"
          style={{
            background: '#ebf9f4',
            overflowY: 'scroll',
            height: '115vh',
          }}
        >
          <SiderMenu />
        </Sider>

        <Layout style={{ padding: '0 24px 24px', width: '100vw', height: '100vh', background: '#ebf9f4' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              borderRadius: '10px',
              overflowY: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '150px',
            }}
          >
            {/* Text */}
            <Title level={2} style={{ color: 'black', margin: 0 }}>
              Tuto
            </Title>

            {/* Button */}
            <Flex gap="150px" justify="center">
              <Button
                shape="round" 
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#54877c',
                  color: 'black',
                  width: '100px'
                }}
              >
                Commencer
              </Button>
              <Button
                shape="round" 
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#54877c',
                  color: 'black',
                  width: '100px'
                }}
              >
                Quitter
              </Button>
            </Flex>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Debutant;