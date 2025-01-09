import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './sider_menu.css'
import useLogout from '../hooks/auth/useLogout';


const SiderMenu = () => {
  
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
      key: 'workspace',
      icon: <DesktopOutlined />,
      label: 'Workspace',
      children: [{ 
        key: 'workspace:1', 
        label: 'Workspace 1',
        children:[
          {
            key: 'workspace:1-collection',
            icon: <FileOutlined />,
            label: 'Collection',
            children: [{ key: 'workspace:1-collection:1', label: 'Collection 1' }],
          },
          {
            key: 'workspace:1-history',
            icon: <HistoryOutlined />,
            label: 'History',
            children: [{ key: 'workspace:1-history:1', label: 'History 1' }],
          },
        ]}],
    },
  ];

  const [menuItems, setMenuItems] = useState(initialItems);
  const [workspaceCounter, setWorkspaceCounter] = useState(2);
  const [counterMap, setCounterMap] = useState({
    'workspace:1': { collection: 2, history: 2 },
  });


  /**
   * Add new child node for workspace
   * parentKey -> workspace
   * childKey -> workspace:<number>
   */
  const addSubMenu = (parentKey, event) => {
    event.stopPropagation();

    const newWsKey = `workspace:${workspaceCounter}`;

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.key === parentKey) {
          return {
            ...item,
            children: [
              ...item.children,
              {
                key: newWsKey,
                label: `Workspace ${workspaceCounter}`,
                children: [
                  {
                    key: `${newWsKey}-collection`,
                    label: 'Collection',
                    icon: <FileOutlined />,
                    children: [
                      {
                        key: `${newWsKey}-collection:1`,
                        label: 'Collection 1',
                      },
                    ],
                  },
                  {
                    key: `${newWsKey}-history`,
                    label: 'History',
                    icon: <HistoryOutlined />,
                    children: [
                      {
                        key: `${newWsKey}-history:1`,
                        label: 'History 1',
                      },
                    ],
                  },
                ],
              },
            ],
          };
        }
        return item;
      })
    );

    // Update WorkspaceCounter
    setWorkspaceCounter((c) => c + 1);

    // Update CounterMap
    setCounterMap((prev) => ({
      ...prev,
      [newWsKey]: { collection: 2, history: 2 },
    }));
  };




  /**
   * Delete child node of workspace
   */
  const deleteSubMenu = (subKey, event) => {
    event.stopPropagation();

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

    // Delete CounterMap of this workspace removed
    if (subKey.startsWith('workspace:')) {
      setCounterMap((prev) => {
        const next = { ...prev };
        delete next[subKey];
        return next;
      });
    }
  };





  /**
   * Add new item of collection/history (child node of workspace:<number>)
   * @param {Event} event
   * @param {string} type 'workspace:<number>-collection' or 'workspace:<number>-history'
   */
  const addSubItem = (event, type) => {
    event.stopPropagation();

    // Split workspaceKey from type
    const workspaceKey = type.split('-')[0]; // 'workspace:<number>'
    // Split category of node
    const category = type.endsWith('collection') ? 'collection' : 'history';

    // Read counterMap of this workspace
    const counters = counterMap[workspaceKey];
    if (!counters) return;

    // Set counter of category
    const newIndex = counters[category];
    const newItemKey = `${workspaceKey}-${category}:${newIndex}`;
    const newItemLabel = `${category.charAt(0).toUpperCase() + category.slice(1)} ${newIndex}`;


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
                      key: newItemKey,
                      label: newItemLabel,
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

    // Update CounterMap
    setCounterMap((prev) => ({
      ...prev,
      [workspaceKey]: {
        ...prev[workspaceKey],
        [category]: prev[workspaceKey][category] + 1,
      },
    }));
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
                    onClick={(e) => addSubItem(e, subChild.key)}
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
            {item.key === 'workspace' && (
              <Button
                size="small"
                onClick={(e) => addSubMenu(item.key, e)}
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
