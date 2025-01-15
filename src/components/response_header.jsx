import { Table } from 'antd';
import useResponseDataStore from '../zustand/ResponseData';

const ResponseHeader = () => {

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

  const ResponseData = useResponseDataStore();

  const dataSource = ResponseData.header.map((item) => ({
    keyData: item.key,
    value: item.value,
  }));
  

const ResponseHeader = () => {
  const ResponseData = useResponseDataStore();

  const headers = Array.isArray(ResponseData.header) ? ResponseData.header.map((header, index) => ({
    key: index,
    keyData: header.key,
    value: header.value,
  })) : [];

  console.log('headers', headers);

  return (
    <Table
      columns={tableResponseHeader}
      dataSource={headers}
      pagination={false}
      size="small"
    />
  );
};

export default ResponseHeader;
