import { Table, Button, Input, Form, Modal, Typography } from 'antd';
import { useState } from 'react';
import './request_header.css';

const RequestHeader = ({ headerData, setHeaderData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (values) => {
    const newRow = {
      key: `${headerData.length}-${Date.now()}`,
      keyData: values.keyData,
      value: values.value,
      description: values.description,
    };
    setHeaderData([...headerData, newRow]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Line + New Row
  const dataWithAddButton = [
    ...headerData,
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
  ];

  const columns = [
    {
      title: 'Key',
      dataIndex: 'keyData',
      render: (text) => (typeof text === 'string' ? text : text),
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
  ];

  return (
    <>
      <Table
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={dataWithAddButton}
        pagination={false}
        size="small"
      />
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
            rules={[{ required: true, message: 'Veuillez saisir une valeur!' }]}
          >
            <Input placeholder="Veuillez saisir une valeur" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Veuillez saisir une description!' }]}
          >
            <Input placeholder="Veuillez saisir une description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Confirmer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RequestHeader;