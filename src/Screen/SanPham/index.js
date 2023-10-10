import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import axios from "axios";

const FormSanPham = (prop) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const info = JSON.parse(localStorage.getItem('user'));
  const userId = info ? info._id : null;
  const [imageUrl, setImageUrl] = useState("");

  const saveImage = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "form-image.png");
    try {
      const response = await axios.post(
        "http://localhost:3001/api/images/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        messageApi.open({
          type: "success",
          content: response.data.message,
        });
        form.resetFields();
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  const saveProduct = async (e) => {
    let name = e.name;
    let date = e.date;
    let number = e.number;
    let hsd = e.hsd ? e.hsd + " " + e.after : "Vô thời hạn";
    let ingredient = e.ingredient;
    let createBy = userId;
    try {
      const response = await axios.post("http://localhost:3001/api/product", {
        createBy,
        name,
        number,
        date,
        hsd,
        ingredient,
      });
      if (response) {
        messageApi.open({
          type: "success",
          content: "Thêm mới sản phẩm thành công !!",
        });
        form.resetFields();
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  const optinon = [
    { value: "Ngày", label: "Ngày" },
    { value: "Tháng", label: "Tháng" },
    { value: "Năm", label: "Năm" },
  ];
  const afterSelect = <Select defaultValue={"Tháng"} style={{width: 150}} options={optinon} />;
  return (
    <Card id="form-card">
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={saveProduct}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: "Tên sản phẩm không thể để trống!",
            },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Ngày sản xuất" name="date">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Ngày sản xuất"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hạn sử dụng"
              name="hsd"
              // rules={[
              //   {
              //     required: true,
              //     message: "Hạn sử dụng không thể để trống!",
              //   },
              // ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Thời gian sử dụng"
                addonAfter={
                  <Form.Item noStyle name="after">
                    {afterSelect}
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Số lượng sản phẩm" name="number">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Số lượng sản phẩm"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value) => value.replace(/\./g, '')}
          />
        </Form.Item>
        <Form.Item
          label="Thành phần"
          name="ingredient"
          rules={[
            {
              required: true,
              message: "Thành phần không thể để trống!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Thành phần có trong sản phẩm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
      {/* <Image src={imageUrl}/> */}
    </Card>
  );
};
export default FormSanPham;
