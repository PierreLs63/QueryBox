import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLogin from '../../hooks/auth/useLogin';
import { useNavigate } from 'react-router-dom';
import './Connexion.css'

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


  return (
    <div className='global'>
      <div className='login-box'>
        <h1 className='title'>QueryBox</h1>
        <h2 className='subtitle'>Connexion</h2>
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Veuillez entrer votre pseudonyme!' }]}
            className="custom-form-item"
          >
            <Input prefix={<UserOutlined />} placeholder="Pseudonyme" className="custom-input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
            className="custom-form-item"
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" className="custom-input" />
          </Form.Item>

          <div className="forgot-password">
            <a 
              className="link" 
              onClick={handleForgotPassword}
              onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}>
              Mot de passe oublié ?
            </a>
          </div>

          <div className="not-have-account">
            <a 
              className="link"
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
              disabled={loading}
              className='button'
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
