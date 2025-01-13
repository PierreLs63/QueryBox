// Import Components
import RequestParam from '../../components/request_param';
import RequestHeader from '../../components/request_header';
import RequestBody from '../../components/request_body';
import ResponseHeader from '../../components/response_header';
import ResponseBody from '../../components/response_body';
import SiderMenu from '../../components/sider_menu';
import CollaboratorMenu from '../../components/collaboratorMenu';
import NotificationMenu from '../../components/notificationMenu';
import InviteMenu from '../../components/inviteMenu';
import './Accueil.css';

import { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, Radio, Flex, Splitter, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import useCollaborateurs from '../../hooks/workspace/useCollaborateurs.jsx';
import useInvite from '../../hooks/workspace/useInvite.jsx';

// Overall page layout
const { Header, Sider } = Layout;

// Function application
const Accueil = () => {
  // State variables
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");

  // Stock height of panel REQUEST
  const [requestPanelHeight, setRequestPanelHeight] = useState(0);
  const requestPanelRef = useRef(null);

  // Stock height of panel RESPONSE
  const [responsePanelHeight, setResponsePanelHeight] = useState(0);
  const responsePanelRef = useRef(null);


  // Utilisation du hook useCollaborateurs
  const { loadingCollaborateurs, errorCollaborateurs, getCollaborateurs, collaborateurs } = useCollaborateurs();
  const { invite, inviteUsername, setInviteUsername, invitePrivilege, setInvitePrivilege } = useInvite();

  const workspaceId = "677e5afac212fc2670aaece7";



  // Récupérer les collaborateurs lors du montage du composant
  useEffect(() => {
   // temporaire il faut récupérer l'id du workspace
    getCollaborateurs(workspaceId);
  }, []);

  // Notifications place-holders
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Place-holder 1' },
    { id: 2, message: 'Multiple line place-holder beepbop 2' },
    { id: 3, message: 'Place-holder 3' },
  ]);


  // Event of request checked
  const onChangeResquest = (e) => {
    setSelectedRequest(e.target.value);
  };

  // Event of response checked
  const onChangeResponse = (e) => {
    setSelectedResponse(e.target.value);
  };

  // Calculate real height of panel REQUEST when splitter is changed
  useEffect(() => {
    function handleResize() {
      if (requestPanelRef.current) {
        setRequestPanelHeight(requestPanelRef.current.clientHeight);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Calculate real height of panel RESPONSE when splitter is changed
  useEffect(() => {
    function handleResize() {
      if (responsePanelRef.current) {
        setResponsePanelHeight(responsePanelRef.current.clientHeight);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
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
          <CollaboratorMenu collaborators={collaborateurs || []} loading={loadingCollaborateurs} error={errorCollaborateurs} workspaceId={workspaceId}/>

          {/* User Add Icon with Popover for user invite */}
          <InviteMenu inviteUsername={inviteUsername} setInviteUsername={setInviteUsername} invitePrivilege={invitePrivilege} setInvitePrivilege={setInvitePrivilege} invite={invite} workspaceId={workspaceId}/>

          {/* Bell Icon with Popover for Notifications */}
          <NotificationMenu notifications={notifications} setNotifications={setNotifications} />

          {/* Setting Icon --- To do */}
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
          collapsible={false}
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
            <Button
              onClick={(e) => {
                e.currentTarget.blur();
              }}>
              Send
            </Button>
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
              // Get clientHeight of panel
              ref={requestPanelRef}
              style={{
                height: '50%',
                background: "#d9ebe5",
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
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
                  <Radio.Button value="param" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                    Param
                  </Radio.Button>
                  <Radio.Button value="headerRequest" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                    Header
                  </Radio.Button>
                  <Radio.Button value="bodyRequest" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                    Body
                  </Radio.Button>
                </Radio.Group>
              </Flex>

              <div style={{ flex: 1, overflow: 'auto' }}>
                {selectedRequest === "param" && (<RequestParam />)}
                {selectedRequest === "headerRequest" && (<RequestHeader />)}
                {selectedRequest === "bodyRequest" && (<RequestBody />)}
              </div>
            </Splitter.Panel>

              {/* Block of response */}
              <Splitter.Panel
                // Get clientHeight of panel
                ref={responsePanelRef}
                style={{
                  height: '50%',
                  background: "#d9ebe5",
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
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
                    <Radio.Button value="headerResponse" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                      Header
                    </Radio.Button>
                    <Radio.Button value="bodyResponse" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                      Body
                    </Radio.Button>
                  </Radio.Group>
                </Flex>

                <div style={{ flex: 1, overflow: 'auto' }}>
                  {selectedResponse === "headerResponse" && (<ResponseHeader dataResponseHeader={[]} containerHeight={responsePanelHeight - 60} />)}
                  {selectedResponse === "bodyResponse" && (<ResponseBody text="here is an example to test" />)}
                </div>
              </Splitter.Panel>
            </Splitter>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Accueil;
