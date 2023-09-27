import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import { Button, Checkbox, Form, Input, Card, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [users, setUsers] = useState([]);
  const [hidden, setHidden] = useState(true);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const loginUser = async (e) => {
    let username = e.username;
    let password = e.password
    try {
      const response = await axios.post("http://localhost:3001/api/users/login", { username, password });
      if (response) {
        const token = response.data.token;
        const info = response.data.user
        localStorage.setItem('token', token);
        // setUsers(response.data.user)
        navigate('/home', { state: { info } });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    }
  };
  const registerUser = async (e) => {
    let username = e.username;
    let password = e.password
    let email = e.email;
    try {
      const response = await axios.post("http://localhost:3001/api/users/register", { username, password, email });
      if (response) {
        messageApi.open({
          type: 'success',
          content: response.data.message,
        });
        form.resetFields();
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    }
  };

  return (
    <div className='gradient' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {contextHolder}
      <Card className='card-with-gradient' title='Login'>
        <Form name="login-form" onFinish={hidden === true ? loginUser : registerUser} form={form}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            hidden={hidden}
            rules={[
              {
                required: !hidden,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">
              {hidden === true ? 'Login' : 'Register'}
            </Button>
          </Form.Item>
          <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Don't have an account?
            <Button type="link" onClick={() => {setHidden(!hidden)}}>
              Register
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
    /* 
    <h2>Users</h2>
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          Username: {user.username}, Email: {user.email}
        </li>
      ))}
    </ul> */
  );
}

export default LoginScreen;
