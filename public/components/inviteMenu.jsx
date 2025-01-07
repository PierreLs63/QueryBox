import React from 'react';
import { Input, Button, Popover, Select } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const InviteMenu = ({ inviteNickname, setInviteNickname, invitePrivilege, setInvitePrivilege }) => {
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
      <Select 
        defaultValue="viewer" 
        style={{ width: '100%' }}
        onChange={(value) => setInvitePrivilege(value === 'admin' ? 20 : 10)}
      >
        <Select.Option value="admin">Admin</Select.Option>
        <Select.Option value="viewer">Viewer</Select.Option>
      </Select>
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