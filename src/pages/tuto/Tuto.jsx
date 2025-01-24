import React, { useState, useRef, useEffect } from 'react';
import { UsergroupAddOutlined, BellOutlined, SettingOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Button, Radio, Tour, Splitter, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import RequestParam from '../../components/request_param';
import RequestHeader from '../../components/request_header';
import RequestBody from '../../components/request_body';
import ResponseHeader from '../../components/response_header';
import ResponseBody from '../../components/response_body';
import SiderMenu from '../../components/sider_menu';
import './Tuto.css'

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
      title: 'Cliquer le menu pour voir plus de détailles sur Workspace/Collection/History/Request.'
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
            backgroundColor: 'transparent',
            borderColor: 'rgb(34, 56, 51)',
            borderWidth: '2px',
            color: 'rgb(28, 41, 38)',
            height: '31px',
            fontWeight: 'bold'
          }}>Relire le tuto utilisation</Button>
        <Button 
          style={{
            backgroundColor: 'transparent',
            borderColor: 'rgb(34, 56, 51)',
            borderWidth: '2px',
            color: 'rgb(28, 41, 38)',
            height: '31px',
            fontWeight: 'bold'
          }}
          onClick={handleAccueil}>
            Commencer votre premier essai
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button
            type="text"
            icon={<UserOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<TeamOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<UsergroupAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<BellOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<SettingOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
            style={{ padding: 0 }}
          />
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
            <Button type="default">Send</Button>
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
                    style={{
                      marginBottom: '5px',
                      marginTop: '0px',
                      display: 'flex'
                    }}
                  >
                    <Radio.Button
                      value="param"
                      style={{
                        flex: 0.1,
                        textAlign: 'center'
                      }}
                      className="custom-radio-button"
                      >Param</Radio.Button>
                    <Radio.Button
                      value="headerRequest"
                      style={{
                        flex: 0.1,
                        textAlign: 'center'
                      }}
                      className="custom-radio-button"
                      >Header</Radio.Button>
                    <Radio.Button
                      value="bodyRequest"
                      style={{
                        flex: 0.1,
                        textAlign: 'center'
                      }}
                      className="custom-radio-button"
                      >Body</Radio.Button>
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
                    style={{
                      marginBottom: '5px',
                      marginTop: '15px',
                      display: 'flex'
                    }}>
                    <Radio.Button
                      value="headerResponse"
                      style={{
                        flex: 0.1,
                        textAlign: 'center'
                      }}
                      className="custom-radio-button"
                      >Header</Radio.Button>
                    <Radio.Button
                      value="bodyResponse"
                      style={{
                        flex: 0.1,
                        textAlign: 'center'
                      }}
                      className="custom-radio-button"
                      >Body</Radio.Button>
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
