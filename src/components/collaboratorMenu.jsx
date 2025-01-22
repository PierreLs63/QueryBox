import React, { useState, useEffect } from 'react';
import { Button, List, Popover, Tag, Spin, Alert, Modal, Select } from 'antd';
import { DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import useUpdatePrivileges from '../hooks/workspace/useUpdatePrivileges';
import useRemoveUser from '../hooks/workspace/useRemoveUser';
import useLeave from '../hooks/workspace/useLeave';
import { useAuthContext } from '../context/AuthContext';
import useCurrentState from '../zustand/CurrentState';
import useCollaboratorsDataStore from '../zustand/Collaborators';
import './collaboratorMenu.css'

const { Option } = Select;

const CollaboratorMenu = ({ loading, error }) => {
  const { authUser } = useAuthContext();
  const { updatePrivileges, loadingUpdatePrivileges } = useUpdatePrivileges();
  const { removeUser, loadingRemoveUser } = useRemoveUser();
  const { leave, loadingLeave } = useLeave();
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPrivilege, setNewPrivilege] = useState(null);
  const [authUserPrivilege, setAuthUserPrivilege] = useState(null);
  const CurrentState = useCurrentState();
  const collaboratorsZustand = useCollaboratorsDataStore();

  // Déterminer le grade de l'utilisateur connecté
  useEffect(() => {
    const userPrivilege = collaboratorsZustand.collaboratorsWorkspace.find(collaborator => collaborator.userId === authUser._id)?.privilege;
    setAuthUserPrivilege(userPrivilege);
  }, [collaboratorsZustand.collaboratorsWorkspace, authUser]);

  const showEditModal = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setNewPrivilege(collaborator.privilege);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await updatePrivileges(CurrentState.workspaceId, selectedCollaborator.username, newPrivilege);
    setIsModalVisible(false);
  };

  const handleRemove = async (username) => {
    await removeUser(username);
    collaboratorsZustand.setCollaboratorsWorkspace(
      collaboratorsZustand.collaboratorsWorkspace.filter(collaborator => collaborator.username !== username)
    );
  };

  const handleLeave = async () => {
    await leave(CurrentState.workspaceId);
  };

  const collaboratorContent = (
    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingLeft: '15px', paddingRight: '15px', scrollbarWidth: 'thin' }}>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert message="Erreur" description={error} type="error" showIcon />
      ) : (
        <List
          dataSource={collaboratorsZustand.collaboratorsWorkspace}
          renderItem={(collaborator) => (
            <List.Item>
              <span
                style={{
                  width: '100%',
                  color: collaborator.hasJoined ? 'inherit' : 'gray',
                  cursor: collaborator.hasJoined ? 'pointer' : 'not-allowed',
                  paddingRight: 10
                }}
              >
                {collaborator.username}
              </span>
              <Tag color={collaborator.privilege === 20 ? 'red' : collaborator.privilege === 30 ? 'blue' : 'green'}>
                {collaborator.privilege === 20 ? 'Admin' : collaborator.privilege === 30 ? 'Owner' : 'Viewer'}
              </Tag>
              {authUser._id === collaborator.userId && authUserPrivilege < 30 ? (
                <Button
                  icon={<LogoutOutlined />}
                  onClick={() => handleLeave()}
                  loading={loadingLeave}
                  style={{ color: 'red', border: 'none', background: 'none' }}
                />
              ) : (
                <>
                  {authUserPrivilege > 10 && collaborator.privilege < authUserPrivilege && (
                    <Button
                      type="link"
                      onClick={() => showEditModal(collaborator)}
                      style={{ padding: 0, marginRight: 8 }}
                    >
                      Edit
                    </Button>
                  )}
                  {authUserPrivilege > 10 && collaborator.privilege < authUserPrivilege && (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(collaborator.username)}
                      loading={loadingRemoveUser}
                      style={{ color: 'red', border: 'none', background: 'none' }}
                    />
                  )}
                </>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const collaboratorEmpty = (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <span style={{ color: 'gray' }}>Select a workspace</span>
    </div>
  );

  return (
    <>
      <Popover
        content={CurrentState.workspaceId ? collaboratorContent : collaboratorEmpty}
        title={<div style={{ textAlign: 'center', width: '100%' }}>Collaborateurs</div>}
        trigger="click">
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
        title="Edit Collaborator"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{
          style: {
            backgroundColor: 'transparent',
            borderColor: 'black',
            color: '#388E3C',
          },
          className: 'custom-ok-button'
        }}
        cancelButtonProps={{
          style: {
            color: 'red',
            borderColor: 'black',
          },
          className: 'custom-cancel-button'
        }}
        confirmLoading={loadingUpdatePrivileges}
      >
        <Select
          defaultValue={selectedCollaborator?.privilege}
          value={newPrivilege}
          onChange={setNewPrivilege}
          style={{ width: '100%' }}
        >
          <Option value={10}>Viewer</Option>
          {authUserPrivilege >= 20 && <Option value={20}>Admin</Option>}
          {authUserPrivilege >= 30 && <Option value={30}>Owner</Option>}
        </Select>
      </Modal>
    </>
  );
};

export default CollaboratorMenu;
