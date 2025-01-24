import React, {useState} from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useAuthContext } from '../../src/context/AuthContext';
import useLogout from '../../src/hooks/auth/useLogout';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { logout } = useLogout();
  const { authUser, setAuthUser } = useAuthContext();
  const [popoverContentType, setPopoverContentType] = useState('menu');

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

  const navigate = useNavigate();
  const handleInitialisePassword = () => {
    navigate('/reinitialiser')};


  const popoverContent = popoverContentType === 'menu' ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Button
        type="text"
        onClick={() => handleMenuClick('profil')}
        style={{
          width: '90%',
          border: '1px solid black',
          borderRadius: '4px',
          margin: '4px 0',
          textAlign: 'center',
        }}
      >
        Profil
      </Button>
      <Button
        type="text"
        onClick={() => handleMenuClick('logout')}
        style={{
          width: '90%',
          border: '1px solid black',
          borderRadius: '4px',
          margin: '4px 0',
          textAlign: 'center',
        }}
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
      }}
    >
      {authUser && (
        <>
          <div style={{ marginBottom: '8px', marginLeft:'8px' }}>
            <p><strong>User name:</strong> {authUser.username}</p>
            <p><strong>Email:</strong> {authUser.email}</p>
          </div>
          <Button
            type="text"
            onClick={() => handleInitialisePassword()}
            style={{
                width: '90%',
                border: '1px solid black',
                borderRadius: '4px',
                margin: '4px 0',
                textAlign: 'center',
            }}
          >
            Réinitialiser mot de passe
          </Button>
          <Button
            type="text"
            onClick={handleBackClick}
            style={{
              width: '90%',
              border: '1px solid black',
              borderRadius: '4px',
              margin: '4px 0',
              textAlign: 'center',
            }}
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
