import React, {useState} from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useAuthContext } from '../../src/context/AuthContext';
import useLogout from '../../src/hooks/auth/useLogout';
import useSendResetPassword from '../../src/hooks/auth/useSendResetPassword';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { logout } = useLogout();
  const { authUser, setAuthUser } = useAuthContext();
  const [popoverContentType, setPopoverContentType] = useState('menu');
  const { sendResetPassword } = useSendResetPassword();

  const handleMenuClick = (action) => {
    if (action === 'profil') {
      setPopoverContentType('profil');
    } else if (action === 'logout') {
      logout();
    }
  };

  const handleBackClick = () => {
    setPopoverContentType('menu');
  };

  const handleInitialisePassword = async () => {
    await sendResetPassword(authUser.email);
  };


  const popoverContent = popoverContentType === 'menu' ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center'
      }}
    >
      <Button
        type="primary" block
        onClick={() => handleMenuClick('profil')}
      >
        Profil
      </Button>
      <Button danger block
        onClick={() => handleMenuClick('logout')}
        
      >
        Déconnexion
      </Button>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {authUser && (
        <>
          <div style={{ marginLeft:'8px' }}>
            <p><strong>User name :</strong> {authUser.username}</p>
            <p><strong>Email :</strong> {authUser.email}</p>
          </div>
          <Button danger block
            type="primary"
            onClick={() => handleInitialisePassword()}
          >
            Réinitialiser mot de passe
          </Button>
          <Button danger block
            onClick={handleBackClick}
          >
            Retour
          </Button>
        </>
      )}
    </div>
  );


  return (
    <Popover
      content={popoverContent}
      title={<div style={{ textAlign: 'center', width: '100%' }}>Account</div>}
      trigger="click"
    >
      <Button
        type="text"
        icon={<UserOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }}
        aria-label="User account" />}
      />
    </Popover>
  );
};

export default Account;
