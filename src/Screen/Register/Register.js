// src/components/RegisterForm.js
import React from 'react';
import { Form, Input, Button } from 'antd';

const RegisterForm = ({ toggleForm }) => {
  const onFinish = (values) => {
    console.log('Register form values:', values);
  };

  return (
    <Form name="register-form" onFinish={onFinish}>
      {/* ... Registration form fields */}
      <Button type="primary" htmlType="submit">
        Register
      </Button>
      <div>
        Already have an account?{' '}
        <Button type="link" onClick={toggleForm}>
          Login
        </Button>
      </div>
    </Form>
  );
};

export default RegisterForm;
