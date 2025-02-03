import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Mailverifie.css'

const Mailverifie = () => {
  // Navigate to debutant
  const navigate = useNavigate();
  const handleMailVerifie = () => {
    navigate('/debutant');
  };
  
  return (
    <div className='global'>
      <div className='logo'>
        QueryBox
      </div>
      <div className='message'>
        Votre mail a bien été validé.
      </div>
      <Button
        type="primary"
        className='button'
        onClick={handleMailVerifie}
      >
        Aller à la page d'accueil
      </Button>
    </div>
  );
};

export default Mailverifie;
