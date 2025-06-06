import React from 'react';
import { Table, Tag, Button } from 'antd';

const UserTable = ({ data }) => {
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="green">{status}</Tag>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div>
          <Button type="link">View</Button>
          <Button type="link">Edit</Button>
          <Button type="link" danger>Ban</Button>
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

export default UserTable;