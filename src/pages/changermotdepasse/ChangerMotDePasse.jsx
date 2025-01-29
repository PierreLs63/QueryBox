import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useCheckTokenPassword from '../../hooks/auth/useCheckTokenPassword';
import useResetPassword from '../../hooks/auth/useResetPassword';
import './ChangerMotDePasse.css'

const ChangerMotDePasse = () => {
  const { authUser } = useAuthContext();
  const { checkTokenPassword } = useCheckTokenPassword();
  const {resetPassword} = useResetPassword();
  const navigate = useNavigate();
  const { token } = useParams();
  const [form] = Form.useForm();


  useEffect(() => {
    const checkToken = async () => {
      const validToken = await checkTokenPassword(token);
      if (!validToken) {
        authUser ? navigate('/accueil') : navigate('/connexion');
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async (values) => {
    const validPassword = await resetPassword(token, values.password, values.confirmPassword);
    if (validPassword) {
      authUser ? navigate('/accueil') : navigate('/connexion');
      return;
    }
  }

  return (
    <div className='global'>
      <div className='login-box'>
        <h1 className='title'>QueryBox</h1>
        <h2 className='subtitle'>Changer votre mot de passe</h2>
        <Form name="changePassword" form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre nouveau mot de passe!' }, { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères !' }]}
            className="custom-form-item"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nouveau mot de passe"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les deux saisies ne correspondent pas!'));
                },
              }),
            ]}
            className="custom-form-item"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Saisir à nouveau"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className='button'
            >
              Confirmer
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangerMotDePasse;
