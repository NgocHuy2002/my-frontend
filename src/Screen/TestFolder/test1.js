import React, { useState } from "react";
import "../Login/login.css";
import { Button, Card, message, Steps, theme } from "antd";
import LoginScreen from "../Login/login.js";
// import LoginScreen from "./Screen/Login/login.js";
const steps = [
  {
    title: "Login",
  },
  {
    title: "Generate Keys",
  },
  {
    title: "Success",
  },
];
const Test1 = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <div style={{ height: "100vh" }}>
      <Card
        size="small"
        style={{ width: "100%", height: '100%' }}
        className="card-with-gradient"
        // title={hidden === true ? "Đăng nhập" : "Đăng ký"}
      >
        <Steps current={current} items={items} />
        <LoginScreen />
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
export default Test1;
