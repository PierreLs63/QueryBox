import { useState } from 'react';
import { Menu, Button } from 'antd';
import { UserOutlined, DesktopOutlined, FileOutlined, HistoryOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './sider_menu.css'

const initialItems = [
  {
    key: 'account',
    icon: <UserOutlined />,
    label: 'Account',
    children: [
      { key: 'profil', label: 'Profil' },
      { key: 'deconnecter', label: 'Déconnecter' }
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

const SiderMenu = () => {
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
                { key: `${key}:${setWorkspaceCounter}`, 
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
    setSubMenuCounter((prevCounter) => prevCounter + 1);
  };

  const addSubItem = (key, event, type) => {
    event.stopPropagation();

    if (type === 'collection') {
        setMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.key === key
                    ? {
                          ...item,
                          children: [
                              ...item.children,
                              {key: `collection:${collectionCounter}`, label: `Collection ${collectionCounter}`}
                          ],
                      }
                    : item
            )
        );
        setCollectionCounter((prevCounter) => prevCounter + 1);
    } else if (type === 'history') {
        setMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.key === key
                    ? {
                          ...item,
                          children: [
                              ...item.children,
                              {key: `history:${historyCounter}`, label: `History ${historyCounter}`}
                          ],
                      }
                    : item
            )
        );
        setHistoryCounter((prevCounter) => prevCounter + 1);
    }
};

  const deleteSubMenu = (parentKey, subKey, event) => {
    event.stopPropagation();
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === parentKey
          ? {
              ...item,
              children: item.children.filter((child) => child.key !== subKey),
            }
          : item
      )
    );
  };

  const deleteSubItem = (parentKey, subKey, event) => {
    event.stopPropagation();
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === parentKey
          ? {
              ...item,
              children: item.children.map((child) =>
                  child.key === subKey
                      ? {
                          ...child,
                          children: child.children.filter((subItem) => subItem.key !== subKey)
                        }
                      : child
              )
            }
          : item
      )
    );
  };

  return (
    <Menu
      mode="inline"
      items={menuItems.map((item) => ({
          ...item,
          children: item.children?.map((child) => ({
              ...child,
              label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{child.label}</span>
                      {item.key !== 'account' && (
                          <CloseOutlined
                              style={{ color: '#054d29', cursor: 'pointer', marginLeft: '8px' }}
                              onClick={(event) => deleteSubMenu(item.key, child.key, event)}
                          />
                      )}
                      {child.key === 'collection' && (
                          <Button
                              size="small"
                              onClick={(event) => addSubItem(item.key, event, 'collection')}
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
                      {child.key === 'history' && (
                          <Button
                              size="small"
                              onClick={(event) => addSubItem(item.key, event, 'history')}
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
                      {(child.key.match(/^(collection|history):\d+$/)) && (
                          <CloseOutlined
                              style={{ color: '#054d29', cursor: 'pointer', marginLeft: '8px' }}
                              onClick={(event) => deleteSubItem(item.key, child.key, event)}
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
