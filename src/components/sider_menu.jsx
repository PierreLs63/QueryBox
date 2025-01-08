import { useState } from 'react';
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
            key: 'collection',
            icon: <FileOutlined />,
            label: 'Collection',
            children: [{ key: 'collection:1', label: 'Collection 1' }],
          },
          {
            key: 'history',
            icon: <HistoryOutlined />,
            label: 'History',
            children: [{ key: 'history:1', label: 'History 1' }],
          },
        ]}],
    },
  ];

  const [menuItems, setMenuItems] = useState(initialItems);
  const [workspaceCounter, setWorkspaceCounter] = useState(2);
  const [collectionCounter, setCollectionCounter] = useState(2);
  const [historyCounter, setHistoryCounter] = useState(2);


  const addSubMenu = (key, event) => {
    event.stopPropagation();
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === key
          ? {
              ...item,
              children: [
                ...item.children,
                { key: `${key}:${workspaceCounter}`, 
                  label: `${item.label} ${workspaceCounter}`, 
                  children: [
                    {
                      key: 'collection',
                      label: 'Collection',
                      icon: <FileOutlined />,
                      children: [{ key: `collection:1`, label: `Collection 1` }]
                    },
                    {
                      key: 'history',
                      label: 'History',
                      icon: <FileOutlined />,
                      children: [{ key: `history:1`, label: `History 1` }]
                    }
                  ]
                },
              ],
            }
          : item
      )
    );
    setWorkspaceCounter((prevCounter) => prevCounter + 1);
  };


  const deleteSubMenu = (subKey, event) => {
    event.stopPropagation();

    const recursiveDelete = (items) => {
        return items.map((item) => ({
            ...item,
            children: item.children?.map((child) => ({
                ...child,
                children: child.children?.map((subChild) => ({
                    ...subChild,
                    children: subChild.children?.filter((subItem) => subItem.key !== subKey)
                })).filter(subChild => subChild.key !== subKey)
            })).filter(child => child.key !== subKey)
        })).filter(item => item.key !== subKey);
    };

    setMenuItems((prevItems) => recursiveDelete(prevItems));
};







  const addSubItem = (key, event, type) => {
    event.stopPropagation();

    const recursiveUpdate = (items) => {
        return items.map((item) =>
            item.key === key
                ? {
                      ...item,
                      children: item.children.map((child) =>
                          child.key === type
                              ? {
                                    ...child,
                                    children: [
                                        ...child.children,
                                        {
                                            key: `${type}:${type === 'collection' ? collectionCounter : historyCounter}`,
                                            label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${type === 'collection' ? collectionCounter : historyCounter}`,
                                        }
                                    ]
                                }
                              : child
                      )
                  }
                : {
                      ...item,
                      children: item.children ? recursiveUpdate(item.children) : item.children
                  }
        );
    };

    setMenuItems((prevItems) => recursiveUpdate(prevItems));
    if (type === 'collection') {
        setCollectionCounter((prevCounter) => prevCounter + 1);
    } else if (type === 'history') {
        setHistoryCounter((prevCounter) => prevCounter + 1);
    }
  };


  const deleteSubItem = (subKey, event) => {
    event.stopPropagation();

    const recursiveDelete = (items) => {
        return items.map((item) => ({
            ...item,
            children: item.children?.map((child) => ({
                ...child,
                children: child.children?.map((subChild) => ({
                    ...subChild,
                    children: subChild.children?.filter((subItem) => subItem.key !== subKey)
                }))
            }))
        })).filter(item => !(item.key === subKey));
    };

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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{subItem.label}</span>
                              {subItem.key.match(/^(collection|history):\d+$/) && (
                                  <Button
                                      size="small"
                                      onClick={(event) => deleteSubItem(subItem.key, event)}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{subChild.label}</span>
                          {subChild.key.match(/^(collection|history)$/) && (
                              <Button
                                  size="small"
                                  onClick={(event) => addSubItem(child.key, event, subChild.key)}
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
                  )
              })),
              label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{child.label}</span>
                      {child.key.match(/^workspace:\d+$/) && (
                          <Button
                              size="small"
                              onClick={(event) => deleteSubMenu(child.key, event)}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.label}</span>
                  {item.key === 'workspace' && (
                      <Button
                          size="small"
                          onClick={(event) => addSubMenu(item.key, event)}
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
      style={{ height: '100%', borderRight: 0, paddingTop: '15px', paddingBottom: '20px', background: '#d9ebe5' }}
  />
  );
};

export default SiderMenu;
