import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './ChangerMotDePasse.css'

const ChangerMotDePasse = () => {

  return (
    <div className='global'>
      <div className='login-box'>
        <h1 className='title'>QueryBox</h1>
        <h2 className='subtitle'>Changer votre mot de passe</h2>
        <Form name="changePassword" initialValues={{ remember: true }} layout="vertical">
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: 'Veuillez entrer votre nouveau mot de passe!' }]}
            className="custom-form-item"
          >
            <Input.Password
              prefix={<UserOutlined />}
              placeholder="Nouveau mot de passe"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            name="repeatPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
