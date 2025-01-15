import { Table } from 'antd';
import useResponseDataStore from '../zustand/ResponseData'

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
  

  return (
    <Table
      columns={tableResponseHeader}
      dataSource={dataSource}
      pagination={false}
      size="small"
    />
  );
};

export default ResponseHeader;
