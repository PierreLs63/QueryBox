import { Button } from 'antd';
import useResendEmail from '../../hooks/auth/useResendEmail';
import './Mailenvoye.css'

const Mailenvoye = () => {
  const {resendMail} = useResendEmail();

  return (
    <div className='global'>
      <div className='logo'>
        QueryBox
      </div>
      <div className='message'>
        Un mail vous a été envoyé pour confirmer votre inscription.
      </div>
      <Button
        type="primary"
        className='button'
        onClick={resendMail}
      >
        Renvoyer le mail
      </Button>
    </div>
  );
};

export default Mailenvoye;
