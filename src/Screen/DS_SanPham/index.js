import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  Input,
  Button,
} from "antd";
import axios from "axios";
import moment from "moment/moment";
import {
  UnorderedListOutlined,
  QuestionCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import AddNewButton from "../../Component/AddNewButton";
import CommonButtonEdit from "../../Component/CustomEditButton";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import CommonButtonDelete from "../../Component/CustomDeleteButton";
import dayjs from "dayjs";

const DanhSachSanPham = (prop) => {
  // const { userId } = prop;
  const [list, setList] = useState();
  const [company, setCompany] = useState();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const info = JSON.parse(localStorage.getItem("user"));
  const userId = info ? info._id : null;
  const [product, setProduct] = useState();
  const [isSend, setIsSend] = useState(false);
  const [search, setSearch] = useState({ CreateBy: userId });
  const [messageApi, contextHolder] = message.useMessage();
  const modalContentRef = useRef(null);
  const [modalImage, setModalImage] = useState(null);
  let options;
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "10%",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (e) => (
        <>
          <span>{moment(e).format("DD/MM/YYYY")}</span>
        </>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "hsd",
      key: "hsd",
      width: "10%",
    },
    {
      title: "Số lượng",
      key: "number",
      dataIndex: "number",
      width: "15%",
    },
    {
      title: "Thành phần",
      dataIndex: "ingredient",
      key: "ingredient",
      ellipsis: true,
      width: "25%",
    },
    {
      title: "Trạng thái",
      dataIndex: "isSend",
      width: "16%",
      align: "center",
      render: (value) => {
        switch (value) {
          case "WAIT":
            return (
              <Tag
                icon={<PauseCircleOutlined />}
                color="lime"
                className="font-medium"
              >
                Chưa gửi duyệt
              </Tag>
            );
          case "PENDING":
            return (
              <Tag
                icon={<QuestionCircleOutlined />}
                color="geekblue"
                className="font-medium"
              >
                Đang chờ duyệt
              </Tag>
            );
          case "REJECT":
            return (
              <Tag
                icon={<StopOutlined />}
                color="volcano"
                className="font-medium"
              >
                Đã hủy bỏ
              </Tag>
            );
          case "APPROVED":
            return (
              <Tag
                icon={<CheckCircleOutlined />}
                color="success"
                className="font-medium"
              >
                Đã duyệt
              </Tag>
            );
          case "REFUSE":
            return (
              <Tag
                icon={<CloseCircleOutlined />}
                color="red"
                className="font-medium"
              >
                Từ chối
              </Tag>
            );
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (item, record) => formatActionCell(record),
      width: "10%",
    },
  ];
  function formatActionCell(value) {
    return (
      <Space>
        <CommonButtonEdit onClick={() => showModal(value)} />
        <CommonButtonDelete onConfirm={() => handleDelete(value._id)} />
      </Space>
    );
  }
  const optinon = [
    { value: "Ngày", label: "Ngày" },
    { value: "Tháng", label: "Tháng" },
    { value: "Năm", label: "Năm" },
  ];
  const afterSelect = (
    <Select defaultValue={"Tháng"} style={{ width: 150 }} options={optinon} />
  );
  // ---- ACTION ---- //
  const handleDelete = async (productId) => {
    console.log(productId);
    try {
      await axios.delete(`http://localhost:3001/api/product/${productId}`); // Adjust the API endpoint
      // After successful deletion, update the product list
      getProduct();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // ---- GET PRODUCT ---- //
  const getProduct = async (e) => {
    let createBy = userId;
    try {
      const queryParams = new URLSearchParams(search).toString();
      const response = await axios.get(
        `http://localhost:3001/api/product?${queryParams}`
      );
      if (response) {
        setList(response.data);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  const getCompany = async (e) => {
    // let createBy = userId;
    try {
      // const queryParams = new URLSearchParams(search).toString();
      const response = await axios.get(`http://localhost:3001/api/company?`);
      if (response) {
        setCompany(response.data);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  // Convert to image //
  const captureModalContent = async () => {
    setIsSend(true);
    const values = form.getFieldsValue();
    let sendBy = userId;
    let sendTo = values.receiver;
    let name = values.name.trim();
    html2canvas(modalContentRef.current).then((canvas) => {
      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        // Create a FormData object to send the image as a file
        const formData = new FormData();
        formData.append("image", blob, name + ".png");
        formData.append("sendBy", sendBy);
        formData.append("sendTo", sendTo);
        formData.append("productId", product._id)
        // Send the image to the backend
        try {
          const response = axios.post(
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
              content: response,
            });
            form.resetFields();
          }
        } catch (error) {
          messageApi.open({
            type: "error",
            content: error,
          });
        }
      });
    });
  };

  // ---- MODAL ACTION ---- //
  if (company !== undefined) {
    options = company.map((item) => ({
      label: item.name || item.username || item.email,
      value: item._id,
    }));
  }
  const showModal = (value) => {
    setIsModalOpen(true);
    let number;
    let string;
    setProduct(value);
    const matches = value.hsd.match(/^(\d+) (.+)$/);

    console.log(matches);
    // Check if there are matches
    if (matches && matches.length === 3) {
      number = matches[1]; // Extracted number
      string = matches[2]; // Extracted string
    }
    form.setFieldsValue({
      name: value.name,
      date: dayjs(value.date),
      hsd: number,
      after: string,
      number: value.number,
      ingredient: value.ingredient,
    });
  };
  const handleSend = () => {
    form
      .validateFields()
      .then((values) => {
        actionSend(values);
        captureModalContent();
        message.success("Sản phẩm đã được gửi kiểm duyệt");
      })
      .catch((error) => {
        message.error(error);
      });
  };
  const handleEdit = () => {
    form
      .validateFields()
      .then((values) => {
        handleUpdateProduct(values);
        message.success("Sản phẩm đã được chỉnh sửa");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // ---- HANDLE UPDATE ---- //
  const handleUpdateProduct = (value) => {
    setIsSend(false);
    value = {
      ...value,
      hsd: value.hsd ? value.hsd + " " + value.after : "Vô thời hạn",
    };
    if (value.hasOwnProperty("after")) {
      delete value["after"];
    }
    // Make a PUT request to update the product
    let id = product._id;
    axios
      .put(`http://localhost:3001/api/product/${id}`, value)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const actionSend = (value) => {
    let id = product._id;
    value = {
      ...value,
      hsd: value.hsd ? value.hsd + " " + value.after : "Vô thời hạn",
      isSend: "PENDING",
    };
    if (value.hasOwnProperty("after")) {
      delete value["after"];
    }
    axios
      .put(`http://localhost:3001/api/product/${id}`, value)
      .then((response) => {
        console.log(response);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // ---- USE_EFFECT ---- //
  useEffect(() => {
    getProduct();
    getCompany();
  }, [search, isModalOpen]);
  return (
    <>
      <Card
        size="small"
        title={
          <span>
            <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh
            sách sản phẩm
          </span>
        }
      >
        <Table size="small" columns={columns} dataSource={list} />
      </Card>
      <Modal
        title="Thông tin sản phẩm"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleSend} disabled={product && product.isSend != "WAIT" ? true : false}>
          <div ref={modalContentRef} style={{ padding: 15 }}>
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
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\./g, "")}
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
              <TextArea
                showCount
                maxLength={5000}
                style={{
                  height: 200,
                  resize: "none",
                }}
                rows={4}
                placeholder="Thành phần có trong sản phẩm"
              />
            </Form.Item>
            <Form.Item
              label="Đơn vị kiểm duyệt"
              name="receiver"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn đơn vị để kiểm duyệt!",
                },
              ]}
            >
              <Select options={options} />
            </Form.Item>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              disabled={product && product.isSend != "WAIT" ? true : false}
              onClick={(value) => handleEdit(value)}
            >
              Chỉnh sửa
            </Button>
            <Button
              htmlType="submit"
              // onClick={captureModalContent}
              type="primary"
              disabled={product && product.isSend != "WAIT" ? true : false}
              style={{ marginLeft: "10px" }}
            >
              Gửi kiểm duyệt
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default DanhSachSanPham;
