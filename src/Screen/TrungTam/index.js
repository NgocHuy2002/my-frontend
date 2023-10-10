import { Card, Table, Tag, Space, message } from "antd";
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

const TrungTam = () => {
  const [list, setList] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState({});

  // RENDER
  const columns = [
    {
      title: "Tên trung tâm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Khóa công khai",
      dataIndex: "publicKey",
      ellipsis: true,
      key: "publicKey",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];
  // ---- ACTION ---- //
  const getCompany = async (e) => {
    // let createBy = userId;
    try {
      const queryParams = new URLSearchParams(search).toString();
      const response = await axios.get(
        `http://localhost:3001/api/company?${queryParams}`
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
  //   ---- USE_EFFECT ---- //
  useEffect(() => {
    getCompany();
  }, [search]);
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
        <Table size="small" columns={columns} dataSource={list}/>
      </Card>
    </>
  );
};
export default TrungTam;
