import React from 'react';
import { List, Button, Popover, Badge } from 'antd';
import { CloseOutlined, BellOutlined, CheckOutlined } from '@ant-design/icons';

const NotificationMenu = ({ notifications, setNotifications }) => {
  // Function to handle removing a notification
  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const notificationContent = (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '250px' }}>
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
              maxWidth: '230px',
            }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>{item.message}</div>
            <Button
              type="link"
              icon={<CheckOutlined style={{ color: 'green' }} />}
              onClick={() => handleRemoveNotification(item.id)}
              style={{ padding: 0 }}
            />
            <Button
              type="link"
              icon={<CloseOutlined style={{ color: 'red' }} />}
              onClick={() => handleRemoveNotification(item.id)}
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
