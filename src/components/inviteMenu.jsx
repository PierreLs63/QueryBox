import React from 'react';
import { Input, Button, Popover, Select } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import useInvite from '../../src/hooks/workspace/useInvite';

const InviteMenu = () => {
  const { inviteUsername, setInviteUsername, invitePrivilege, setInvitePrivilege, invite } = useInvite();

  const handleInvite = () => {
    const workspaceId = "workspaceId"; // temporaire, il faut récupérer l'id du workspace
    invite(workspaceId, inviteUsername, invitePrivilege);
    toast.success(`Invite sent to ${inviteUsername} !`);
    setInviteUsername("");
  };

  const inviteContent = (
    <div>
      <Input
        placeholder="Entrez pseudonyme"
        value={inviteUsername}
        onChange={(e) => setInviteUsername(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Select 
        value={invitePrivilege === 20 ? 'admin' : 'viewer'}
        style={{ width: '100%' }}
        onChange={(value) => setInvitePrivilege(value === 'admin' ? 20 : 10)}
      >
        <Select.Option value="admin">Admin</Select.Option>
        <Select.Option value="viewer">Viewer</Select.Option>
      </Select>
      <Button 
        type="primary" 
        onClick={handleInvite}
        disabled={!inviteUsername}
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