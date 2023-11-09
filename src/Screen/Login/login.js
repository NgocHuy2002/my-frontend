import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  Row,
  message,
  Alert,
  Modal,
} from "antd";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const LoginScreen = () => {
  const [users, setUsers] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [isCompany, setIsCompany] = useState(false);
  const [isModel, setIsModal] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [privateKeyBase64, setpk64] = useState();
  const [privateKeyFileName, setpk] = useState();
  const [publicKeyBase64, setplk64] = useState();
  const [publicKeyFileName, setplk] = useState();
  const loginUser = async (e) => {
    let username = e.username;
    let password = e.password;
    try {
      let response;
      if (isCompany) {
        response = await axios.post("http://localhost:3001/api/company/login", {
          username,
          password,
        });
      } else {
        response = await axios.post("http://localhost:3001/api/users/login", {
          username,
          password,
        });
      }

      if (response) {
        const token = response.data.token;
        const info = isCompany ? response.data.company : response.data.user;
        await localStorage.setItem("token", token);
        await localStorage.setItem("user", JSON.stringify(info));
        if (isCompany === true) {
          await navigate("/check");
        } else {
          await navigate("/product");
        }
        await setIsCompany(false);
      }
    } catch (error) {
      if (error.response) {
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "An error occurred during login.",
        });
      }
    }
  };
  const registerUser = async (e) => {
    let username = e.username;
    let password = e.password;
    let email = e.email;
    try {
      let response;
      if (isCompany) {
        let name = e.name;
        response = await axios.post("http://localhost:3001/api/company/", {
          username,
          password,
          email,
          name,
        });
      } else {
        response = await axios.post(
          "http://localhost:3001/api/users/register",
          { username, password, email }
        );
      }
      if (response) {
        if (isCompany) {
          console.log(response.data);
          setpk64(response.data.privateKeyBase64);
          setpk(response.data.privateKeyFileName);
          setplk64(response.data.publicKeyBase64);
          setplk(response.data.publicKeyFileName);
          setIsModal(true);
        }
        await messageApi.open({
          type: "success",
          content: response.data.message,
        });
        form.resetFields();
        setIsCompany(false);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  // ===================================== Download key ==================================
  function downloadKeyFile(fileName, base64Content) {
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleDownload = async () => {
    setIsModal(false);
    await downloadKeyFile(privateKeyFileName, privateKeyBase64);
    await downloadKeyFile(publicKeyFileName, publicKeyBase64);
  };

  // ============================== USEEFFECT ======================================

  return (
    <>
      <div
        className="gradient"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1
          style={{
            paddingBottom: "20px",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
          }}
        >
          Cấp phát chứng chỉ kiểm định chất lượng
        </h1>
        {contextHolder}
        <Card
          size="small"
          style={{
            width: "80%",
            maxWidth: "400px",
            borderRadius: "10px",
          }}
          className="card-with-gradient"
          title={hidden === true ? "Đăng nhập" : "Đăng ký"}
        >
          <Form
            name="login-form"
            layout="vertical"
            onFinish={hidden === true ? loginUser : registerUser}
            form={form}
          >
            <Form.Item
              label="Tài khoản"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Tài khoản không thể để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu không thể để trống!",
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
                  type: "email",
                  message: "Email không hợp lệ!",
                },
                {
                  required: !hidden,
                  message: "Email không thể để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            {isCompany && hidden == false ? (
              <Form.Item
                label="Tên trung tâm kiểm định"
                name="name"
                // hidden={!isCompany}
                rules={[
                  {
                    required: isCompany,
                    message: "Tên trung tâm không thể để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null}
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Checkbox onChange={() => setIsCompany(!isCompany)}>
                Cơ sở kiểm định
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">
                {hidden === true ? "Login" : "Register"}
              </Button>
            </Form.Item>
            {hidden === true ? (
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Chưa có tài khoản ?
                <Button
                  type="link"
                  onClick={() => {
                    setHidden(!hidden);
                  }}
                >
                  Đăng ký
                </Button>
              </Row>
            ) : (
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Already have an account?
                <Button
                  type="link"
                  onClick={() => {
                    setHidden(!hidden);
                  }}
                >
                  Đăng nhập
                </Button>
              </Row>
            )}
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button icon={<SearchOutlined />}>
                Tìm thông tin kiểm định
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Modal open={isModel} onOk={() => handleDownload()}>
        <p>
          Pucblic key và Private key của bạn đã được tạo trình duyệt sẽ lưu khóa
          vào máy tính của bạn
        </p>
        <p style={{ color: "red" }}>
          * Lưu ý: Để xác thực kiểm duyệt bạn cần phải có khóa, của bạn là duy
          nhất do đó vui lòng không công khai Private key
        </p>
      </Modal>
    </>
  );
};

export default LoginScreen;
