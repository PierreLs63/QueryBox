import React, { useState, useRef, useEffect } from 'react';
import { UserAddOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Button, Radio, Tour, Splitter, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import RequestParam from '../../../public/components/request_param.jsx';
import RequestHeader from '../../../public/components/request_header.jsx';
import RequestBody from '../../../public/components/request_body.jsx';
import ResponseHeader from '../../../public/components/response_header.jsx';
import ResponseBody from '../../../public/components/response_body.jsx';
import SiderMenu from '../../../public/components/sider_menu.jsx';

const { Header, Sider } = Layout;

const Tuto = () => {
  const [selectedRequest, setSelectedRequest] = useState("param");
  const [selectedResponse, setSelectedResponse] = useState("headerResponse");
  const [open, setOpen] = useState(false);

  // Ref for targeting specific elements
  const menuRef = useRef(null);
  const methodRef = useRef(null);
  const requestRef = useRef(null);
  const responseRef = useRef(null);

  // Navigate to accueil
  const navigate = useNavigate();
  const handleAccueil = () => {
    navigate('/accueil');
  };
  

  useEffect(() => {
    document.body.style.fontFamily = "'Roboto', sans-serif";
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.setProperty('color-scheme', 'light');

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
    <Layout style={{ height: '100vh', width: '100vw', background: '#d9ebe5', overflowY: 'hidden' }}>
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
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 50px 0px 90px', backgroundColor: '#B4CDC4' }}>
        <div style={{ fontFamily: 'Monofett', fontSize: '45px', fontWeight: 'bold', color: '#54877c' }}>QueryBox</div>
        <Button 
          onClick={() => setOpen(true)}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: 'black',
            border: '1px solid #54877c',
            borderRadius: '4px'
          }}>Relire le tuto utilisation</Button>
        <Button 
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: 'black',
            border: '1px solid #54877c',
            borderRadius: '4px'
            }}
          onClick={handleAccueil}>
            Commencer votre premier essai
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <UserAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />
          <BellOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />
          <SettingOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />
        </div>
      </Header>
      
      <Layout style={{ height: '100%', width: '100%', background: '#d9ebe5' }}>
        <Sider width={400}
          collapsible={false} // disable collapse
          breakpoint="md"
          collapsedWidth="0"
          style={{
            background: '#d9ebe5',
            overflowY: 'scroll',
            height: '100%',
          }}>
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

            <Splitter layout="vertical" style={{ height: '100vh', background: '#d9ebe5', overflow: 'hidden' }}>
              {/* Request Block */}
              <Splitter.Panel
                style={{
                  height: '50%',
                  background: "#d9ebe5",
                  overflow: 'hidden'
                }}>
                <div ref={requestRef}>
                  <Radio.Group
                    onChange={(e) => setSelectedRequest(e.target.value)}
                    defaultValue="param"
                    style={{ marginBottom: '5px' }}
                  >
                    <Radio.Button
                      value="param"
                      style={{
                        border: '1px solid #54877c',
                      }}>Param</Radio.Button>
                    <Radio.Button
                      value="headerRequest"
                      style={{
                        border: '1px solid #54877c',
                      }}>Header</Radio.Button>
                    <Radio.Button
                      value="bodyRequest"
                      style={{
                        border: '1px solid #54877c',
                      }}>Body</Radio.Button>
                  </Radio.Group>
                  {selectedRequest === "param" && <RequestParam />}
                  {selectedRequest === "headerRequest" && <RequestHeader />}
                  {selectedRequest === "bodyRequest" && <RequestBody />}
                </div>
              </Splitter.Panel>

              {/* Response Block */}
              <Splitter.Panel
                style={{
                  height: '50%',
                  background: "#d9ebe5",
                  overflow: 'hidden'
                }}>
                <div ref={responseRef}>
                  <Radio.Group
                    onChange={(e) => setSelectedResponse(e.target.value)}
                    defaultValue="headerResponse"
                    style={{ marginBottom: '5px', marginTop: '15px' }}>
                    <Radio.Button
                      value="headerResponse"
                      style={{
                        border: '1px solid #54877c',
                      }}>Header</Radio.Button>
                    <Radio.Button
                      value="bodyResponse"
                      style={{
                        border: '1px solid #54877c',
                      }}>Body</Radio.Button>
                  </Radio.Group>
                  {selectedResponse === "headerResponse" && <ResponseHeader />}
                  {selectedResponse === "bodyResponse" && <ResponseBody text="here is an example to test" />}
                </div>
              </Splitter.Panel>
            </Splitter>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Tuto;
