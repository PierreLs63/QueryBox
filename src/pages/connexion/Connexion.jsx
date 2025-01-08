import { useEffect }  from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLogin from '../../hooks/auth/useLogin';
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
  const {loading, login} = useLogin();
  const onFinish = (values) => {
    login(values.username, values.password);
  };

  const navigate = useNavigate();

  // Navigate to reinitialiser if forget password
  const handleForgotPassword = () => {
    navigate('/reinitialiser');
  };

  // Navigate to inscription if not have password
  const handleNotHaveAccount = () => {
    navigate('/inscription');
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
      margin: '0',
      padding: '0',
      boxSizing: 'border-box',
      height: '100vh',
      backgroundColor: '#e6f7ff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginBox: {
      width: '400px',
      padding: '30px',
      borderRadius: '8px',
      textAlign: 'center',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontFamily: 'Monofett',
      fontSize: '70px',
      fontWeight: 'bold',
      color: '#1890FF',
      marginBottom: '20px',
    },
    subtitle: {
      color: '#060606',
      fontSize: '20px',
      marginBottom: '20px',
    },
    forgotPassword: {
      textAlign: 'left',
      marginBottom: '10px',
    },
    notHaveAccount: {
      textAlign: 'left',
      marginBottom: '10px',
    },
    link: {
      color: '#1890ff',
      textDecoration: 'none',
    },
    button: {
      borderRadius: '24px',
      backgroundColor: '#1890FF',
      borderColor: '#1890FF',
    },
  };

  return (
    <div style={styles.global}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>QueryBox</h1>
        <h2 style={styles.subtitle}>Connexion</h2>
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
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

          <div style={styles.forgotPassword}>
            <a 
              style={styles.link} 
              onClick={handleForgotPassword}
              onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}>
              Mot de passe oublié ?
            </a>
          </div>

          <div style={styles.notHaveAccount}>
            <a 
              style={styles.link} 
              onClick={handleNotHaveAccount}
              onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}>
              Pas encore de compte ?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={styles.button}
              disabled={loading}
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Connexion;
