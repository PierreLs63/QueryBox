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
import Account from '../../components/account'
import './Accueil.css';

import { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, Radio, Flex, Splitter, Select, Badge, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import useCollaborateurs from '../../hooks/workspace/useCollaborateurs';
import useInvite from '../../hooks/workspace/useInvite';
import useRequestInputStore from '../../zustand/RequestInput';
import useResponseDataStore from '../../zustand/ResponseData';
import useCreateParamRequest from '../../hooks/requests/useCreateParamRequest';
import useCurrentState from '../../zustand/CurrentState';
import useGetLastParamRequest from '../../hooks/requests/useGetLastParamRequest';
import useWorkspaces from '../../hooks/workspace/useWorkspaces';
import useCollaboratorsDataStore from '../../zustand/Collaborators';
import useGetResponse from '../../hooks/response/useGetResponse';


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
  const { getResponse } = useGetResponse();


  // Récupérer les collaborateurs lors du montage du composant
  useEffect(() => {
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
              description: item.description
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
          ResponseData.setHeader([]);
          ResponseData.setBody("");

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
          if (CurrentState.responseId === null){
            setpageState("workspace");
          }
          else{

            const { success, paramResponse, paramRequest } = await getResponse(CurrentState.responseId);
            RequestInputs.setMethod(paramRequest.method);
            RequestInputs.setUrl(paramRequest.url);
            RequestInputs.setParams(paramRequest.parameters);

            //Adds key element to headers from paramrequest
            const formattedHeaders = paramRequest.header.map((item, index) => ({
              key: String(index),
              keyData: item.keyData,
              value: item.value,
              description: item.description
            }));

            RequestInputs.setHeaders(formattedHeaders);
            RequestInputs.setBody(paramRequest.body);

            if (success) {
              setpageState("history");
            }

            const formattedHeadersResponse = paramResponse.header.map((item, index) => ({
              key: String(index),
              keyData: item.keyData,
              value: item.value,
            }));
            

            setSelectedRequest("param");
            setSelectedResponse("headerResponse");
            ResponseData.setCode(paramResponse.code);
            ResponseData.setHeader(formattedHeadersResponse);
            ResponseData.setBody(paramResponse.body);

          }

        }
        else if (CurrentState.requestId === null){
          setpageState("collection");
        }
      }
    };
  
    fetchLastParam();
  }, [CurrentState.workspaceId, CurrentState.collectionId, CurrentState.requestId, CurrentState.responseId]);


  // Event of request checked
  const onChangeRequest = (e) => {
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


  const prepareWorkspaceList = async () => {
    try {
      const workspaces = await getWorkspaces();
      setWorkspaceNames(workspaces.map(workspace => workspace.name));
    } catch (error) {
      console.error("Error fetching workspace name:", error);
    }
  };
  
  useEffect(() => {
    prepareWorkspaceList();
  }, [CurrentState.workspaceId]);


  return (
    <Layout style={{ height: '100vh', width: '100vw', background: '#d9ebe5', overflowY: 'hidden' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#B4CDC4' }}>
        {/* QueryBox */}
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>

        {/* Welcome Message */}
        <div style={{ fontSize: '20px', color: 'rgb(28, 41, 38)', fontWeight: 'bold' }}>Bienvenue sur QueryBox !</div>

        {/* Icons and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Account with Profil and Deconnexion */}
          <Account />

          {/* Collaborateur Button with Popover for user list */}
          <CollaboratorMenu loading={loadingCollaborateurs} error={errorCollaborateurs} />

          {/* User Add Icon with Popover for user invite */}
          <InviteMenu inviteUsername={inviteUsername} setInviteUsername={setInviteUsername} invitePrivilege={invitePrivilege} setInvitePrivilege={setInvitePrivilege} invite={invite} />

          {/* Bell Icon with Popover for Notifications */}
          <NotificationMenu  />
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

        {pageState === "request" || pageState === "history"? (
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
                disabled={pageState === "history"}
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
              <Input 
                placeholder="URL" 
                value={RequestInputs.url} 
                onChange={(e) => RequestInputs.setUrl(e.target.value)} 
                disabled={pageState === "history"}
              />

              {/* Send Button */}
              {pageState !== "history" && (
                <Button
                  type="default"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    createParamRequest();
                  }}
                >
                  Send
                </Button>
              )}

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
                    onChange={onChangeRequest}
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            background: '#d9ebe5',
          }}>
            <Card
              style={{
                width: '100%',
                maxWidth: '600px',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#e8f0ed',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                height: '50%',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ marginBottom: '16px', color: '#333', fontSize: '24px' }}>Your Workspaces</h2>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {workspaceNames.length > 0 ? (
                  workspaceNames.map((workspace, index) => (
                    <li
                      key={index}
                      style={{
                        padding: '10px',
                        borderBottom: index !== workspaceNames.length - 1 ? '1px solid #ddd' : 'none',
                        fontSize: '16px'
                      }}
                    >
                      {workspace}
                    </li>
                  ))
                ) : (
                  <p style={{ color: '#888' }}>No workspaces found.</p>
                )}
              </ul>
            </Card>
          </div>

        ) : pageState === "workspace" ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            background: '#d9ebe5',
          }}>
            <Card
              style={{
                width: '100%',
                maxWidth: '600px',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#e8f0ed',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ marginBottom: '16px', color: '#333', fontSize: '24px' }}>
                {CurrentState.workspaceName || "Loading..."}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {collaborators.collaboratorsWorkspace.map((collaborator, index) => {
                  let privilegeLabel = '';
                  let usernameColor = '';
                  if (collaborator.privilege === 30) {
                    privilegeLabel = 'Owner';
                    usernameColor = 'blue';
                  } else if (collaborator.privilege === 20) {
                    privilegeLabel = 'Admin';
                    usernameColor = 'red';
                  } else if (collaborator.privilege === 10) {
                    privilegeLabel = 'Viewer';
                    usernameColor = 'green';
                  }

                  return (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ marginRight: '4px', color: '#777', fontSize: '16px', fontWeight: 'bold' }}>
                        {collaborator.username}
                      </span>
                      <span style={{ margin: '0 4px', color: 'black' }}>-</span>
                      <span style={{ margin: '0 4px', color: 'black', fontSize: '16px' }}>Privilege: </span>
                      <span style={{ color: usernameColor, fontSize: '16px' }}>{privilegeLabel}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

        ) : pageState === "collection" ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            background: '#d9ebe5',
          }}>
            <Card
              style={{
                width: '100%',
                maxWidth: '600px',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#e8f0ed',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ marginBottom: '16px', color: '#333', fontSize: '24px' }}>
                {CurrentState.collectionName || "Loading..."}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {collaborators.collaboratorsWorkspace.map((collaborator, index) => {
                  let privilegeLabel = '';
                  let usernameColor = '';
                  if (collaborator.privilege === 30) {
                    privilegeLabel = 'Owner';
                    usernameColor = 'blue';
                  } else if (collaborator.privilege === 20) {
                    privilegeLabel = 'Admin';
                    usernameColor = 'red';
                  } else if (collaborator.privilege === 10) {
                    privilegeLabel = 'Viewer';
                    usernameColor = 'green';
                  }

                  return (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ marginRight: '4px', color: '#777', fontSize: '16px', fontWeight: 'bold' }}>
                        {collaborator.username}
                      </span>
                      <span style={{ margin: '0 4px', color: 'black' }}>-</span>
                      <span style={{ margin: '0 4px', color: 'black', fontSize: '16px' }}>Privilege: </span>
                      <span style={{ color: usernameColor, fontSize: '16px' }}>{privilegeLabel}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        ) : (
          <div></div>
        )}

      </Layout>
    </Layout>
  );
};
export default Accueil;
