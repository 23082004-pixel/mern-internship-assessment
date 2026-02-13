import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Descriptions, 
  Avatar, 
  Tag, 
  Button,
  Row,
  Col,
  Space,
  message,
  Layout,
  Typography
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../api/api';

const { Header, Content } = Layout;
const { Title } = Typography;

const UserView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUser = useCallback(async () => {
    try {
      const response = await userAPI.getUserById(id);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <Card loading />;
  }

  if (!user) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <UserOutlined style={{ fontSize: '48px', color: '#ccc' }} />
          <h3>User not found</h3>
          <Button type="primary" onClick={() => navigate('/')}>
            Back to List
          </Button>
        </div>
      </Card>
    );
  }

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
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ 
            marginBottom: 24,
            backgroundColor: '#d4626a',
            borderColor: '#d4626a',
            color: 'white'
          }}
        >
          Back to List
        </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar 
              size={120} 
              src={user.profile || null}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <h2>{user.fullName}</h2>
            <Tag color={user.status === 'Active' ? '#d4626a' : '#ff4d4f'}>
              {user.status}
            </Tag>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="User Details">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Full Name">
                <Space>
                  <UserOutlined />
                  {user.fullName}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email Address">
                <Space>
                  <MailOutlined />
                  {user.email}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Mobile Number">
                <Space>
                  <PhoneOutlined />
                  {user.mobile}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Gender">
                {user.gender}
              </Descriptions.Item>
              
              <Descriptions.Item label="Status">
                <Tag color={user.status === 'Active' ? '#d4626a' : '#ff4d4f'}>
                  {user.status}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Location">
                <Space>
                  <EnvironmentOutlined />
                  {user.location}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Joined Date">
                <Space>
                  <CalendarOutlined />
                  {new Date(user.createdAt).toLocaleDateString()}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Last Updated">
                {new Date(user.updatedAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Additional Information">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {user.gender}
                  </div>
                  <div style={{ color: '#666' }}>Gender</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {user.status}
                  </div>
                  <div style={{ color: '#666' }}>Account Status</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {user.mobile}
                  </div>
                  <div style={{ color: '#666' }}>Contact</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {user.location}
                  </div>
                  <div style={{ color: '#666' }}>Location</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      </Content>
    </Layout>
  );
};

export default UserView;
