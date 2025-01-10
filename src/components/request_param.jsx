import { useState } from 'react';
import { Form, Input, Button, Table, Typography, Popconfirm, Modal } from 'antd';
import './request_param.css'

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
  const [paramReqData, setParamReqData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const newData = [...paramReqData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setParamReqData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAdd = (values) => {
    const newRow = {
      key: paramReqData.length.toString(),
      keyData: values.keyData,
      value: values.value || '',
      description: values.description || '',
    };
    setParamReqData([...paramReqData, newRow]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteRow = (key) => {
    const newData = paramReqData.filter(item => item.key !== key);
    setParamReqData(newData);
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
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        if (record.key === 'add-row') {
          return null;
        }

        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 8,
                color: '#388E3C'
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={cancel}
              okButtonProps={{
                className: 'custom-ok-button',
                style: {
                  backgroundColor: 'transparent',
                  borderColor: 'black',
                  color: '#388E3C',
                },
              }}
              cancelButtonProps={{
                className: 'custom-cancel-button',
                style: {
                  color: 'red',
                  borderColor: 'black',
                },
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
              style={{
                color: '#397d4b',
              }}
            >
              Edit
            </Typography.Link>
            <Typography.Link 
              onClick={() => deleteRow(record.key)}
              style={{
                marginInlineStart: 8,
                color: 'red',
              }}
            >
              Delete
            </Typography.Link>
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

  const dataWithAddButton = [
    ...paramReqData,
    {
      key: 'add-row',
      keyData: (
        <Typography.Link onClick={showModal} style={{ fontSize: '12px' }}>
          + Add Row
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
          pagination={{ pageSize: 5, onChange: cancel, showSizeChanger: false }}
          size='small'
        />
      </Form>

      <Modal
        title="Add New Row"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            label="Key"
            name="keyData"
            rules={[{ required: true, message: 'Please enter a key!' }]}
          >
            <Input placeholder="Please enter a key" />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[]}
          >
            <Input placeholder="Please enter a value" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[]}
          >
            <Input placeholder="Please enter a description" />
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

export default RequestParam;