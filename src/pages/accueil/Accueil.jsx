import React, { useState, useEffect } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Flex, Splitter, Radio } from 'antd';
import RequestParam from './request_param.jsx';
import RequestHeader from './request_header.jsx';
import RequestBody from './request_body.jsx';
import ResponseHeader from './response_header.jsx';
import ResponseBody from './response_body.jsx';
import SiderMenu from './sider_menu.jsx';

// Overall page layout
const { Header, Content, Sider } = Layout;

// Function application
const Accueil = () => {
  // State variables
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
  useEffect(() => {
    document.body.style.fontFamily = "'Roboto', sans-serif";
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.setProperty('color-scheme', 'light');
  }, []);

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
export default Accueil;