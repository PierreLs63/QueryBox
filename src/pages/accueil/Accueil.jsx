// Import Components
import RequestParam from '../../../public/components/request_param.jsx';
import RequestHeader from '../../../public/components/request_header.jsx';
import RequestBody from '../../../public/components/request_body.jsx';
import ResponseHeader from './response_header.jsx';
import ResponseBody from '../../../public/components/response_body.jsx';
import SiderMenu from '../../../public/components/sider_menu.jsx';
import CollaboratorMenu from '../../../public/components/collaboratorMenu.jsx'
import NotificationMenu from '../../../public/components/notificationMenu.jsx';
import InviteMenu from '../../../public/components/inviteMenu.jsx';
import './Accueil.css'


import { useState, useEffect } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Input, Radio, Flex, Splitter, Select } from 'antd';

// Overall page layout
const { Header, Sider } = Layout;

// Function application
const Accueil = () => {
  // State variables
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");
  const [inviteNickname, setInviteNickname] = useState("");

  // Notifications place-holders
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Place-holder 1' },
    { id: 2, message: 'Multiple line place-holder beepbop 2' },
    { id: 3, message: 'Place-holder 3' },
  ]);

  // Usernames place-holders
  const [collaborators, setCollaborators] = useState([
    'PierreLs63',
    'FireIceFly',
    'duckduckxuan',
    'CCtuhulu',
  ]);

  // Header place-holders
  const [headerData, setHeaderData] = useState([
    { key: 'Host', value: 'value_host', description: 'Description for Host' },
    { key: 'User_Agent', value: 'value_userAgent', description: 'Description for User_Agent' },
    { key: 'Accept', value: 'value_accept', description: 'Description for Accept' },
    { key: 'Accept_Encoding', value: 'value_acceptEncoding', description: 'Description for Accept_Encoding' },
    { key: 'Connection', value: 'value_connection', description: 'Description for Connection' },
  ]);

  // ParamReq place-holders
  const [paramReqData, setParamReqData] = useState(
    Array.from({ length: 100 }).map((_, i) => ({
      key: i.toString(),
      keyData: `Param ${i}`,
      value: `Value ${i}`,
      description: `Description ${i}`,
    }))
  );

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
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.setProperty('color-scheme', 'light');
  }, []);

  return (
    <Layout style={{ height: '100vh', width: '100vw', background: '#d9ebe5', overflowY: 'hidden' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#B4CDC4' }}>
        {/* QueryBox */}
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>

        {/* Welcome Message */}
        <div style={{ fontSize: '20px', color: 'rgb(28, 41, 38)', fontWeight: 'bold' }}>Bienvenue sur QueryBox !</div>

        {/* Icons and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

          {/* Collaborateur Button with Popover for user list */}
          <CollaboratorMenu collaborators={collaborators} />

          {/* User Add Icon with Popover for user invite */}
          <InviteMenu inviteNickname={inviteNickname} setInviteNickname={setInviteNickname} />

          {/* Bell Icon with Popover for Notifications */}
          <NotificationMenu notifications={notifications} setNotifications={setNotifications} />

          <SettingOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />
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

            <Splitter
              layout="vertical"
              style={{
                height: '100vh',
                background: "#d9ebe5",
                overflow: 'hidden'
              }}
            >
              {/* Block of request */}
              <Splitter.Panel
                style={{
                  height: '50%',
                  background: "#d9ebe5",
                  overflow: 'hidden'
                }}>
                {/* Ratio box: param, header, body */}
                <Flex vertical gap="middle">
                  <Radio.Group 
                    onChange={onChangeResquest}  
                    defaultValue="param"
                    style={{
                      marginBottom: '5px',
                      marginTop: '0px',
                      display: 'flex'
                    }}
                  >
                    <Radio.Button 
                    value="param"
                    style={{
                      border: '1px solid #54877c',
                      flex: 0.1,
                      textAlign: 'center'
                    }}
                    className="custom-radio-button"
                    >Param</Radio.Button>
                    <Radio.Button 
                    value="headerRequest"
                    style={{
                      border: '1px solid #54877c',
                      flex: 0.1,
                      textAlign: 'center'
                    }}
                    className="custom-radio-button"
                    >Header</Radio.Button>
                    <Radio.Button 
                    value="bodyRequest"
                    style={{
                      border: '1px solid #54877c',
                      flex: 0.1,
                      textAlign: 'center'
                    }}
                    className="custom-radio-button"
                    >Body</Radio.Button>
                  </Radio.Group>
                </Flex>
                {selectedRequest === "param" && <RequestParam paramReqData={paramReqData} setParamReqData={setParamReqData} />}
                {selectedRequest === "headerRequest" && <RequestHeader headerData={headerData} setHeaderData={setHeaderData} />}
                {selectedRequest === "bodyRequest" && <RequestBody />}
              </Splitter.Panel>

              {/* Block of response */}
              <Splitter.Panel
                style={{
                  height: '50%',
                  background: "#d9ebe5",
                  overflow: 'hidden'
                }}>
                {/* Ratio box: header, body */}
                <Flex vertical gap="middle">
                  <Radio.Group 
                    onChange={onChangeResponse} 
                    defaultValue="headerResponse"
                    style={{
                      marginBottom: '5px',
                      marginTop: '15px',
                      display: 'flex'
                    }}
                  >
                    <Radio.Button 
                    value="headerResponse"
                    style={{
                      border: '1px solid #54877c',
                      flex: 0.1,
                      textAlign: 'center'
                    }}
                    className="custom-radio-button"
                    >Header</Radio.Button>
                    <Radio.Button 
                    value="bodyResponse"
                    style={{
                      border: '1px solid #54877c',
                      flex: 0.1,
                      textAlign: 'center'
                    }}
                    className="custom-radio-button"
                    >Body</Radio.Button>
                  </Radio.Group>
                </Flex>
                {selectedResponse === "headerResponse" && <ResponseHeader dataResponseHeader={dataResponseHeader} />}
                {selectedResponse === "bodyResponse" && <ResponseBody text="here is an example to test" />}
              </Splitter.Panel>
            </Splitter>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Accueil;
