import { Table } from 'antd';

import { createStyles } from 'antd-style';
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

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

const ResponseHeader = ({ dataResponseHeader }) => {
  const { styles } = useStyle();

  return (
    <Table
      className={styles.customTable}
      columns={tableResponseHeader}
      dataSource={dataResponseHeader}
      pagination={{ pageSize: 50 }}
      scroll={{ y: 55 * 5 }}
      size="small"
    />
  );
};

export default ResponseHeader;
