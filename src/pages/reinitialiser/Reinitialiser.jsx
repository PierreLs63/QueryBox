import React, { useEffect }  from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Reinitialiser = () => {
  const handleResendEmail = () => {
    console.log('Renvoyer le mail');
  };

  // Navigate to connection if already change password
    const navigate = useNavigate();
    const handleReconnection = () => {
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
      margin: '0',
      padding: '0',
      boxSizing: 'border-box',
      height: '100vh',
      backgroundColor: '#e6f7ff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    logo: {
      fontFamily: 'Monofett',
      fontSize: '70px',
      fontWeight: 'bold',
      color: '#1890FF',
      marginBottom: '30px',
    },
    message: {
      fontSize: '20px',
      color: '#060606',
      marginBottom: '30px',
      textAlign: 'center',
    },
    button: {
      borderRadius: '24px',
      backgroundColor: '#1890FF',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      margin: '20px'
    },
    buttonHover: {
      backgroundColor: '#106cc8',
    },
  };

  return (
    <div style={styles.global}>
      <div style={styles.logo}>
        QueryBox
      </div>
      <div style={styles.message}>
        Un mail vous a été envoyé pour réinitialiser votre mot de passe.
      </div>

      <Button
        type="primary"
        style={styles.button}
        onClick={handleResendEmail}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Renvoyer le mail
      </Button>

      <Button
      type="default"
      style={styles.button}
      onClick={handleReconnection}
      onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
      onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
    >
      Revenir à la page de connexion
    </Button>
    </div>
  );
};

export default Reinitialiser;