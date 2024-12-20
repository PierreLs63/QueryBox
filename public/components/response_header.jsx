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

const ResponseHeader = ({ dataResponseHeader = [] }) => {
  return (
    <Table
      columns={tableResponseHeader}
      dataSource={dataResponseHeader}
      pagination={{ pageSize: 5, showSizeChanger: false}}
      size="small"
    />
  );
};

export default ResponseHeader;
