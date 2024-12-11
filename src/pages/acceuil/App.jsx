import React from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';

const { Header, Content, Sider } = Layout;

const items1 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ height: '100vh', width: '1400px' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>

      {/* QueryBox */}
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
          QueryBox
        </div>

        {/* Bienvenue sur QueryBox */}
        <div style={{ fontSize: '16px', color: 'white' }}>
          Bienvenue sur QueryBox !
        </div>

        {/* Button + Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Button */}
          <Button type="primary">Collaborateur</Button>
          {/* Add user */}
          <UserAddOutlined style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} />
          {/* Notification */}
          <BellOutlined style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} />
          {/* Setting */}
          <SettingOutlined style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} />
        </div>

      </Header>
      <Layout>
        <Sider
          width={400}
          collapsible
          breakpoint="md"
          collapsedWidth="0"
          style={{ background: colorBgContainer }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={items1}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            width: '100%',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Block */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              {/* Request */}
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  background: '#f0f2f5',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  width: '100%'
                }}
              >
                <h3>Request</h3>
                <p>Contenu Request</p>
              </div>

              {/* Response */}
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  background: '#f0f2f5',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  width: '100%'
                }}
              >
                <h3>Response</h3>
                <p>Contenu Réponse</p>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;