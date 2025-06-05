import React from 'react';
import { Table, Tag, Button } from 'antd';

const HealthIndicator = ({ data }) => {
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="green">{status}</Tag>
    },
    {
      title: 'TÊN CHỈ SỐ',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'LOẠI',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'ĐƠN VỊ',
      dataIndex: 'unit',
      key: 'unit'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div>
          <Button type="link">Edit</Button>
          <Button type="link" danger>Remove</Button>
        </div>
      )
    }
  ];

  return <Table 
    dataSource={data} 
    columns={columns} 
    pagination={false}
    rowKey="id"
  />;
};

export default HealthIndicator;