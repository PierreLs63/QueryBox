import { Table } from 'antd';

const tableResponseHeader = [
  {
    title: 'Key',
    dataIndex: 'keyData',
    width: 250,
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
];

const ResponseHeader = () => {
  return (
    <Table
      columns={tableResponseHeader}
      dataSource={[]}
      pagination={false}
      style={{
        width: '100%',
      }}
    />
  );
};

export default ResponseHeader;
