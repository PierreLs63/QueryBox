import React, { useState } from 'react';
import { Button, List, Popover, Tag, Spin, Alert, Modal, Select } from 'antd';
import useUpdatePrivileges from '../hooks/workspace/useUpdatePrivileges';
import useRemoveUser from '../hooks/workspace/useRemoveUser';
import useLeave from '../hooks/workspace/useLeave';
import { useAuthContext } from '../context/AuthContext';

const { Option } = Select;

const CollaboratorMenu = ({ collaborators, loading, error ,workspaceId}) => {
  const { authUser } = useAuthContext();
  const { updatePrivileges, loadingUpdatePrivileges } = useUpdatePrivileges();
  const { removeUser, loadingRemoveUser } = useRemoveUser();
  const { leave, loadingLeave } = useLeave();
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPrivilege, setNewPrivilege] = useState(null);

  const showEditModal = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setNewPrivilege(collaborator.privilege);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await updatePrivileges(selectedCollaborator.workspaceId, selectedCollaborator.username, newPrivilege);
    setIsModalVisible(false);
  };

  const handleRemove = async (username) => {
    await removeUser(workspaceId, username);
  };

  const handleLeave = async (workspaceId) => {
    await leave(workspaceId);
  };

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
              {authUser._id === collaborator.userId ? (
                <Button danger onClick={() => handleLeave(collaborator.workspaceId)} loading={loadingLeave}>
                  Leave
                </Button>
              ) : (
                <>
                  <Button onClick={() => showEditModal(collaborator)}>Edit</Button>
                  <Button onClick={() => handleRemove(collaborator.userId)} loading={loadingRemoveUser}>Remove</Button>
                </>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <>
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
      <Modal
        title="Edit Privileges"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loadingUpdatePrivileges}
      >
        <Select value={newPrivilege} onChange={setNewPrivilege} style={{ width: '100%' }}>
          <Option value={10}>Viewer</Option>
          <Option value={20}>Admin</Option>
          <Option value={30}>Owner</Option>
        </Select>
      </Modal>
    </>
  );
};

export default CollaboratorMenu;
