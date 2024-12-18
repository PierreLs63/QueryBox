import React, { useState, useRef, useEffect } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Radio, Tour, Splitter } from 'antd';
import RequestParam from './request_param.jsx';
import RequestHeader from './request_header.jsx';
import RequestBody from './request_body.jsx';
import ResponseHeader from './response_header.jsx';
import ResponseBody from './response_body.jsx';
import SiderMenu from './sider_menu.jsx';
import './Tuto.css';

const { Header, Content, Sider } = Layout;

const Tuto = () => {
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");
  const [open, setOpen] = useState(false);

  // Ref for targeting specific elements
  const menuRef = useRef(null);
  const methodRef = useRef(null);
  const requestRef = useRef(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.classList.add('menu-highlight');
      console.log("menu-highlight added to menuRef");
    }
    if (methodRef.current) {
      methodRef.current.classList.add('method-highlight');
      console.log("method-highlight added to methodRef");
    }
    if (requestRef.current) {
      requestRef.current.classList.add('request-ratio-box');
      console.log("request-ratio-box added to requestRef");
    }
    if (responseRef.current) {
      responseRef.current.classList.add('response-ratio-box');
      console.log("response-ratio-box added to responseRef");
    }

    setOpen(true);
  }, []);

  // Tour steps: use ref as target
  const steps = [
    {
      target: () => menuRef.current,
      title: 'Cliquer Account/Workspace/Collection/History pour voir plus de détailles.'
    },
    {
      target: () => methodRef.current,
      title: 'Choisir votre méthode et mettre votre URL ici, puis cliquer le bouton <send>.'
    },
    {
      target: () => requestRef.current,
      title: 'Modifier ici votre Paramètre/Header/Body des requêtes.'
    },
    {
      target: () => responseRef.current,
      title: 'Cliquer les boutons pour voir Header/Body des réponses.'
    },
  ];

  return (
    <Layout style={{ height: '100vh', background: '#d9ebe5' }}>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />

      {/* Header */}
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#c7dbd5' }}>
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>
        <Button onClick={() => setOpen(true)}>Relire le tuto utilisation</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <UserAddOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          <BellOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
          <SettingOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} />
        </div>
      </Header>
      
      <Layout style={{ height: '100%', width: '100%', background: '#ebf9f4' }}>
        <Sider width={400} style={{ background: '#ebf9f4', overflowY: 'scroll' }}>
          <div ref={menuRef}>
            <SiderMenu />
          </div>
        </Sider>

        <Layout style={{ padding: '0 24px 24px', width: '100vw', height: '100%', background: '#d9ebe5' }}>
          <div
            ref={methodRef}
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
                borderRadius: '4px',
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
              overflowY: 'hidden',
            }}
          >
            <Splitter layout="vertical" style={{ height: '100vh', background: '#d9ebe5', overflow: 'hidden', borderRadius: '10px' }}>
              {/* Request Block */}
              <Splitter.Panel>
                <div ref={requestRef}>
                  <Radio.Group
                    onChange={(e) => setSelectedRequest(e.target.value)}
                    defaultValue="param"
                    style={{ marginBottom: '16px' }}
                  >
                    <Radio.Button value="param">Param</Radio.Button>
                    <Radio.Button value="headerRequest">Header</Radio.Button>
                    <Radio.Button value="bodyRequest">Body</Radio.Button>
                  </Radio.Group>
                  {selectedRequest === "param" && <RequestParam />}
                  {selectedRequest === "headerRequest" && <RequestHeader />}
                  {selectedRequest === "bodyRequest" && <RequestBody />}
                </div>
              </Splitter.Panel>

              {/* Response Block */}
              <Splitter.Panel>
                <div ref={responseRef}>
                  <Radio.Group
                    onChange={(e) => setSelectedResponse(e.target.value)}
                    defaultValue="headerResponse"
                    style={{ marginBottom: '16px' }}
                  >
                    <Radio.Button value="headerResponse">Header</Radio.Button>
                    <Radio.Button value="bodyResponse">Body</Radio.Button>
                  </Radio.Group>
                  {selectedResponse === "headerResponse" && <ResponseHeader />}
                  {selectedResponse === "bodyResponse" && <ResponseBody text="here is an example to test" />}
                </div>
              </Splitter.Panel>
            </Splitter>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Tuto;
