import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserView from './components/UserView';

const { Content } = Layout;

function App() {
  return (
    <Layout>
      <Content>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add-user" element={<UserForm />} />
          <Route path="/edit-user/:id" element={<UserForm />} />
          <Route path="/view-user/:id" element={<UserView />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
