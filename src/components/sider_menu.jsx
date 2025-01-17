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
import useDeleteCollection from '../hooks/collection/useDeleteCollection';
import useGetAllHistory from '../hooks/history/useGetAllHistory';
import useCreateRequest from '../hooks/collection/useCreateRequest';
import useRequests from '../hooks/collection/useRequests';
import useDeleteRequest from '../hooks/requests/useDeleteRequest';
import useChangeRequestName from '../hooks/requests/useChangeRequestName';
import useCurrentState from '../zustand/CurrentState';


const SiderMenu = () => {

  const {createWorkspace} = useCreate();
  const {deleteWorkspace} = useDelete();
  const {createCollection} = useCreateCollection();
  const {deleteCollection} = useDeleteCollection();
  const {createRequest} = useCreateRequest();
  const {deleteRequest} = useDeleteRequest();
  const {logout} = useLogout();

  const { workspaces, getWorkspaces } = useWorkspaces();
  const { getCollections } = useCollections();
  const { getAllHistory } = useGetAllHistory();
  const { getRequests } = useRequests();

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

  // Edition for request
  const [isModalOpenReq, setIsModalOpenReq] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [newRequestName, setNewRequestName] = useState('');
  const {loadingRequestName, errorRequestName, successRequestName, changeName: changeRequestName} = useChangeRequestName();

  // Current State
  const currentState = useCurrentState()


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
        const fetchedWorkspaces = await getWorkspaces(); 
        if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
          console.log('Fetched Workspaces:', workspaces)
        } else {
          console.log('No workspaces fetched');
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  // Update menu items after workspaces have been fetched
  useEffect(() => {
    const updateMenuItemsWithCollections = async () => {
      if (workspaces && workspaces.length > 0) {
        console.log('Fetched Workspaces:', workspaces);

        // Fetch collections for each workspace and update the menu
        const updatedMenuItems = await Promise.all(
          workspaces.map(async (workspace) => {
            const workspaceCollections = await getCollections(workspace.id);
            const workspaceHistory = await getAllHistory(workspace.id);
            const workspaceKey = `workspace:${workspace.id}`;
            
            return {
              key: `workspace:${workspace.id}`,
              label: workspace.name,
              children: [
                {
                  key: `workspace:${workspace.id}-collection`,
                  label: 'Collections',
                  icon: <FileOutlined />,
                  children: await Promise.all( // Use Promise.all to resolve async operations inside map
                    workspaceCollections.map(async (collection) => {
                      const requests = await getRequests(collection._id);
                      return {
                        key: `${workspaceKey}-collection:${collection._id}`,
                        label: collection.name,
                        children: await Promise.all(
                          requests.map(async (request) => {
                            return {
                              key: `${workspaceKey}-collection:${collection._id}-request:${request._id}`,
                              label: request.name,
                            }
                          })
                        ),
                      };
                    })
                  ),
                },
                {
                  key: `workspace:${workspace.id}-history`,
                  label: 'History',
                  icon: <HistoryOutlined />,
                  children: workspaceHistory.map((history) => ({
                    key: `${workspaceKey}-history:${history._id}`,
                    label: history._id,
                  })),
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
    const collections = await getCollections(subKey.split(":")[1]);

    for (const collection of collections) {
      await deleteCollection(collection._id);
    }

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
  const deleteSubItem = async(subKey, event) => {
    if(event != null){
      event.stopPropagation();
    }

    await deleteCollection(subKey.split('-collection:')[1]);

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



   // Add new request
   const addRequest = async(event, type) => {
    event.stopPropagation();

    // Split collectionKey from type
    const collectionKey = type.split('-')[1];
    const workspaceKey = type.split('-')[0];

    const newRequest = await createRequest(collectionKey.split(":")[1]);
    const newRequestKey = `${workspaceKey}-${collectionKey}-request:${newRequest._id}`;
    const newRequestLabel = `${newRequest.name}`;
    const recursiveUpdate = (items) =>
      items.map((item) => {
        if (item.key === workspaceKey) {
          return {
            ...item,
            children: item.children?.map((child) => {
              if (child.key === type.split('-collection:')[0]+'-collection' ) {
                return {
                  ...child,
                  children: child.children?.map((subchild) => {
                    if (subchild.key === type) {
                      return {
                        ...subchild,
                        children: [
                          ...subchild.children,
                          {
                            key: newRequestKey,
                            label: newRequestLabel,
                          },
                        ],
                      };
                    }
                    return subchild;

                  }),
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


  // Delete request
  const deleteReq = async(subKey, event) => {
    if(event != null){
      event.stopPropagation();
    }

    await deleteRequest(subKey.split('-request:')[1]);



    const recursiveDelete = (items) =>
      items.map((item) => ({
          ...item,
          children: item.children?.map((child) => ({
            ...child,
            children: child.children?.map((subChild) => ({
              ...subChild,
              children: subChild.children?.map((subsubChild) => ({
                ...subsubChild,
                children: subsubChild.children?.filter((subItem) => subItem.key !== subKey),
              })),
            })),
          })),
        }))
        .filter((i) => i.key !== subKey);

    setMenuItems((prevItems) => recursiveDelete(prevItems));
  };



  // Save edition of workspace
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



  // Save edition of request
  const handleEditRequestOk = async () => {
    if (!editingRequestId) {
      setIsModalOpenReq(false);
      return;
    }

    await changeRequestName(editingRequestId, newRequestName);

    const searchPart = `-request:${editingRequestId}`;
    setMenuItems((prev) => {
      const recursiveUpdate = (items) =>
        items.map((item) => ({
          ...item,
          children: item.children?.map((child) => ({
            ...child,
            children: child.children?.map((subChild) => ({
              ...subChild,
              children: subChild.children?.map((subItem) => ({
                ...subItem,
                children: subItem.children?.map((subsubItem) => {
                  if (subsubItem.key.includes(searchPart)) {
                    return {
                      ...subsubItem,
                      label: newRequestName
                    };
                  }
                  return subsubItem;
                })
              }))
            }))
          }))
        }));
      return recursiveUpdate(prev);
    });

    setIsModalOpenReq(false);
  };



  const handleTabClick = async(key) => {
    if (key.includes("workspace:")){
      const workspaceId = key.split("workspace:")[1].split("-collection:")[0];
      currentState.setWorkspaceId(workspaceId);
    }

    
    if (key.includes("-collection:")){
      const collectionId = key.split("-collection:")[1].split("-request:")[0];
      currentState.setCollectionId(collectionId);
    }

    
    if (key.includes("-request:")){
      const requestId = key.split("-request:")[1];
      currentState.setRequestId(requestId);
    }

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
                children: subItem.children?.map((subsubItem) => ({
                  ...subsubItem,
                  label: (
                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handleTabClick(subsubItem.key)}
                    >
                      <span>{subsubItem.label}</span>
                      {subsubItem.key.includes('-request:') && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <Button
                            size="small"
                            onClick={(e) => deleteReq(subsubItem.key, e)}
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
                            icon={<EditOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              const reqId = subsubItem.key.split(':')[3];
                              setEditingRequestId(reqId);
                              setNewRequestName(subsubItem.label);
                              setIsModalOpenReq(true);
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1.5px solid #054d29',
                              color: '#054d29',
                              width: '18px',
                              height: '18px',
                            }}
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
                    onClick={() => handleTabClick(subItem.key)}
                  >
                    <span>{subItem.label}</span>
                    {subItem.key.includes('-collection:') && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button
                          size="small"
                          onClick={(e) => addRequest(e, subItem.key)}
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
                            height: '18px',
                          }}
                        />
                      </div>
                    )}
                    {subItem.key.includes('-history:') && (
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
                  {subChild.key.includes('-collection') && (
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
                onClick={() => handleTabClick(child.key)}
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
        }}
        className='menu'
      />
      <Modal
        title="Edit Workspace Name"
        open={isModalOpen}
        onOk={handleEditNameOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loadingWS}
        okButtonProps={{
          className:'okButton',
          style:{
            color:'green',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
        cancelButtonProps={{
          className:'cancelButton',
          style:{
            color:'red',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
      >
        <Input
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          placeholder="Enter new workspace name"
        />
      </Modal>

      <Modal
        title="Edit Collection Name"
        open={isModalOpenColl}
        onOk={handleEditCollectionOk}
        onCancel={() => setIsModalOpenColl(false)}
        confirmLoading={loadingCollectionName}
        okButtonProps={{
          className:'okButton',
          style:{
            color:'green',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
        cancelButtonProps={{
          className:'cancelButton',
          style:{
            color:'red',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
      >
        <Input
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Enter new collection name"
        />
      </Modal>

      <Modal
        title="Edit Request Name"
        open={isModalOpenReq}
        onOk={handleEditRequestOk}
        onCancel={() => setIsModalOpenReq(false)}
        confirmLoading={loadingRequestName}
        okButtonProps={{
          className:'okButton',
          style:{
            color:'green',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
        cancelButtonProps={{
          className:'cancelButton',
          style:{
            color:'red',
            backgroundColor:'white',
            borderColor:'black'
          }
        }}
      >
        <Input
          value={newRequestName}
          onChange={(e) => setNewRequestName(e.target.value)}
          placeholder="Enter new request name"
        />
      </Modal>
    </>
  );
}  

export default SiderMenu;
