import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Radio, 
  Select, 
  Upload, 
  message,
  Card,
  Row,
  Col,
  Avatar,
  Layout,
  Typography
} from 'antd';
import { 
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../api/api';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;

const UserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getUserById(id);
        if (response.data.success) {
          const user = response.data.data;
          form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            status: user.status,
            location: user.location,
          });
          
          if (user.profile) {
            setFileList([{
              uid: '-1',
              name: 'profile.jpg',
              status: 'done',
              url: `http://localhost:5000${user.profile}`,
            }]);
          }
        }
      } catch (error) {
        message.error('Failed to fetch user details');
      }
    };

    if (id) {
      setIsEdit(true);
      fetchUser();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        profile: fileList.length > 0 && fileList[0].originFileObj ? fileList[0].originFileObj : null,
      };

      let response;
      if (isEdit) {
        response = await userAPI.updateUser(id, formData);
      } else {
        response = await userAPI.createUser(formData);
      }

      if (response.data.success) {
        message.success(`User ${isEdit ? 'updated' : 'created'} successfully`);
        // Immediate navigation without waiting
        navigate('/');
      }
    } catch (error) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '40px'
        }}>
          <Card 
            style={{ 
              width: '100%', 
              maxWidth: '800px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#d4626a',
                  marginBottom: '16px'
                }}
              />
              <h2 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#262626'
              }}>
                {isEdit ? 'Edit User Details' : 'Register Your Details'}
              </h2>
            </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: 'Male',
            status: 'Active',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>First name</span>}
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name!' }]}
              >
                <Input 
                  placeholder="Enter FirstName" 
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Last Name</span>}
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name!' }]}
              >
                <Input 
                  placeholder="Enter LastName" 
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Email address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  placeholder="Enter Email" 
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Mobile</span>}
                name="mobile"
                rules={[{ required: true, message: 'Please enter mobile number!' }]}
              >
                <Input 
                  placeholder="Enter Mobile" 
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: '500' }}>Select Your Gender</span>}
            name="gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Radio.Group size="large">
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Select Your Status</span>}
                name="status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select 
                  placeholder="Select..." 
                  size="large"
                  style={{ borderRadius: '6px' }}
                >
                  <Option value="Active">Active</Option>
                  <Option value="InActive">InActive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Select Your Profile</span>}
                name="profile"
              >
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    size="large"
                    style={{ 
                      borderRadius: '6px',
                      width: '100%',
                      height: '40px'
                    }}
                  >
                    Choose file
                  </Button>
                </Upload>
                {fileList.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {fileList[0].name}
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: '500' }}>Enter Your Location</span>}
            name="location"
            rules={[{ required: true, message: 'Please enter location!' }]}
          >
            <Input 
              placeholder="Enter Your Location" 
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ 
                width: '100%',
                height: '48px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: '#d4626a',
                borderColor: '#d4626a'
              }}
            >
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>

          {!isEdit && (
            <Form.Item>
              <Button 
                type="link" 
                onClick={() => navigate('/')}
                style={{ width: '100%', textAlign: 'center' }}
              >
                Back to User List
              </Button>
            </Form.Item>
          )}
        </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default UserForm;
