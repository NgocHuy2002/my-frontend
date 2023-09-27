import { Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import axios from 'axios';

const FormSanPham = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [imageUrl, setImageUrl] = useState('');
  // const imageId = '6501c9b35d709cc22769aa50';
  // useEffect(() => {
  //   // Fetch the image data from the backend
  //   const fetchImage = async () => {
  //     try {
        // const response = await axios.get(`http://localhost:3001/api/images/image/${imageId}`);
        // const baseUrl = 'http://localhost:3001/api/images/image';
        // Create a data URL from the received binary data and content type
        // const contentType = response.headers['content-type'];
        // const blob = new Blob([new Uint8Array(response.data)], { type: contentType });
        // const dataUrl = URL.createObjectURL(blob);
        // console.log('test >>>',dataUrl);

  //       const fullImageUrl = `${baseUrl}/${imageId}`;
  //       setImageUrl(fullImageUrl);
  //     } catch (error) {
  //       console.error('Error fetching image:', error);
  //     }
  //   };

  //   fetchImage();
  // }, [imageId]);

  const saveImage = async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'form-image.png');
    try {
      const response = await axios.post("http://localhost:3001/api/images/upload-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  const captureFormAsImage = async () => {
    // await setDisable(true)
    try {
      const formElement = document.getElementById('form-card');
      const blob = await htmlToImage.toBlob(formElement);
      // if (blob) {
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = 'form-image.png';
      //   document.body.appendChild(a);
      //   a.click();

      //   // Clean up
      //   window.URL.revokeObjectURL(url);
      //   document.body.removeChild(a);
      // }
      // setDisable(false)
      form.resetFields();
      await saveImage(blob);
      return blob;
    } catch (error) {
      console.error('Error converting form to image:', error);
      return null;
    }
  };
  return (
    <Card id='form-card'>
      {contextHolder}
      <Form layout='vertical' form={form} onFinish={captureFormAsImage}>
        <Form.Item label="Tên sản phẩm" >
          <Input placeholder='Nhập tên sản phẩm' />
        </Form.Item>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Ngày sản xuất">
              <DatePicker style={{ width: '100%' }} placeholder="Ngày sản xuất" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số lượng sản phẩm">
              <InputNumber style={{ width: '100%' }} placeholder="Số lượng sản phẩm" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Trung tâm kiểm định" placeholder="Chọn trung tâm kiểm định">
          <Select options={[
            { value: 'a', label: 'Trung Tâm kiểm định sản phẩm công nghệ' },
            { value: 'b', label: 'Trung tâm kiểm định chất lượng thực phẩm' }]}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">
            Ký xác nhận
          </Button>
        </Form.Item>
      </Form>
      {/* <Image src={imageUrl}/> */}
    </Card>
  )
}
export default FormSanPham;