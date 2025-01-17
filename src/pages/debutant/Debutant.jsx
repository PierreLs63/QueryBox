import React, { useEffect } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Typography, Flex } from 'antd';
import SiderMenu from '../../components/sider_menu';
import { useNavigate } from 'react-router-dom';

// Overall page layout
const { Header, Content, Sider } = Layout;

// Variable of title
const { Title } = Typography;

// Function application
const Debutant = () => {
  useEffect(() => {
    document.body.style.fontFamily = "'Roboto', sans-serif";
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.setProperty('color-scheme', 'light');
  }, []);

    const navigate = useNavigate();
    // Navigate to tuto
    const handleTuto = () => {
      navigate('/tuto');
    };
    // Navigate to accueil
    const handleAccueil = () => {
      navigate('/accueil');
    };

  return (
    <Layout style={{ height: '100vh', width: '100vw', overflowY: 'hidden', background: '#d9ebe5' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#B4CDC4' }}>
        {/* QueryBox */}
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>

        {/* Welcome Message */}
        <div style={{ fontSize: '20px', color: 'rgb(28, 41, 38)', fontWeight: 'bold' }}>Bienvenue sur QueryBox !</div>

        {/* Icons and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button 
            shape="round" 
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgb(34, 56, 51)',
              borderWidth: '2px',
              color: 'rgb(28, 41, 38)',
              height: '31px',
              fontWeight: 'bold'
            }}>
            Collaborateur
          </Button>
          <Button
            type="text"
            icon={<UserAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<BellOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<SettingOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
        </div>
      </Header>

      <Layout style={{ height: '100%', width: '100%', background: '#d9ebe5' }}>
        <Sider
          width={400}
          collapsible={false} // disable collapse
          breakpoint="md"
          collapsedWidth="0"
          style={{
            background: '#d9ebe5',
            overflowY: 'scroll',
            height: '100%',
          }}
        >
          <SiderMenu />
        </Sider>

        <Layout style={{ padding: '0 24px 24px', width: '100vw', height: '100%', background: '#d9ebe5' }}>
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
              Tuto utilisation
            </Title>

            {/* Button */}
            <Flex gap="150px" justify="center">
              <Button
                shape="round" 
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgb(34, 56, 51)',
                  borderWidth: '2px',
                  color: 'rgb(28, 41, 38)',
                  height: '31px',
                  fontWeight: 'bold'
                }}
                onClick={handleTuto}
              >
                Commencer
              </Button>
              <Button
                shape="round" 
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgb(34, 56, 51)',
                  borderWidth: '2px',
                  color: 'rgb(28, 41, 38)',
                  height: '31px',
                  fontWeight: 'bold'
                }}
                onClick={handleAccueil}
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