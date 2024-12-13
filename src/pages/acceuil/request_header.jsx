import { Table } from 'antd';

const dict = {
  Host: 'value_host',
  User_Agent: 'value_userAgent',
  Accept: 'value_accept',
  Accept_Encoding: 'value_acceptEncoding',
  Connection: 'value_connection',
};

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

const keys = Object.keys(dict);

const data = Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  keyData: keys[i % keys.length],
  value: dict[keys[i % keys.length]],
  description: `Description for ${keys[i % keys.length]}`,
}));

const RequestHeader = () => {
  return (
    <Table
      rowSelection={{ type: 'checkbox' }}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default RequestHeader;
