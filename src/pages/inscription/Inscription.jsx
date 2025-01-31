import { Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useSignup from '../../hooks/auth/useSignup';
import './Inscription.css'

const Inscription = () => {
  const { loading, signup } = useSignup();
  const onFinish = (values) => {
    signup(values);
  };

  // Navigate to connection if have account
  const navigate = useNavigate();
  const handleHaveAccount = () => {
    navigate('/connexion');
  };


  return (
    <div className='global'>
      <div className='signup-container'>
        <div className='signup-box'>
          <h1 className='title'>QueryBox</h1>
          <h2 className='signup-subtitle'>Inscription</h2>
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
              <Input prefix={<UserOutlined />} placeholder="Pseudonyme" className="custom-input" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Veuillez entrer votre email!' },
                { type: 'email', message: 'Veuillez entrer un email valide!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" className="custom-input" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }, { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères !' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" className="custom-input" />
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
              <Input.Password prefix={<LockOutlined />} placeholder="Confirmation de mot de passe" className="custom-input" />
            </Form.Item>

            <div className='already-account'>
              <span>
                Déjà un compte ?{' '}
                <a
                  className='already-account-link'
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
                className='button'
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
