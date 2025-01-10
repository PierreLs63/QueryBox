import React, { useState,useEffect } from 'react';
import { Menu, Button } from 'antd';
import { UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './sider_menu.css'
import useLogout from '../../src/hooks/auth/useLogout';
import useCreate from '../../src/hooks/workspace/useCreate';
import useDelete from '../../src/hooks/workspace/useDelete';
import useCreateCollection from '../hooks/workspace/useCreateCollection';


const SiderMenu = () => {

  const {createWorkspace} = useCreate();
  const {deleteWorkspace} = useDelete();
  const {createCollection} = useCreateCollection();
  const {logout} = useLogout();


  const initialItems = [
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
  ];

  const [menuItems, setMenuItems] = useState(initialItems);

  /**
   * Add new child node for workspace
   * parentKey -> workspace
   * childKey -> workspace:<number>
   */
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
                //Workspace
                key: newWsKey,
                label: `${newWorkspace._id}`,
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


  /**
   * Delete child node of workspace
   */
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


  /**
   * Add new item of collection/history (child node of workspace:<number>)
   * @param {Event} event
   * @param {string} type 'workspace:<number>-collection' or 'workspace:<number>-history'
   */
  const addCollection = async(event, type) => {
    event.stopPropagation();

    // Split workspaceKey from type
    const workspaceKey = type.split('-')[0];

    const newCollection = await createCollection(workspaceKey.split(":")[1]);
    const newCollectionKey = `${workspaceKey}-collection:${newCollection.collection._id}`;
    const newCollectionLabel = `${newCollection.collection._id}`;


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





  /**
   * Delete item of collection/history
   */
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

  return (
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
                {subChild.key.includes('-collection') || subChild.key.includes('-history') ? (
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
  );
};

export default SiderMenu;
