import React, { useState } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined, UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Flex, Splitter, Radio } from 'antd';
import RequestParam from './request_param.jsx';
import RequestHeader from './request_header.jsx';
import RequestBody from './request_body.jsx';
import ResponseHeader from './response_header.jsx';
import ResponseBody from './response_body.jsx';
import './App.css';


// Overall page layout
const { Header, Content, Sider } = Layout;

// initial items of Sider
const initialItems = [
  {
    key: 'account',
    icon: <UserOutlined />,
    label: 'Account',
    children: [
      { key: 'profil', label: 'Profil'},
      { key: 'deconnecter', label: 'Déconnecter' }
    ],
  },
  {
    key: 'workspace',
    icon: <DesktopOutlined />,
    label: 'Workspace',
    children: [{ key: 'workspace:1', label: 'Workspace 1' }],
  },
  {
    key: 'collection',
    icon: <FileOutlined />,
    label: 'Collection',
    children: [{ key: 'collection:1', label: 'Collection 1' }],
  },
  {
    key: 'history',
    icon: <HistoryOutlined />,
    label: 'History',
    children: [{ key: 'history:1', label: 'History 1' }],
  },
];

// Function application
const App = () => {
  // State variables for managing menu items, submenu counter and selected ratiobox
  const [menuItems, setMenuItems] = useState(initialItems);
  const [subMenuCounter, setSubMenuCounter] = useState(2);
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");

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
    value: `Value ${i}`
  }));

  // Add submenu method
  const addSubMenu = (key, event) => {
    event.stopPropagation(); // Prevent menu collapse/expand
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === key
          ? {
              ...item,
              children: [
                ...item.children,
                { key: `${key}:${subMenuCounter}`, label: `${item.label} ${subMenuCounter}` },
              ],
            }
          : item
      )
    );
    setSubMenuCounter((prevCounter) => prevCounter + 1);
  };

  // Delete submenu method
  const deleteSubMenu = (parentKey, subKey, event) => {
    event.stopPropagation(); // Prevent menu collapse/expand
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === parentKey
          ? {
              ...item,
              children: item.children.filter((child) => child.key !== subKey),
            }
          : item
      )
    );
  };

  return (
    <Layout style={{ height: '100%', width: '100%', background: '#d9ebe5' }}>
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

      <Layout>
        <Sider
          width={400}
          collapsible={false} // disable collapse
          breakpoint="md"
          collapsedWidth="0"
          style={{
            background: '#ebf9f4',
            overflowY: 'auto',
            height: '100vh',
          }}
        >
          <Menu
            mode="inline"
            items={menuItems.map((item) => ({
              ...item,
              children: item.children?.map((child) => ({
                ...child,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{child.label}</span>
                    {item.key !== 'account' && (
                      <CloseOutlined
                      style={{ color: 'red', cursor: 'pointer', marginLeft: '8px' }}
                      onClick={(event) => deleteSubMenu(item.key, child.key, event)} // Delete submenu
                      />
                    )}
                  </div>
                ),
              })),
              label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.label}</span>
                  {item.key !== 'account' && (
                    <Button 
                      size="small"
                      onClick={(event) => addSubMenu(item.key, event)}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#54877c',
                        color: 'black'
                      }}>
                      Ajouter +
                    </Button>
                  )}
                </div>
              ),
            }))}
            style={{ height: '100%', borderRight: 0, paddingTop: '15px', paddingBottom: '20px', background: '#ebf9f4' }}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px', width: '100%', background: '#d9ebe5' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '16px 0',
          }}
        >
          {/* Method Dropdown */}
          <select
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #54877c',
              background: '#fff',
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>

          {/* URL Input */}
          <input
            type="text"
            placeholder="URL:"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #54877c',
            }}
          />

          {/* Send Button */}
          <button
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'black',
              border: '1px solid #54877c',
              borderRadius: '4px'
            }}
          >
            Send
          </button>
        </div>

          <Content
            style={{
              padding: 24,
              margin: 0,
              background: "#c7dbd5",
              borderRadius: '10px',
              overflowY: 'hidden'
            }}
          >
            <Splitter
              layout="vertical"
              style={{
                height: '100vh',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                background: "#d9ebe5",
                overflow: 'hidden',
                borderRadius: '10px'
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
                      paddingTop: '3px'
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
                      paddingTop: '3px'
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
export default App;