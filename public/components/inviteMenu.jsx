import React from 'react';
import { Input, Button, Popover } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const InviteMenu = ({ inviteNickname, setInviteNickname }) => {
  const handleInvite = () => {
    toast.success(`Invite sent to ${inviteNickname} !`);
    setInviteNickname("");
  };

  const inviteContent = (
    <div>
      <Input
        placeholder="Entrez pseudonyme"
        value={inviteNickname}
        onChange={(e) => setInviteNickname(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button 
        type="primary" 
        onClick={handleInvite}
        disabled={!inviteNickname}
      >
        Invite
      </Button>
    </div>
  );

  return (
    <Popover content={inviteContent} title="Inviter Collaborateur" trigger="click">
      <UserAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />
    </Popover>
  );
};

export default InviteMenu;