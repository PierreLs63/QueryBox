import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import './App.css'; // Import the CSS below

const SignupPage = () => {
  const onFinish = (values) => {
    console.log('Form Values:', values);
    // Add your signup logic here
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">QUERYBOX</h1>
        <h2 className="signup-subtitle">Inscription</h2>
        <Form
          name="signup"
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
            name="email"
            rules={[
              { required: true, message: 'Veuillez entrer votre email!' },
              { type: 'email', message: 'Veuillez entrer un email valide!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmation de mot de passe" />
          </Form.Item>

          <div className="already-account">
            <span>Déjà un compte ? <a href="#">Se connecter</a></span>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size='large' block style={{ borderRadius: '24px' }}>
              S'inscrire
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
};

export default SignupPage;
