import { Form, Input, Popconfirm, Table, Typography } from 'antd';

const originData = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i.toString(),
  keyData: `Param ${i}`,
  value: `Value ${i}`,
  description: `Description ${i}`,
}));

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
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
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
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginInlineEnd: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
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
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
  
    return (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={[]}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    );
    
  };

export default RequestParam