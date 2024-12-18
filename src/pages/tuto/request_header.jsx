import { Table } from 'antd';

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

const RequestHeader = () => {
  return (
    <Table
      rowSelection={{ type: 'checkbox' }}
      columns={columns}
      dataSource={[]}
      pagination={false}
    />
  );
};

export default RequestHeader;
