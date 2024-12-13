import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './App.css';

const LoginPage = () => {
  
  const onFinish = (values) => {
    console.log('Login Values:', values);
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 style={{ fontFamily: 'Monofett', fontSize: '70px', fontWeight: 'bold', color: '#1890FF', marginBottom: 20 }}>QueryBox</h1>
        <h2 className="login-subtitle">Connexion</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Veuillez entrer votre pseudonyme!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Pseudonyme" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <div className="forgot-password">
            <a href="#">Mot de passe oublié ?</a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ borderRadius: '24px' }}>
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
