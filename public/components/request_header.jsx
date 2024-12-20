import { Table, Button, Input, Form, Modal, Typography } from 'antd';
import { useState } from 'react';

const columns = [
  {
    title: 'Key',
    dataIndex: 'keyData',
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

const RequestHeader = ({ headerData = [], setHeaderData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Add new rows to table
  const handleAdd = (values) => {
    const newRow = {
      key: headerData.length.toString(),
      keyData: values.keyData,
      value: values.value,
      description: values.description,
    };
    setHeaderData([...headerData, newRow]);
    setIsModalOpen(false);
    form.resetFields();
  };

  // Open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Add a row
  const dataWithAddButton = [
    ...headerData,
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
      <Table
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={dataWithAddButton}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        size="small"
      />

      <Modal
        title="Ajouter une ligne"
        open={isModalOpen}
        onCancel={handleCancel}
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
