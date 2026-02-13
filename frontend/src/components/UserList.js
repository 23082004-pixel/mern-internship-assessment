import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Dropdown, 
  Menu, 
  Modal, 
  message, 
  Pagination,
  Avatar,
  Row,
  Col,
  Layout,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FileExcelOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CaretDownOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';

const { Header, Content } = Layout;
const { Title } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Main data loading effect - handles both search and regular pagination
  useEffect(() => {
    const loadData = async () => {
      if (debouncedSearchKeyword.trim()) {
        // Search mode
        setSearchLoading(true);
        try {
          const response = await userAPI.searchUsers(debouncedSearchKeyword);
          if (response.data.success) {
            setUsers(response.data.data);
            setTotalRecords(response.data.count);
          }
        } catch (error) {
          message.error('Search failed');
        } finally {
          setSearchLoading(false);
        }
      } else {
        // Normal pagination mode
        setLoading(true);
        try {
          const response = await userAPI.getUsers(pagination.current, pagination.pageSize);
          if (response.data.success) {
            setUsers(response.data.data);
            setTotalRecords(response.data.pagination.totalRecords);
          }
        } catch (error) {
          message.error('Failed to fetch users');
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [debouncedSearchKeyword, pagination.current, pagination.pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExport = async () => {
    try {
      const response = await userAPI.exportUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success('Users exported successfully');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const handleDelete = useCallback((id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        // Optimistically remove from UI
        const originalUsers = users;
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        
        try {
          await userAPI.deleteUser(id);
          message.success('User deleted successfully');
          // Trigger a refresh to get updated pagination
          setDebouncedSearchKeyword('');
        } catch (error) {
          message.error('Failed to delete user');
          // Restore on error
          setUsers(originalUsers);
        }
      },
    });
  }, [users]);

  const getActionMenu = useCallback((record) => (
    <Menu>
      <Menu.Item 
        key="view" 
        icon={<EyeOutlined />}
        onClick={() => navigate(`/view-user/${record._id}`)}
      >
        View
      </Menu.Item>
      <Menu.Item 
        key="edit" 
        icon={<EditOutlined />}
        onClick={() => navigate(`/edit-user/${record._id}`)}
      >
        Edit
      </Menu.Item>
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDelete(record._id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  ), [navigate, handleDelete]);

  const handleStatusChange = useCallback(async (userId, newStatus) => {
    // Optimistically update the UI first
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      )
    );

    try {
      await userAPI.updateUser(userId, { status: newStatus });
      message.success('Status updated successfully');
    } catch (error) {
      message.error('Failed to update status');
      // Revert on error - trigger a refresh
      setDebouncedSearchKeyword(''); // This will trigger the data loading effect
    }
  }, []);

  const getStatusDropdown = useCallback((record) => (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item 
            key="active" 
            onClick={() => handleStatusChange(record._id, 'Active')}
          >
            Active
          </Menu.Item>
          <Menu.Item 
            key="inactive" 
            onClick={() => handleStatusChange(record._id, 'InActive')}
          >
            InActive
          </Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <Button 
        style={{ 
          backgroundColor: record.status === 'Active' ? '#d4626a' : '#d4626a',
          borderColor: '#d4626a',
          color: 'white',
          borderRadius: '4px'
        }}
      >
        {record.status} <CaretDownOutlined />
      </Button>
    </Dropdown>
  ), [handleStatusChange]);

  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 80,
      render: (text, record, index) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => getStatusDropdown(record)
    },
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      width: 80,
      render: (profile) => (
        <Avatar 
          size="small" 
          src={profile || undefined} 
          icon={<UserOutlined />} 
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ], [getActionMenu, getStatusDropdown, pagination]);

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          backgroundColor: '#4a4a4a', 
          padding: '0 50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          MERN stack developer practical task
        </Title>
      </Header>
      
      <Content style={{ padding: '20px 50px', backgroundColor: '#f5f5f5' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ 
                height: '40px',
                borderRadius: '4px'
              }}
              suffix={
                searchLoading ? (
                  <LoadingOutlined style={{ color: '#d4626a' }} />
                ) : (
                  <SearchOutlined style={{ color: '#d4626a' }} />
                )
              }
            />
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Space style={{ float: 'right' }}>
              <Button 
                icon={<PlusOutlined />}
                onClick={() => navigate('/add-user')}
                style={{ 
                  backgroundColor: '#d4626a',
                  borderColor: '#d4626a',
                  color: 'white',
                  borderRadius: '4px',
                  height: '40px'
                }}
              >
                Add User
              </Button>
              <Button 
                icon={<FileExcelOutlined />}
                onClick={handleExport}
                style={{ 
                  backgroundColor: '#d4626a',
                  borderColor: '#d4626a',
                  color: 'white',
                  borderRadius: '4px',
                  height: '40px'
                }}
              >
                Export To Csv
              </Button>
            </Space>
          </Col>
        </Row>

        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={loading || searchLoading}
            pagination={false}
            scroll={{ x: 800 }}
            size="middle"
            style={{ margin: 0 }}
            className="custom-table"
            headerStyle={{ 
              backgroundColor: '#4a4a4a',
              color: 'white'
            }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        </div>

      <Row style={{ marginTop: 16 }}>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={totalRecords}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </Col>
      </Row>
      </Content>
    </Layout>
  );
};

export default UserList;
