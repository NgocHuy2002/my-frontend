import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import axios from "axios";
import moment from "moment";

const onFinish = (values) => {
  console.log("Received values of form:", values);
};
const PhieuKiemDinh = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [file] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [privateKeyFile, setPrivateKeyFile] = useState(null);
  const handlePrivateKeyChange = (event) => {
    const file = event.target.files[0];
    setPrivateKeyFile(file);
  };
  const handleAcceptProduct = async () => {
    const result = form.getFieldsValue();
    const value = {
      isSend: "APPROVED",
    };
    // Make a PUT request to update the product
    await axios
      .put(
        `http://localhost:3001/api/product/${location.state.productId}`,
        value
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    const formData = new FormData();
    formData.append("privateKey", privateKeyFile);
    formData.append("data", JSON.stringify(result));
    await axios
      .post("http://localhost:3001/api/contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
      setIsOpen(false);
      form.resetFields();
      file.resetFields();
  };
  const openModel = () => {
    setIsOpen(true);
  };
  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      const userList = response.data.map((e) => ({
        value: e._id,
        label: e.username,
      }));
      setOptions(userList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fillForm = async () => {
    await form.setFieldsValue({
      filename: location.state.name,
      createAt: moment(location.state.dateSend),
      sendBy: location.state.sendBy,
    });
  };
  useEffect((e) => {
    getUser();
    fillForm();
  }, []);
  return (
    <>
      <Card
        title={"Chứng chỉ kiểm định chất lượng"}
        style={{
          // textAlign: "center",
          overflow: "auto",
          paddingBottom: 50,
          maxHeight: "100%",
        }}
      >
        <Form
          name="dynamic_form_nest_item"
          form={form}
          onFinish={openModel}
          style={{
            maxWidth: 800,
          }}
          autoComplete="off"
        >
          <Row>
            <Space>
              <Col>
                <Form.Item name={"filename"} label={"Tên sản phẩm"}>
                  <Input disabled bordered={false} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name={"createAt"} label={"Ngày gửi"}>
                  <DatePicker disabled bordered={false} />
                </Form.Item>
              </Col>
            </Space>
          </Row>
          <Form.Item name={"sendBy"} label={"Đơn vị gửi"}>
            <Select options={options} disabled bordered={false} />
          </Form.Item>
          <Form.Item name={"decription"} label={"Nhận xét"}>
            <TextArea style={{ height: 250, resize: "none" }} />
          </Form.Item>
          <p>Kết quả thử nghiệm</p>
          <Form.List name="test" initialValue={[{ name: "" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      label={"Chỉ tiêu"}
                      {...restField}
                      name={[name, "testName"]}
                      rules={[
                        {
                          required: true,
                          message: "Bạn chưa nhập tên chỉ tiêu",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Tên chỉ tiêu"
                        style={{ width: "10vw" }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "result"]}
                      rules={[
                        {
                          required: true,
                          message: "Chưa ghi kết quả ",
                        },
                      ]}
                    >
                      <Input placeholder="Kết quả" style={{ width: "10vw" }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "final"]}
                      rules={[
                        {
                          required: true,
                          message: "Chưa chọn",
                        },
                      ]}
                    >
                      <Select
                        options={[
                          { value: true, label: "Đạt" },
                          { value: false, label: "Không đạt" },
                        ]}
                        placeholder="Kết luận"
                        style={{ width: "10vw" }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận chứng chỉ
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => handleAcceptProduct()}
      >
        <Form form={file}>
          <Form.Item>
            <input
              type="file"
              accept=".pem"
              id="privateKeyFile"
              onChange={handlePrivateKeyChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PhieuKiemDinh;
