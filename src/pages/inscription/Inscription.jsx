import React, { useEffect }  from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  // Navigate to connection if have account
  const navigate = useNavigate();
  const handleHaveAccount = () => {
    navigate('/connexion');
  };

  //Change default param from index.css
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.backgroundColor = '#e6f7ff';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
  }, []);


  const styles = {
    global: {
      margin: 'auto',
      padding: 0,
      boxSizing: 'border-box',
      height: '100%',
      backgroundColor: '#e6f7ff',
    },
    signupContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#e6f7ff',
    },
    signupBox: {
      width: '400px',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      textAlign: 'center',
    },
    signupSubtitle: {
      color: '#060606',
      fontSize: '20px',
      marginBottom: '20px',
    },
    alreadyAccount: {
      fontSize: '14px',
      color: 'black',
      marginTop: '-16px',
      marginBottom: '10px',
      textAlign: 'left',
    },
    alreadyAccountLink: {
      color: '#1890ff',
      textDecoration: 'none',
    },
    alreadyAccountLinkHover: {
      textDecoration: 'underline',
    },
    button: {
      borderRadius: '24px',
    },
  };

  return (
    <div style={styles.global}>
      <div style={styles.signupContainer}>
        <div style={styles.signupBox}>
          <h1
            style={{
              fontFamily: 'Monofett',
              fontSize: '70px',
              fontWeight: 'bold',
              color: '#1890FF',
              marginBottom: 30,
            }}
          >
            QueryBox
          </h1>
          <h2 style={styles.signupSubtitle}>Inscription</h2>
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

            <div style={styles.alreadyAccount}>
              <span>
                Déjà un compte ?{' '}
                <a
                  style={styles.alreadyAccountLink}
                  onClick={handleHaveAccount}
                  onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Se connecter
                </a>
              </span>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={styles.button}
              >
                S'inscrire
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
