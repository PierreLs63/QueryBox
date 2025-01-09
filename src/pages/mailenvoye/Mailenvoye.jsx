import { useEffect }  from 'react';
import { Button } from 'antd';
import useResendEmail from '../../hooks/auth/useResendEmail';

const Mailenvoye = () => {
  const {resendMail} = useResendEmail();

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
        Un mail vous a été envoyé pour confirmer votre inscription.
      </div>
      <Button
        type="primary"
        style={styles.button}
        onClick={resendMail}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Renvoyer le mail
      </Button>
    </div>
  );
};

export default Mailenvoye;
