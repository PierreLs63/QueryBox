import React, { useState,useEffect } from 'react';
import { Menu, Button, Modal, Input } from 'antd';
import { UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import './sider_menu.css'
import useLogout from '../../src/hooks/auth/useLogout';
import useCreate from '../../src/hooks/workspace/useCreate';
import useDelete from '../../src/hooks/workspace/useDelete';
import useCreateCollection from '../hooks/workspace/useCreateCollection';
import useChangeWorkspaceName from '../hooks/workspace/useChangeName';
import useChangeCollectionName from '../hooks/collection/useChangeName'
import useWorkspaces from '../hooks/workspace/useWorkspaces';
import useCollections from '../hooks/workspace/useCollections';


const SiderMenu = () => {

  const {createWorkspace} = useCreate();
  const {deleteWorkspace} = useDelete();
  const {createCollection} = useCreateCollection();
  const {logout} = useLogout();

  const { workspaces, loadingWorkspaces, getWorkspaces } = useWorkspaces();
  const { collections, loading, getCollections } = useCollections();


  // Edition for workspace
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const {loading: loadingWS, error: errorWS, success: successWS, changeName: changeWorkspaceName} = useChangeWorkspaceName();

  // Edition for collection
  const [isModalOpenColl, setIsModalOpenColl] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const {loadingCollectionName, errorCollectionName, successCollectionName, changeName: changeCollectionName} = useChangeCollectionName();


  const [menuItems, setMenuItems] = useState([
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Account',
      children: [
        { key: 'profil', label: 'Profil' },
        { key: 'deconnecter', label: 'Déconnecter', onClick: () => logout() },
      ],
    },
    {
      key: 'workspaces',
      icon: <DesktopOutlined />,
      label: 'Workspaces',
      children: [],
    },
  ]);
  


   // Fetch workspaces when the page loads (initial fetch)
   useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const fetchedWorkspaces = await getWorkspaces(); // Fetch workspaces when the component mounts
        if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
          setWorkspaces(fetchedWorkspaces); // Update state with fetched workspaces
        } else {
          console.log('No workspaces fetched');
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  // Update menu items after workspaces have been fetched
  useEffect(() => {
    const updateMenuItemsWithCollections = async () => {
      if (workspaces && workspaces.length > 0) {
        console.log('Fetched Workspaces:', workspaces); // Log workspaces after the state is updated

        // Fetch collections for each workspace and update the menu
        const updatedMenuItems = await Promise.all(
          workspaces.map(async (workspace) => {
            const workspaceCollections = await getCollections(workspace.id); // Fetch collections for the workspace
            const workspaceKey = `workspace:${workspace.id}`;
            return {
              key: `workspace:${workspace.id}`,
              label: workspace.name,
              children: [
                {
                  key: `workspace:${workspace.id}-collection`,
                  label: 'Collections',
                  icon: <FileOutlined />,
                  children: workspaceCollections.map((collection) => ({
                    key: `${workspaceKey}-collection:${collection._id}`,
                    label: collection.name,
                  })),
                },
                {
                  key: `workspace:${workspace.id}-history`,
                  label: 'History',
                  icon: <HistoryOutlined />,
                  children: [],
                },
              ],
            };
          })
        );

        // Update the menu items with fetched data
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.key === 'workspaces'
              ? { ...item, children: updatedMenuItems }
              : item
          )
        );
      } else {
        console.log('No workspaces available');
      }
    };

    updateMenuItemsWithCollections();
  }, [workspaces]);



  // Add new workspace
  const addWorkspace = async(parentKey, event) => {
    event.stopPropagation();
    const newWorkspace = await createWorkspace();

    const newWsKey = `workspace:${newWorkspace._id}`;

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.key === parentKey) {
          return {
            ...item,
            children: [
              ...item.children,
              {
                key: newWsKey,
                label: `${newWorkspace.name}`,
                children: [
                  {
                    key: `${newWsKey}-collection`,
                    label: 'Collections',
                    icon: <FileOutlined />,
                    children: [],
                  },
                  {
                    key: `${newWsKey}-history`,
                    label: 'History',
                    icon: <HistoryOutlined />,
                    children: [],
                  },
                ],
              },
            ],
          };
        }
        return item;
      })
    );

  };



  // Delete workspace
  const deleteSubMenu = async(subKey, event) => {
    event.stopPropagation();

    //Recuperate the workspace id from the subkey
    await deleteWorkspace(subKey.split(":")[1]);

    const recursiveDelete = (items) =>
      items
        .map((item) => ({
          ...item,
          children: item.children
            ?.map((child) => ({
              ...child,
              children: child.children
                ?.map((subChild) => ({
                  ...subChild,
                  children: subChild.children?.filter(
                    (subItem) => subItem.key !== subKey
                  ),
                }))
                .filter((sc) => sc.key !== subKey),
            }))
            .filter((ch) => ch.key !== subKey),
        }))
        .filter((it) => it.key !== subKey);

    setMenuItems((prevItems) => recursiveDelete(prevItems));

  };



  // Add new collection
  const addCollection = async(event, type) => {
    event.stopPropagation();

    // Split workspaceKey from type
    const workspaceKey = type.split('-')[0];

    const newCollection = await createCollection(workspaceKey.split(":")[1]);
    const newCollectionKey = `${workspaceKey}-collection:${newCollection.collection._id}`;
    const newCollectionLabel = `${newCollection.collection.name}`;


    const recursiveUpdate = (items) =>
      items.map((item) => {
        if (item.key === workspaceKey) {
          return {
            ...item,
            children: item.children?.map((child) => {
              if (child.key === type) {
                return {
                  ...child,
                  children: [
                    ...child.children,
                    {
                      key: newCollectionKey,
                      label: newCollectionLabel,
                    },
                  ],
                };
              }
              return child;
            }),
          };
        } else {
          return {
            ...item,
            children: item.children ? recursiveUpdate(item.children) : item.children,
          };
        }
      });

    setMenuItems((prev) => recursiveUpdate(prev));

  };



  // Delete collection/history
  const deleteSubItem = (subKey, event) => {
    event.stopPropagation();

    const recursiveDelete = (items) =>
      items
        .map((item) => ({
          ...item,
          children: item.children?.map((child) => ({
            ...child,
            children: child.children?.map((subChild) => ({
              ...subChild,
              children: subChild.children?.filter((subItem) => subItem.key !== subKey),
            })),
          })),
        }))
        .filter((i) => i.key !== subKey);

    setMenuItems((prevItems) => recursiveDelete(prevItems));
  };



  // Save edition pf workspace
  const handleEditNameOk = async () => {
    if (!editingWorkspaceId) {
      setIsModalOpen(false);
      return;
    }

    await changeWorkspaceName(editingWorkspaceId, newWorkspaceName);

    setMenuItems((prev) => {
      const wsKey = `workspace:${editingWorkspaceId}`;
      const recursiveUpdate = (items) =>
        items.map((item) => {
          if (item.key === wsKey) {
            return {
              ...item,
              label: newWorkspaceName,
            };
          }
          if (item.children) {
            return {
              ...item,
              children: recursiveUpdate(item.children),
            };
          }
          return item;
        });
      return recursiveUpdate(prev);
    });

    setIsModalOpen(false);
  };



  // Save edition of collection
  const handleEditCollectionOk = async () => {
    if (!editingCollectionId) {
      setIsModalOpenColl(false);
      return;
    }

    await changeCollectionName(editingCollectionId, newCollectionName);

    const searchPart = `-collection:${editingCollectionId}`;
    setMenuItems((prev) => {
      const recursiveUpdate = (items) =>
        items.map((item) => ({
          ...item,
          children: item.children?.map((child) => ({
            ...child,
            children: child.children?.map((subChild) => ({
              ...subChild,
              children: subChild.children?.map((subItem) => {
                if (subItem.key.includes(searchPart)) {
                  return {
                    ...subItem,
                    label: newCollectionName
                  };
                }
                return subItem;
              })
            }))
          }))
        }));
      return recursiveUpdate(prev);
    });

    setIsModalOpenColl(false);
  };




  return (
    <>
    <Menu
      mode="inline"
      items={menuItems.map((item) => ({
        ...item,
        children: item.children?.map((child) => ({
          ...child,
          children: child.children?.map((subChild) => ({
            ...subChild,
            children: subChild.children?.map((subItem) => ({
              ...subItem,
              label: (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{subItem.label}</span>
                  {(subItem.key.includes('-collection:') || subItem.key.includes('-history:')) && (
                    <Button
                      size="small"
                      onClick={(e) => deleteSubItem(subItem.key, e)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1.5px solid #054d29',
                        color: '#054d29',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      icon={<CloseOutlined />}
                    />
                  )}
                  {subItem.key.includes('-collection:') && (
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        const collId = subItem.key.split(':')[2];
                        setEditingCollectionId(collId);
                        setNewCollectionName(subItem.label);
                        setIsModalOpenColl(true);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1.5px solid #054d29',
                        color: '#054d29',
                        width: '18px',
                        height: '18px'
                      }}
                    />
                  )}
                </div>
              ),
            })),
            label: (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{subChild.label}</span>
                {subChild.key.includes('-collection') ? (
                  <Button
                    size="small"
                    onClick={(e) => addCollection(e, subChild.key)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1.5px solid #054d29',
                      color: '#054d29',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    icon={<PlusOutlined />}
                  />
                ) : null}
              </div>
            ),
          })),

          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{child.label}</span>
              {child.key.startsWith('workspace:') && (
                <div style={{ display: 'flex', gap: '4px' }}>
                <Button
                  size="small"
                  onClick={(e) => deleteSubMenu(child.key, e)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #054d29',
                    color: '#054d29',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  icon={<CloseOutlined />}
                />
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    const workspaceId = child.key.split(':')[1];
                    setEditingWorkspaceId(workspaceId);
                    setNewWorkspaceName(child.label);
                    setIsModalOpen(true);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #054d29',
                    color: '#054d29',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  icon={<EditOutlined />}
                />
                </div>
              )}
            </div>
          ),
        })),
        
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{item.label}</span>
            {item.key === 'workspaces' && (
              <Button
                size="small"
                onClick={(e) => addWorkspace(item.key, e)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1.5px solid #054d29',
                  color: '#054d29',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon={<PlusOutlined />}
              />
            )}
          </div>
        ),
      }))}
      style={{
        height: '100%',
        borderRight: 0,
        paddingTop: '15px',
        paddingBottom: '20px',
        background: '#d9ebe5',
      }}
    />
    {/* Edit Workspace Modal */}
    <Modal
      title="Edit Workspace Name"
      open={isModalOpen}
      onOk={handleEditNameOk}
      onCancel={() => setIsModalOpen(false)}
      confirmLoading={loadingWS}
    >
      {errorWS && <p style={{ color: 'red' }}>{errorWS}</p>}
      {successWS && <p style={{ color: 'green' }}>{successWS}</p>}
      <Input
        value={newWorkspaceName}
        onChange={(e) => setNewWorkspaceName(e.target.value)}
        placeholder="Enter new workspace name"
      />
    </Modal>
    {/* Edit Collection Modal */}
    <Modal
      title="Edit Collection Name"
      open={isModalOpenColl}
      onOk={handleEditCollectionOk}
      onCancel={() => setIsModalOpenColl(false)}
      confirmLoading={loadingCollectionName}
    >
      {errorCollectionName && (
        <p style={{ color: 'red' }}>{errorCollectionName}</p>
      )}
      {successCollectionName && (
        <p style={{ color: 'green' }}>{successCollectionName}</p>
      )}
      <Input
        value={newCollectionName}
        onChange={(e) => setNewCollectionName(e.target.value)}
        placeholder="Enter new collection name"
      />
    </Modal>
  </>
  );
};

export default SiderMenu;
