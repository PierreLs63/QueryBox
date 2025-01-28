import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ConfirmerMail.css'

const ConfirmerMail = () => {

  return (
    <div className='global'>
      <div className='login-box'>
        <h1 className='title'>QueryBox</h1>
        <h2 className='subtitle'>Réinitialiser le mot de passe</h2>
        <Form name="confirmMail" initialValues={{ remember: true }} layout="vertical">
          <Form.Item
            name="mail"
            rules={[
              { required: true, message: "Veuillez saisir mail utilisé lors de l'inscription!" },
              { type: 'email', message: 'Veuillez entrer un email valide!' },
            ]}
            className="custom-form-item"
          >
            <Input.Password
              prefix={<MailOutlined />}
              placeholder="Mail utilisé lors de l'inscription"
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
              Envoyer le mail
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmerMail;
