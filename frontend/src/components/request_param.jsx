import { useState } from 'react';
import { Form, Input, Button, Table, Typography, Popconfirm, Modal } from 'antd';
import useRequestInputStore from '../zustand/RequestInput';
import './request_param.css'
import { v4 as uuidv4 } from 'uuid';
import useCurrentState from '../zustand/CurrentState';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  const rules = dataIndex === 'keyData'
    ? [{ required: true, message: `Please Input ${title}!` }]
    : [];

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={rules}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const RequestParam = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const RequestInputs = useRequestInputStore(); 
  const CurrentState = useCurrentState();

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      keyData: '',
      value: '',
      description: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
    form.resetFields();
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...RequestInputs.params];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        RequestInputs.setParams(newData);
        setEditingKey('');
        form.resetFields();
      } else {
        newData.push(row);
        RequestInputs.setParams(newData);
        setEditingKey('');
        form.resetFields();
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  
  const handleAdd = (values) => {
    const newRow = {
      key: uuidv4(),
      keyData: values.keyData,
      value: values.value || '',
      description: values.description || '',
    };
    RequestInputs.setParams([...RequestInputs.params, newRow]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteRow = (key) => {
    const newData = RequestInputs.params.filter(item => item.key !== key);
    RequestInputs.setParams(newData);
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'keyData',
      width: '20%',
      editable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '30%',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '30%',
      editable: true,
    },
    ...(CurrentState.responseId === null
      ? [
          {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
              if (typeof record.key === 'string' && record.key.startsWith('add-row')) {
                return null;
              }
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.key)}
                    style={{ marginRight: 8, color: '#388E3C' }}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={cancel}
                    okButtonProps={{
                      style: {
                        backgroundColor: 'transparent',
                        borderColor: 'black',
                        color: '#388E3C',
                      },
                      className: 'custom-ok-button',
                    }}
                    cancelButtonProps={{
                      style: {
                        color: 'red',
                        borderColor: 'black',
                      },
                      className: 'custom-cancel-button',
                    }}
                  >
                    <a style={{ color: 'red' }}>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <Typography.Link
                    disabled={editingKey !== ''}
                    onClick={() => edit(record)}
                    style={{ marginRight: 8, color: '#397d4b' }}
                  >
                    Edit
                  </Typography.Link>
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteRow(record.key)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: {
                        backgroundColor: 'transparent',
                        borderColor: 'black',
                        color: '#388E3C',
                      },
                      className: 'custom-ok-button',
                    }}
                    cancelButtonProps={{
                      style: {
                        color: 'red',
                        borderColor: 'black',
                      },
                      className: 'custom-cancel-button',
                    }}
                  >
                    <a style={{ color: 'red' }}>Delete</a>
                  </Popconfirm>
                </span>
              );
            },
          },
        ]
      : []),
  ];
  

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: typeof record.key === 'string' && record.key.startsWith('add-row'),
    }),
  };

  // Line + New Row
  const dataWithAddButton = [
    ...RequestInputs.params,
    ...(CurrentState.responseId === null
      ? [
          {
            key: `add-row-${Date.now()}`,
            keyData: (
              <Typography.Link onClick={showModal} style={{ fontSize: '12px', color: '#54877c' }}>
                + New Row
              </Typography.Link>
            ),
            value: '',
            description: '',
          },
        ]
      : []),
  ];
  

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataWithAddButton}
          columns={mergedColumns}
          size="small"
          pagination={false}
          rowSelection={CurrentState.responseId === null ? rowSelection : null}
        />
      </Form>

      <Modal title="Ajouter une ligne" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
              label="Key"
              name="keyData"
              rules={[{ required: true, message: 'Veuillez saisir une clé!' }]}
            >
            <Input placeholder="Veuillez saisir une clé" />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[]}
          >
            <Input placeholder="Veuillez saisir une valeur" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[]}
          >
            <Input placeholder="Veuillez saisir une description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block className='confirm-button'>
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RequestParam;
