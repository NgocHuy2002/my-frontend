import {
  Card,
  Table,
  Tag,
  Space,
  message,
  Image,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  UnorderedListOutlined,
  QuestionCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import CommonButtonEdit from "../../Component/CustomEditButton";
import CommonButtonDelete from "../../Component/CustomDeleteButton";
import axios from "axios";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

const KiemDuyet = () => {
  // const [blobUrls, setBlobUrls] = useState([]);
  const [form] = Form.useForm();
  const blobUrls = [];
  const [imageData, setImageData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [individualImages, setIndividualImages] = useState([]);
  const [idImage, setIdImage] = useState([]);
  const [options, setOptions] = useState([]);
  const [list, setList] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState({});
  const [imageStatus, setImageStatus] = useState();
  const navigate = useNavigate();
  const [productId, setProductId] = useState();
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
  const getCompany = async (e) => {
    // let createBy = userId;
    try {
      const queryParams = new URLSearchParams(search).toString();
      const response = await axios.get(
        `http://localhost:3001/api/company?${queryParams}`
      );
      if (response) {
        const companyList = response.data.map((e) => ({
          value: e._id,
          label: e.name,
        }));
        setList(companyList);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  useEffect(() => {
    getUser();
    getCompany();
    let sendTo = JSON.parse(localStorage.getItem("user"))._id;
    // Make a GET request to fetch the Blob URLs
    axios
      .get("http://localhost:3001/api/images/image", {
        params: {
          sendTo: sendTo, // Replace with the actual sendTo value you want to fetch
          isCheck: "WAIT",
        },
      })
      .then((response) => {
        setImageData(response.data);
        response.data.forEach((image) => {
          axios
            .get(`http://localhost:3001/api/images/image-id/${image._id}`, {
              responseType: "blob", // Set the response type to 'blob' for binary data
            })
            .then((individualResponse) => {
              const blob = new Blob([individualResponse.data], {
                type: image.contentType,
              });
              const imageUrl = URL.createObjectURL(blob);

              // Update the state with the individual image URL
              setIndividualImages((prevImages) => [
                ...prevImages,
                { _id: image._id, url: imageUrl },
              ]);
            })
            .catch((error) => {
              console.error("Error fetching individual image:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);
  const handleModel = (value) => {
    setIsOpen(true);
    setProductId(value.productId);
    setImageStatus(value.isCheck);
    setIdImage(value._id)
    form.setFieldsValue({
      button: value.isCheck,
      sendTo: value.sendTo,
      sendBy: value.sendBy,
      filename: decodeURIComponent(escape(value.filename)).replace(
        /\.png$/,
        ""
      ),
      createAt: dayjs(value.createAt),
    });
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleCheck = () => {
    const value = form.getFieldsValue();
    navigate("/phieu", {
      state: {
        name: value.filename,
        dateSend: value.createAt,
        sendBy: value.sendBy,
        productId: productId,
        imageId: idImage,
        isCheck: imageStatus,
      },
    });
  };
  return (
    <>
      <Card
        size="small"
        title={
          <span>
            <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh
            sách
          </span>
        }
      >
        <Row gutter={16}>
          {" "}
          {/* Add gutter for spacing between columns */}
          {imageData.map((e) => (
            <Col
              key={e._id}
              span={6}
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                margin: 10,
                padding: 5,
              }}
            >
              {" "}
              {/* Adjust span to control the number of columns per row */}
              <div style={{ textAlign: "center" }}>
                <Image
                  width={250}
                  src={`http://localhost:3001/api/images/image-id/${e._id}`}
                />
                <h5>
                  {decodeURIComponent(escape(e.filename)).replace(/\.png$/, "")}
                </h5>
                <Button type="primary" onClick={() => handleModel(e)}>
                  Chi tiết
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <Modal
        title={"Thông tin sản phẩm"}
        open={isOpen}
        okText={"Xét duyệt"}
        onOk={() => handleCheck()}
        cancelText={"Đóng"}
        onCancel={() => handleClose()}
      >
        <Form form={form} layout="vertical" disabled>
          <Form.Item label={"Tên sản phẩm"} name={"filename"}>
            <Input bordered={false} />
          </Form.Item>
          <Form.Item label={"Người gửi"} name={"sendBy"}>
            <Select options={options} bordered={false} />
          </Form.Item>
          <Form.Item label={"Ngày gửi"} name={"createAt"}>
            <DatePicker bordered={false} />
          </Form.Item>
          <Form.Item label={"Bên kiểm định"} name={"sendTo"}>
            <Select options={list} bordered={false} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default KiemDuyet;
