import { Table, Button, Input, Form, Modal, Typography, Popconfirm } from 'antd';
import { useState } from 'react';
import './request_header.css';


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

const RequestHeader = () => {
  const [form] = Form.useForm();
  const [headerData, setHeaderData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...headerData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setHeaderData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setHeaderData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAdd = (values) => {
    const newRow = {
      key: `${headerData.length}-${Date.now()}`, // 确保 key 唯一
      keyData: values.keyData,
      value: values.value || '',
      description: values.description || '',
    };
    setHeaderData([...headerData, newRow]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteRow = (key) => {
    const newData = headerData.filter(item => item.key !== key);
    setHeaderData(newData);
  };


  const columns = [
    {
      title: 'Key',
      dataIndex: 'keyData',
      editable: true,
      width: '20%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      editable: true,
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true,
      width: '30%',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        if (record.key.startsWith('add-row')) {
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
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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
            >
              <a style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
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

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // 添加 “+ New Row” 按钮
  const dataWithAddButton = [
    ...headerData,
    {
      key: `add-row-${Date.now()}`, // 确保每次渲染时 key 唯一
      keyData: (
        <Typography.Link onClick={showModal} style={{ fontSize: '12px', color: '#54877c' }}>
          + New Row
        </Typography.Link>
      ),
      value: '',
      description: '',
    },
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
          rowClassName="editable-row"
          size="small"
          pagination={false}
          rowSelection={rowSelection}
        />
      </Form>

      <Modal
        title="Ajouter une ligne"
        open={isModalOpen}
        onCancel={handleCancelModal}
        footer={null}
      >
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
            <Button type="primary" htmlType="submit" block className='button'>
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RequestHeader;