import React from 'react';
import { Input, Button, Popover, Select } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import useInvite from '../../src/hooks/workspace/useInvite';
import useCurrentState from '../zustand/CurrentState';

const InviteMenu = () => {
  const { inviteUsername, setInviteUsername, invitePrivilege, setInvitePrivilege, invite } = useInvite();
  const CurrentState = useCurrentState();

  const handleInvite = () => {
    invite(CurrentState.workspaceId, inviteUsername, invitePrivilege);
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
        <Button block
            type="primary" 
            onClick={handleInvite}
            disabled={!inviteUsername}
        >
            Invite
        </Button>
    </div>
  );

  const inviteEmpty = (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <span style={{ color: 'gray' }}>Select a workspace</span>
    </div>
  );

  return (
    <Popover
      content={CurrentState.workspaceId ? inviteContent : inviteEmpty}
      title={<div style={{ textAlign: 'center', width: '100%' }}>Inviter Collaborateur</div>} 
      trigger="click">
      <Button
        type="text"
        icon={<UsergroupAddOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
        style={{ padding: 0 }}
      />
    </Popover>
  );
};

export default InviteMenu;