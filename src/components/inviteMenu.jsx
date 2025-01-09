import React from 'react';
import { Input, Button, Popover, Select } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import useInvite from '../../src/hooks/workspace/useInvite';

const InviteMenu = (workspaceId) => {
  const { inviteUsername, setInviteUsername, invitePrivilege, setInvitePrivilege, invite } = useInvite();

  const handleInvite = () => {
    invite(workspaceId, inviteUsername, invitePrivilege);
    setInviteUsername("");
  };

  const inviteContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '240px' }}>
        <Input
            placeholder="Entrez pseudonyme"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            style={{ width: '100%', marginBottom: '10px', height: '30px' }}
        />
        <Select 
            value={invitePrivilege === 20 ? 'admin' : 'viewer'}
            style={{ width: '100%', marginBottom: '10px', height: '30px' }}
            onChange={(value) => setInvitePrivilege(value === 'admin' ? 20 : 10)}
        >
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="viewer">Viewer</Select.Option>
        </Select>
        <Button 
            type="primary" 
            onClick={handleInvite}
            disabled={!inviteUsername}
            style={{ width: '40%', height: '30px' }}
        >
            Invite
        </Button>
    </div>
  );

  return (
    <Popover
      content={inviteContent}
      title={<div style={{ textAlign: 'center', width: '100%' }}>Inviter Collaborateur</div>} 
      trigger="click">
      <Button
        type="text"
        icon={<UserAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
        style={{ padding: 0 }}
      />
    </Popover>
  );
};

export default InviteMenu;