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
import BreadCrumb from '../../components/breadCrumb';
import './Accueil.css';

import { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, Radio, Flex, Splitter, Select, Badge } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import useCollaborateurs from '../../hooks/workspace/useCollaborateurs.jsx';
import useInvite from '../../hooks/workspace/useInvite.jsx';
import useRequestInputStore from '../../zustand/RequestInput';
import useResponseDataStore from '../../zustand/ResponseData';
import useCreateParamRequest from '../../hooks/requests/useCreateParamRequest';
import useCurrentState from '../../zustand/CurrentState';
import useGetLastParamRequest from '../../hooks/requests/useGetLastParamRequest';
import useWorkspaces from '../../hooks/workspace/useWorkspaces';
import useCollaboratorsDataStore from '../../zustand/Collaborators';

// Overall page layout
const { Header, Sider } = Layout;

// Function application
const Accueil = () => {

  const RequestInputs = useRequestInputStore();
  const ResponseData = useResponseDataStore();
  const CurrentState = useCurrentState();
  const {createParamRequest} = useCreateParamRequest();
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
  const { loadingCollaborateurs, errorCollaborateurs, getCollaborateurs } = useCollaborateurs();
  const { invite, inviteUsername, setInviteUsername, invitePrivilege, setInvitePrivilege } = useInvite();

  const { GetLastParamRequest } = useGetLastParamRequest();
  const [pageState, setpageState] = useState("workspaces");
  const { getWorkspaces } = useWorkspaces();
  const [ workspaceNames, setWorkspaceNames ] = useState([]);
  const collaborators = useCollaboratorsDataStore();

  // Récupérer les collaborateurs lors du montage du composant
  useEffect(() => {
   // temporaire il faut récupérer l'id du workspace
    getCollaborateurs();
    console.log(collaborators.collaboratorsWorkspace)
  }, [CurrentState.workspaceId]);

  useEffect(() => {
    const fetchLastParam = async () => {
      if (CurrentState.requestId != null) {
        try {
          const {success, paramRequest} = await GetLastParamRequest(CurrentState.requestId);
          if (paramRequest != null) {
            RequestInputs.setMethod(paramRequest.method);
            RequestInputs.setUrl(paramRequest.url);
            RequestInputs.setParams(paramRequest.parameters);

            //Adds key element to headers from paramrequest
            const formattedHeaders = paramRequest.header.map((item, index) => ({
              key: String(index),
              keyData: item.keyData,
              value: item.value,
            }));

            RequestInputs.setHeaders(formattedHeaders);
            RequestInputs.setBody(paramRequest.body);
          }
          else {
            RequestInputs.resetToDefault();
          }

          if (success) {
            setpageState("request");
          }

          setSelectedRequest("param");
          setSelectedResponse("headerResponse");
          ResponseData.setCode(null);

        } catch (error) {
          console.error('Error fetching last param:', error);
        }
      }
      else {
        setSelectedRequest("param");
        setSelectedResponse("headerResponse");
        ResponseData.setCode(null);

        if (CurrentState.workspaceId === null){
          setpageState("workspaces");
        }
        else if (CurrentState.collectionId === null){
          setpageState("workspace");
        }
        else if (CurrentState.requestId === null){
          setpageState("collection");
        }
      }
    };
  
    fetchLastParam();
  }, [CurrentState.workspaceId, CurrentState.collectionId, CurrentState.requestId, CurrentState.responseId]);


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


  const prepareWorkspaceList = async() => {
    const workspaces = await getWorkspaces();
    const workspaceName = workspaces.map(workspace => workspace.name);
    setWorkspaceNames(workspaceName)
  }

  useEffect(() => {
    prepareWorkspaceList();
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
          <CollaboratorMenu loading={loadingCollaborateurs} error={errorCollaborateurs} />

          {/* User Add Icon with Popover for user invite */}
          <InviteMenu inviteUsername={inviteUsername} setInviteUsername={setInviteUsername} invitePrivilege={invitePrivilege} setInvitePrivilege={setInvitePrivilege} invite={invite} />

          {/* Bell Icon with Popover for Notifications */}
          <NotificationMenu  />

          {/* Setting Icon --- To do */}
          <Button
            type="text"
            icon={<SettingOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
        </div>
      </Header>

      <Layout style={{ height: '100%', width: '100%', color: '#cae4db' }}>
        <Sider
          width={400}
          collapsible={false}
          breakpoint="md"
          collapsedWidth="0"
          style={{
            overflowY: 'auto',
            height: '100%',
            color: '#cae4db',
            backgroundColor: '#cae4db'
          }}
        >
          <SiderMenu />
        </Sider>

        {pageState === "request" ? (
          <Layout style={{ padding: '0 24px 24px', width: '70vw', height: '100%', background: '#d9ebe5' }}>
            <div style={{ marginTop: '16px' }}>
              <BreadCrumb />
            </div>
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
                value={RequestInputs.method}
                onChange={(value) => RequestInputs.setMethod(value)}
                style={{
                  width: 120,
                }}
                options={[
                  { value: 'GET', label: 'GET' },
                  { value: 'POST', label: 'POST' },
                  { value: 'PUT', label: 'PUT' },
                  { value: 'PATCH', label: 'PATCH' },
                  { value: 'DELETE', label: 'DELETE' },
                  { value: 'HEAD', label: 'HEAD' },
                  { value: 'OPTIONS', label: 'OPTIONS' },
                ]}
              />

              {/* URL Input */}
              <Input placeholder="URL" value={RequestInputs.url} onChange={(e) => RequestInputs.setUrl(e.target.value)} />


              {/* Send Button */}
              <Button
                onClick={(e) => {
                  e.currentTarget.blur();
                  createParamRequest();
                }}
                className="sendButton"
              >
                Send
              </Button>
            </div>

            <Splitter
              layout="vertical"
              style={{
                height: '100vh',
                background: '#d9ebe5',
                overflow: 'hidden',
              }}
            >
              {/* Block of request */}
              <Splitter.Panel
                defaultSize="50%"
                min="5%"
                max="93%"
                // Get clientHeight of panel
                ref={requestPanelRef}
                style={{
                  background: '#d9ebe5',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Flex vertical gap="middle">
                  <Radio.Group
                    onChange={onChangeResquest}
                    value={selectedRequest}
                    style={{
                      marginBottom: '5px',
                      marginTop: '0px',
                      display: 'flex',
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
                  {selectedRequest === 'param' && <RequestParam />}
                  {selectedRequest === 'headerRequest' && <RequestHeader />}
                  {selectedRequest === 'bodyRequest' && <RequestBody />}
                </div>
              </Splitter.Panel>

              {/* Block of response */}
              <Splitter.Panel
                // Get clientHeight of panel
                ref={responsePanelRef}
                style={{
                  background: '#d9ebe5',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Flex vertical gap="middle">
                  <Radio.Group
                    onChange={onChangeResponse}
                    value={selectedResponse}
                    style={{
                      marginBottom: '5px',
                      marginTop: '15px',
                      display: 'flex',
                    }}
                  >
                    <Radio.Button value="headerResponse" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                      Header
                    </Radio.Button>
                    <Radio.Button value="bodyResponse" style={{ flex: 0.1, textAlign: 'center' }} className="custom-radio-button">
                      Body
                    </Radio.Button>

                    {ResponseData.code !== null && ResponseData.code !== undefined && (
                      <Radio.Button
                        value="codeResponse"
                        style={{ flex: 0.1, textAlign: 'center' }}
                        className="custom-radio-button-code"
                        disabled
                      >
                        <Badge
                          color={ResponseData.code >= 0 && ResponseData.code <= 399 ? 'green' : 'red'}
                          style={{ marginRight: 8 }}
                          text={`code: ${ResponseData.code}`}
                        />
                      </Radio.Button>
                    )}
                  </Radio.Group>
                </Flex>

                <div style={{ flex: 1, overflow: 'auto' }}>
                  {selectedResponse === 'headerResponse' && <ResponseHeader />}
                  {selectedResponse === 'bodyResponse' && <ResponseBody />}
                </div>
              </Splitter.Panel>
            </Splitter>
          </Layout>
        ) : pageState === "workspaces" ? (
          <div>
            <div>These are the workspaces you work on:</div>
            <ul>
              {workspaceNames.map((workspace, index) => (
                <li key={index}>{workspace}</li>
              ))}
            </ul>
          </div>
        ) : pageState === "workspace" ? (
          <div>
            <div>Placeholder description for the workspace</div>
            <div>Collaborators:</div>
            <ul>
              {collaborators.collaboratorsWorkspace.map((collaborator, index) => {
                let privilegeLabel = '';
                if (collaborator.privilege === 30) {
                  privilegeLabel = 'Admin';
                } else if (collaborator.privilege === 20) {
                  privilegeLabel = 'Editor';
                } else if (collaborator.privilege === 10) {
                  privilegeLabel = 'Viewer';
                }

                return (
                  <li key={index}>
                    {collaborator.username} - Privilege: {privilegeLabel}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : pageState === "collection" ? (
          <div>collection</div>
        ) : (
          <div></div>
        )}

      </Layout>
    </Layout>
  );
};
export default Accueil;
