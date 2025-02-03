import React, { useEffect }  from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Reinitialiser.css'

const Reinitialiser = () => {
  const handleResendEmail = () => {
    console.log('Renvoyer le mail');
  };

  // Navigate to connection if already change password
    const navigate = useNavigate();
    const handleReconnection = () => {
      navigate('/connexion');
    };

  return (
    <div className='global'>
      <div className='logo'>
        QueryBox
      </div>
      <div className='message'>
        Un mail vous a été envoyé pour réinitialiser votre mot de passe.
      </div>

      <Button
        type="primary"
        className='button'
        onClick={handleResendEmail}
      >
        Renvoyer le mail
      </Button>

      <Button
        type="default"
        className='button'
        onClick={handleReconnection}
      >
        Revenir à la page de connexion
      </Button>
    </div>
  );
};

export default Reinitialiser;
