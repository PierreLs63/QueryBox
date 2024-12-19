import { useState, useEffect } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import { Layout, Button, Input, Popover, Radio, Flex, Splitter, List, Select } from 'antd';
import RequestParam from './request_param.jsx';
import RequestHeader from './request_header.jsx';
import RequestBody from './request_body.jsx';
import ResponseHeader from './response_header.jsx';
import ResponseBody from './response_body.jsx';
import toast from 'react-hot-toast';
import SiderMenu from './sider_menu.jsx';

// Overall page layout
const { Header, Content, Sider } = Layout;

// Function application
const Accueil = () => {
  // State variables
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");
  const [nickname, setNickname] = useState("");

  // Notifications place-holders
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Place-holder 1' },
    { id: 2, message: 'Multiple line place-holder beepbop 2' },
    { id: 3, message: 'Place-holder 3' },
  ]);

  // Placeholder usernames for the "Collaborateur" menu
  const [collaborators, setCollaborators] = useState([
    'PierreLs63',
    'FireIceFly',
    'duckduckxuan',
    'CCtuhulu',
  ]);

  // Event of request checked
  const onChangeResquest = (e) => {
    setSelectedRequest(e.target.value);
  };

  // Event of response checked
  const onChangeResponse = (e) => {
    setSelectedResponse(e.target.value);
  };

  // Data base of response header
  const dataResponseHeader = Array.from({
    length: 100,
  }).map((_, i) => ({
    key: i,
    keyData: `Key ${i}`,
    value: `Value ${i}`,
  }));

  useEffect(() => {
    document.body.style.fontFamily = "'Roboto', sans-serif";
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.setProperty('color-scheme', 'light');
  }, []);

  const handleInvite = () => {
    toast.success(`Invite sent to ${nickname} !`);
    setNickname("");
  };

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const inviteContent = (
    <div>
      <Input
        placeholder="Entrez pseudonyme"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button 
        type="primary" 
        onClick={handleInvite}
        disabled={!nickname}
      >
        Invite
      </Button>
    </div>
  );

  const notificationContent = (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '250px' }}>
      <List
        dataSource={notifications}
        renderItem={item => (
          <List.Item
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              maxWidth: '230px',
            }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>
              {item.message}
            </div>
            <Button
              type="link"
              icon={<CloseOutlined style={{ color: 'red' }} />}
              onClick={() => handleRemoveNotification(item.id)}
              style={{ padding: 0 }}
            />
          </List.Item>
        )}
      />
    </div>
  );

  const collaboratorContent = (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '200px' }}>
      <List
        dataSource={collaborators}
        renderItem={(collaborator) => (
          <List.Item>
            <Button type="link" style={{ width: '100%' }}>
              {collaborator}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Layout style={{ height: '100%', width: '100vw', background: '#d9ebe5' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#c7dbd5' }}>
        {/* QueryBox */}
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>

        {/* Welcome Message */}
        <div style={{ fontSize: '20px', color: 'black' }}>Bienvenue sur QueryBox !</div>

        {/* Icons and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Collaborateur Button with Popover for user list */}
          <Popover content={collaboratorContent} title="Collaborateurs" trigger="click">
            <Button 
              shape="round" 
              style={{
                backgroundColor: 'transparent',
                borderColor: '#54877c',
                color: 'black',
              }}
            >
              Collaborateur
            </Button>
          </Popover>

          {/* User Add Icon with Popover for user invite */}
          <Popover content={inviteContent} title="Inviter Collaborateur" trigger="click">
            <UserAddOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          </Popover>

          {/* Bell Icon with Popover for Notifications */}
          <Popover content={notificationContent} title="Notifications" trigger="click">
            <BellOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          </Popover>

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

        <Layout style={{ padding: '0 24px 24px', width: '100vw', height: '100%', background: '#d9ebe5' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '16px 0',
            }}
          >
            {/* Method Dropdown */}
            <Select
              defaultValue="GET"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: 'GET',
                  label: 'GET',
                },
                {
                  value: 'POST',
                  label: 'POST',
                },
                {
                  value: 'PUT',
                  label: 'PUT',
                },
                {
                  value: 'PATCH',
                  label: 'PATCH',
                },
                {
                  value: 'DELETE',
                  label: 'DELETE',
                },
                {
                  value: 'HEAD',
                  label: 'HEAD',
                },
                {
                  value: 'OPTIONS',
                  label: 'OPTIONS',
                },
              ]}
            />

            {/* URL Input */}
            
            <Input placeholder="URL" />

            {/* Send Button */}
            <Button>Send</Button>
          </div>

          <Content>
            <Splitter
              layout="vertical"
              style={{
                height: '100vh',
                //boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                background: "#d9ebe5",
                overflow: 'hidden',
                borderRadius: '4px'
              }}
            >
              {/* Block of request */}
              <Splitter.Panel>
                {/* Ratio box: param, header, body */}
                <Flex vertical gap="middle">
                  <Radio.Group 
                    onChange={onChangeResquest}  
                    defaultValue="param"
                    style={{
                      marginBottom: '16px',
                    }}
                  >
                    <Radio.Button 
                    value="param"
                    style={{
                      border: '1px solid #54877c',
                    }}
                    >Param</Radio.Button>
                    <Radio.Button 
                    value="headerRequest"
                    style={{
                      border: '1px solid #54877c',
                    }}
                    >Header</Radio.Button>
                    <Radio.Button 
                    value="bodyRequest"
                    style={{
                      border: '1px solid #54877c',
                    }}
                    >Body</Radio.Button>
                  </Radio.Group>
                </Flex>
                {selectedRequest === "param" && <RequestParam />}
                {selectedRequest === "headerRequest" && <RequestHeader />}
                {selectedRequest === "bodyRequest" && <RequestBody />}
              </Splitter.Panel>

              {/* Block of response */}
              <Splitter.Panel>
                {/* Ratio box: header, body */}
                <Flex vertical gap="middle">
                  <Radio.Group 
                    onChange={onChangeResponse} 
                    defaultValue="headerResponse"
                    style={{
                      marginBottom: '16px',
                      marginTop: '16px'
                    }}
                  >
                    <Radio.Button 
                    value="headerResponse"
                    style={{
                      border: '1px solid #54877c',
                    }}
                    >Header</Radio.Button>
                    <Radio.Button 
                    value="bodyResponse"
                    style={{
                      border: '1px solid #54877c',
                    }}
                    >Body</Radio.Button>
                  </Radio.Group>
                </Flex>
                {selectedResponse === "headerResponse" && <ResponseHeader dataResponseHeader={dataResponseHeader} />}
                {selectedResponse === "bodyResponse" && <ResponseBody text="here is an example to test" />}
              </Splitter.Panel>
            </Splitter>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Accueil;
