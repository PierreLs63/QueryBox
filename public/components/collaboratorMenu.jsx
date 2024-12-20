import React from 'react';
import { Button, List, Popover } from 'antd';

const CollaboratorMenu = ({ collaborators }) => {
  const collaboratorContent = (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '200px' }}>
      <List
        dataSource={collaborators}
        renderItem={(collaborator) => (
          <List.Item>
            <Button type="link" style={{ width: '100%' }}>
              {collaborator}
            </Button>
          </List.Item>
        )}
      />
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
