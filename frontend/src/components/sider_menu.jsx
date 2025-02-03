import React, { useState,useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, Button, Modal, Input } from 'antd';
import { UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined, PlusOutlined, EditOutlined, EyeOutlined, KeyOutlined, FireOutlined } from '@ant-design/icons';
import './sider_menu.css'

import useLogout from '../../src/hooks/auth/useLogout';
import useCreate from '../../src/hooks/workspace/useCreate';
import useDelete from '../../src/hooks/workspace/useDelete';
import useCreateCollection from '../hooks/workspace/useCreateCollection';
import useChangeWorkspaceName from '../hooks/workspace/useChangeName';
import useChangeCollectionName from '../hooks/collection/useChangeName'
import useWorkspaces from '../hooks/workspace/useWorkspaces';
import useWorkspaceNameById from '../hooks/workspace/useWorkspaceNameById';
import useCollections from '../hooks/workspace/useCollections';
import useDeleteCollection from '../hooks/collection/useDeleteCollection';
import useGetAllHistory from '../hooks/history/useGetAllHistory';
import useCreateRequest from '../hooks/collection/useCreateRequest';
import useRequests from '../hooks/collection/useRequests';
import useCollectionNameById from '../hooks/collection/useCollectionNameById';
import useDeleteRequest from '../hooks/requests/useDeleteRequest';
import useChangeRequestName from '../hooks/requests/useChangeRequestName';
import useRequestNameById from '../hooks/requests/useRequestNameById';
import useCurrentState from '../zustand/CurrentState';
import useDeleteResponse from '../hooks/response/useDeleteResponse';
import { useAuthContext } from '../context/AuthContext';
import useCollaborateurs2 from '../hooks/workspace/useCollaborateurs2';
import useCollaborateursCollection from '../hooks/collection/useCollaborateursCollection';
import useGetRequestName from '../hooks/response/useGetRequestName';


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
  const { deleteResponse } = useDeleteResponse();
  const { getCollaborateurs } = useCollaborateurs2();
  const { getCollaborateursCollection } = useCollaborateursCollection();
  const { authUser } = useAuthContext();
  const { getRequestName } = useGetRequestName();

  // Edition for workspace
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const {loading: loadingWS, error: errorWS, success: successWS, changeName: changeWorkspaceName} = useChangeWorkspaceName();
  const {getWorkspaceNameById} = useWorkspaceNameById();

  // Edition for collection
  const [isModalOpenColl, setIsModalOpenColl] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const {loadingCollectionName, errorCollectionName, successCollectionName, changeName: changeCollectionName} = useChangeCollectionName();
  const {getCollectionNameById} = useCollectionNameById();

  // Edition for request
  const [isModalOpenReq, setIsModalOpenReq] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [newRequestName, setNewRequestName] = useState('');
  const {loadingRequestName, errorRequestName, successRequestName, changeName: changeRequestName} = useChangeRequestName();
  const {getRequestNameById} = useRequestNameById();

  // Current State
  const currentState = useCurrentState()

  // Ref for container and state for overflow
  const containerRefs = useRef([]);
  const [overflowState, setOverflowState]  = useState(false);
  const [hoverElement, setHoverElement] = useState(null);

  // Hover scrolling
  const handleHoverScrolling = (e) => {
    setHoverElement(e.target);
  };

  useLayoutEffect(() => {
    if (hoverElement) {
      const containerWidth = hoverElement.parentElement.getBoundingClientRect().width;
      const targetWidth = hoverElement.getBoundingClientRect().width;
      const overflow = containerWidth <= targetWidth;
      setOverflowState(overflow);
    }
  }, [hoverElement]);

  // State of menu opened
  const [openKeys, setOpenKeys] = useState(['workspaces']);
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };


  const [menuItems, setMenuItems] = useState([
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
  }, [currentState.workspaceId, currentState.triggerUpdateWorkspaces]);


  // Update menu items after workspaces have been fetched
  useEffect(() => {

    updateMenuItemsWithCollections();
  }, [workspaces]);

  // Update when send request
  useEffect(() => {
    if(currentState.sendRequest === true){
      currentState.setSendRequest(false);
      addHistory();
    }
  }, [currentState.sendRequest]);


  //update menu
  const updateMenuItemsWithCollections = async () => {
    if (workspaces) {
      console.log('Fetched Workspaces :', workspaces);

      // Fetch collections for each workspace and update the menu
      const updatedMenuItems = await Promise.all(
        workspaces.map(async (workspace) => {
          const workspaceCollections = await getCollections(workspace.id);
          const workspaceHistory = await getAllHistory(workspace.id);
          const workspaceKey = `workspace:${workspace.id}`;
          const workspaceCollaborators = await getCollaborateurs(workspace.id);
          const userPrivilegeWorkspace = workspaceCollaborators.find(collaborator => collaborator.userId === authUser._id)?.privilege;
          
          return {
            key: `workspace:${workspace.id}`,
            label: workspace.name,
            icon: userPrivilegeWorkspace === 10 
              ? <EyeOutlined /> 
              : userPrivilegeWorkspace === 20 
              ? <FireOutlined />  
              : userPrivilegeWorkspace === 30 
              ? <KeyOutlined />  
              : <EyeOutlined /> ,
            children: [
              {
                key: `workspace:${workspace.id}-collection`,
                label: 'Collections',
                icon: <FileOutlined />,
                children: await Promise.all( // Use Promise.all to resolve async operations inside map
                  workspaceCollections.map(async (collection) => {
                    const requests = await getRequests(collection._id);
                    const collectionCollaborators = await getCollaborateursCollection(collection._id);
                    const userPrivilegeCollection = collectionCollaborators.find(collaborator => collaborator.userId === authUser._id)?.privilege;
                    return {
                      key: `${workspaceKey}-collection:${collection._id}`,
                      label: collection.name,
                      icon: userPrivilegeCollection === 10 
                        ? <EyeOutlined />  
                        : userPrivilegeCollection === 20 
                        ? <FireOutlined />  
                        : <EyeOutlined /> ,
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
                children: await Promise.all(
                  workspaceHistory.map(async (history) => {
                    const requestName = await getRequestName(history._id); 
                    const formattedDate = new Date(history.createdAt).toLocaleString('fr-FR', { 
                      day: '2-digit', month: '2-digit', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit', second: '2-digit' 
                    }).replace(',', '');
                    return {
                      key: `${workspaceKey}-history:${history._id}`,
                      label: `${requestName} ${formattedDate}`,
                    };
                  })
                ),
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

  // Add new workspace
  const addWorkspace = async(parentKey, event) => {
    event.stopPropagation();
    const newWorkspace = await createWorkspace();

    if (!newWorkspace.success) {
      return;
    }


    const newWsKey = `workspace:${newWorkspace.data._id}`;

    setOpenKeys((prev) => [...prev, newWsKey, 'workspaces']);

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.key === parentKey) {
          return {
            ...item,
            children: [
              ...item.children,
              {
                key: newWsKey,
                label: `${newWorkspace.data.name}`,
                icon: <KeyOutlined /> ,
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


    const deleteWorkspaceData = await deleteWorkspace(subKey.split(":")[1]);
    
    if (!deleteWorkspaceData.success) {
      return;
    }

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

    if (!newCollection.success) {
      return;
    }
    
    const workspaceCollectionKey = `${workspaceKey}-collection`;
    const newCollectionKey = `${workspaceKey}-collection:${newCollection.collection._id}`;

    setOpenKeys((prev) => [...prev, workspaceCollectionKey]);

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
                      icon: <FireOutlined />,
                      children: [],
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
    console.log(subKey);
    if (subKey.includes("-collection:")){
      const deleteCollectionData = await deleteCollection(subKey.split('-collection:')[1]);
      if (!deleteCollectionData.success) {
        return;
      }
    }
    else {
      const deleteResponseData = await deleteResponse(subKey.split('-history:')[1])
      if (!deleteResponseData.success){
        return;
      }
    }

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
    updateMenuItemsWithCollections();
  };



   // Add new request
   const addRequest = async(event, type) => {
    event.stopPropagation();

    // Split collectionKey from type
    const collectionKey = type.split('-')[1];
    const workspaceKey = type.split('-')[0];

    const newRequest = await createRequest(collectionKey.split(":")[1]);
    if (!newRequest.success) {
      return;
    }

    const requestCollectionKey = `${workspaceKey}-${collectionKey}`;

    setOpenKeys((prev) => [...prev, requestCollectionKey]);

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

    const deleteRequestData = await deleteRequest(subKey.split('-request:')[1]);

    if (!deleteRequestData.success) {
      return;
    }

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
    updateMenuItemsWithCollections();
  };


  // Add new history
  const addHistory = async() => {
    // Split workspaceKey from type
    const workspaceId = currentState.workspaceId;
    const responseId = currentState.historyId;
    
    const newHistoryKey = `workspace:${workspaceId}-history:${responseId}`;

    const requestName = await getRequestName(responseId); 
    const formattedDate = new Date().toLocaleString('fr-FR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }).replace(',', '');

    setOpenKeys((prev) => [...prev, `workspace:${workspaceId}-history`]);

    const newHistoryLabel = `${requestName} ${formattedDate}`;

    const recursiveUpdate = (items) =>
      items.map((item) => {
        if (item.key === `workspace:${workspaceId}`) {
          return {
            ...item,
            children: item.children?.map((child) => {
              if (child.key === `workspace:${workspaceId}-history`) {
                return {
                  ...child,
                  children: [
                    {
                      key: newHistoryKey,
                      label: newHistoryLabel,
                    },
                    ...child.children,
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

  // Save edition of workspace
  const handleEditNameOk = async () => {
    if (!editingWorkspaceId) {
      setIsModalOpen(false);
      return;
    }

    const changeWorkspaceNameData = await changeWorkspaceName(editingWorkspaceId, newWorkspaceName);

    if (!changeWorkspaceNameData.success) {
      return;
    }

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

    const changeCollectionNameData = await changeCollectionName(editingCollectionId, newCollectionName);
    if (!changeCollectionNameData.success) {
      return;
    }

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

    const changeRequestNameData = await changeRequestName(editingRequestId, newRequestName);
    if (!changeRequestNameData.success) return;


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
      if (key.includes("-collection")){
        const workspaceId = key.split("workspace:")[1].split("-collection:")[0];
        currentState.setWorkspaceId(workspaceId);
        getWorkspaceNameById(workspaceId);
      }
      else {
        const workspaceId = key.split("workspace:")[1].split("-history:")[0];
        currentState.setWorkspaceId(workspaceId);
        getWorkspaceNameById(workspaceId);
      }
      
    }
    else{
      currentState.setWorkspaceId(null);
      currentState.setWorkspaceName(null);
    }

    
    if (key.includes("-collection:")){
      const collectionId = key.split("-collection:")[1].split("-request:")[0];
      currentState.setCollectionId(collectionId);
      getCollectionNameById(collectionId);
    }
    else{
      currentState.setCollectionId(null);
      currentState.setCollectionName(null);
    }

    
    if (key.includes("-request:")){
      const requestId = key.split("-request:")[1];
      currentState.setRequestId(requestId);
      getRequestNameById(requestId);
    }
    else{
      currentState.setRequestId(null);
      currentState.setRequestName(null);
    }

    if (key.includes("-history:")){
      const responseId = key.split("-history:")[1];
      currentState.setResponseId(responseId);
    }
    else{
      currentState.setResponseId(null);
    }

  };

  return (
    <>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={menuItems.map((item) => ({
          ...item,
          className: openKeys.includes(item.key) ? 'item-open' : '',
          children: item.children?.map((child) => ({
            ...child,
            className: openKeys.includes(child.key) ? 'child-open' : '',
            children: child.children?.map((subChild) => ({
              ...subChild,
              className: openKeys.includes(subChild.key) ? 'subchild-open' : '',
              children: subChild.children?.map((subItem, index) => ({
                ...subItem,
                className: openKeys.includes(subItem.key) ? 'subitem-open' : '',
                children: subItem.children?.map((subsubItem, index) => ({
                  ...subsubItem,
                  label: (
                    <div
                    style={{
                      width: '80%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      overflow: 'hidden',

                    }}
                    ref={(el) => (containerRefs.current[index] = el)}
                    onClick={() => handleTabClick(subsubItem.key)}
                    >
                      <span
                      onMouseEnter={handleHoverScrolling}
                      className={`${overflowState ? 'scroll-title' : ''}`}
                      title={overflowState ? `${subsubItem.label}` : ''}
                      >{subsubItem.label}</span>
                      {subsubItem.key.includes('-request:') && (
                        <div style={{ position: 'absolute', right: '15px', display: 'flex', gap: '4px' }}>
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
                      width: subItem.key.includes('-history:') ? '90%' : '70%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleTabClick(subItem.key)}
                    ref={(el) => (containerRefs.current[index] = el)}
                  >
                    <span
                    onMouseEnter={handleHoverScrolling}
                    className={`${overflowState ? 'scroll-title' : ''}`}
                    title={overflowState ? `${subItem.label}` : ''}
                    >{subItem.label}</span>
                    {subItem.key.includes('-collection:') && (
                      <div style={{ position: 'absolute', right: '2.5em', display: 'flex', gap: '4px' }}>
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
                    <div style={{ position: 'absolute', right: '1em', display: 'flex' }}>
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
                  width: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
                onClick={() => handleTabClick(child.key)}
              >
                <span
                onMouseEnter={handleHoverScrolling}
                className={`${overflowState ? 'scroll-title' : ''}`}
                title={overflowState ? `${child.label}` : ''}
                >{child.label}</span>
                {child.key.startsWith('workspace:') && (
                  <div style={{ position:'absolute', right: '3em', display: 'flex', gap: '4px' }}>
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
              onClick={() => handleTabClick(item.key)}
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
          onChange={(e) => e.target.value.length < 250 && setNewWorkspaceName(e.target.value)}
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
          onChange={(e) => e.target.value.length < 250 && setNewCollectionName(e.target.value)}
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
          onChange={(e) => e.target.value.length < 250 && setNewRequestName(e.target.value)}
          placeholder="Enter new request name"
        />
      </Modal>
    </>
  );
}  

export default SiderMenu;
