import React, { useEffect } from 'react';
import { List, Button, Popover, Badge } from 'antd';
import { CloseOutlined, BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useGetWorkspaceInvitations from '../hooks/workspace/useGetWorkspaceInvitations';
import useLeave from '../hooks/workspace/useLeave';
import useJoin from '../hooks/workspace/useJoin';

const NotificationMenu = () => {

  const { leave } = useLeave(); // leave a workspace = refuse an invitation
  const { join } = useJoin(); // accept an invitation to a workspac
  const { getWorkspaceInvitations } = useGetWorkspaceInvitations();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const invitations = await getWorkspaceInvitations();
      setNotifications(
        invitations.map((invitation) => ({
          id: invitation.id,
          message: `You got an invitation to join the workspace : ${invitation.name}`
        }))
      );
    }
    fetchData();
  }, []);
  
  // Function to handle removing a notification
  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleLeave = async (id) => {
    await leave(id, true);
    handleRemoveNotification(id);
  };

  const handleAccept = async (id) => {
    await join(id);
    handleRemoveNotification(id);
  }

  const notificationContent = (
    <div style={{ maxHeight: '200px', overflowY: 'auto', width: '250px' }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>{item.message}</div>
            <Button
              type="link"
              icon={<CheckOutlined style={{ color: 'green' }} />}
              onClick={() => handleAccept(item.id)}
              style={{ padding: 0 }}
            />
            <Button
              type="link"
              icon={<CloseOutlined style={{ color: 'red' }} />}
              onClick={() => handleLeave(item.id)}
              style={{ padding: 0 }}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title={<div style={{ textAlign: 'center', width: '100%' }}>Notifications</div>}
      trigger="click">
      <Badge count={notifications.length}>
        <Button
          type="text"
          icon={<BellOutlined style={{ color: 'rgb(34, 56, 51)', fontSize: '30px', cursor: 'pointer' }} />}
          style={{ padding: 0 }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationMenu;
