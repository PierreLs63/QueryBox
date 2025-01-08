import React from 'react';
import { Button, List, Popover, Tag, Spin, Alert } from 'antd';

const CollaboratorMenu = ({ collaborators, loading, error }) => {
  const collaboratorContent = (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '200px' }}>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert message="Erreur" description={error} type="error" showIcon />
      ) : (
        <List
          dataSource={collaborators}
          renderItem={(collaborator) => (
            <List.Item style={{ opacity: collaborator.hasJoined ? 1 : 0.5 }}>
              <Button type="link" style={{ width: '100%' }}>
                {collaborator.username}
              </Button>
              <Tag color={collaborator.privilege === 20 ? 'red' : collaborator.privilege === 30 ? 'blue' : 'green'}>
                {collaborator.privilege === 20 ? 'Admin' : collaborator.privilege === 30 ? 'Owner' : 'Viewer'}
              </Tag>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={collaboratorContent} title="Collaborateurs" trigger="click">
      <Button
        shape="round"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'rgb(34, 56, 51)',
          borderWidth: '2px',
          color: 'rgb(28, 41, 38)',
          height: '31px',
          fontWeight: 'bold',
        }}
      >
        Collaborateur
      </Button>
    </Popover>
  );
};

export default CollaboratorMenu;
