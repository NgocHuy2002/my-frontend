import React, { useEffect, useRef, useState } from "react";
import { AutoComplete, Card, Col, Input, Row, Select, Space, message } from "antd";
import "./login.css";
import axios from "axios";
import moment from "moment";

const SearchPage = () => {
  const { Search } = Input;
  const [search, setSearch] = useState({});
  const [list, setList] = useState();
  const [users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  //   const [searchResult, setSearchResult] = useState([]);
  //   ==== ACTION ==== //
  const searchResult = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/public`, {
        params: {
          name: query, // Pass the search query as a parameter to your API
        },
      });

      // Assuming the response data is an array of objects with id and name properties
      const data = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const getUser = async () => {
    try{
        const response = await axios.get(`http://localhost:3001/api/users`);
        if(response){
            console.log(response);
            const usersList = response.data.map((item) => ({
                label: item.username,
                value: item._id,
              }));
            setUsers(usersList)
        }
    }
    catch(err){
        messageApi.open({
            type: "error",
            content: err.response.data.message,
          });
    }
  }
  const getPublic = async () => {
    try {
      const queryParams = new URLSearchParams(search).toString();
      const response = await axios.get(
        `http://localhost:3001/api/public?${queryParams}`
      );
      if (response) {
        setList(response.data);
        // console.log(response.data);
        // const updatedOptions = response.data.map((item) => ({
        //   name: item.name,
        //   id: item._id,
        // }));
        // setOptions(updatedOptions);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  const onSelect = (value, option) => {
    // console.log("onSelect", option.value);
    setSearch({name: option.value})
  };
  const handleSearch = async (value) => {
    try {
      const result = await searchResult(value);
      const updatedOptions = result.map((item) => ({
        name: item.name,
        id: item.name,
      }));
      setOptions(value ? updatedOptions : []);
      //   console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onSubmit = () =>{
    setSearch({})
  }
  //   ==== useEffect ====
  useEffect(() => {
    getPublic();
    getUser();
  }, [search]);
  return (
    <>
      <div
        className="gradient"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5%",
          paddingRight: "15%",
          paddingLeft: "15%",
          height: "100vh",
        }}
      >
        <AutoComplete
          style={{ width: "100%" }}
          popupMatchSelectWidth={"100%"}
          options={options.map((option) => ({
            value: option.name,
            id: option.id,
          }))}
          onSelect={onSelect}
          onSearch={handleSearch}
          size="large"
        >
          <Search size="large" placeholder="Nhập tên của sản phẩm"/>
        </AutoComplete>
        <Row style={{ paddingTop: 30, width:'100%'}} gutter={8}>
          {list ? list.map((e) => {
            return (
              <Col span={8}>
                <Card title={e.name} style={{height: 300, overflowY: 'auto'}}>
                  <div>
                    <p>
                      <strong>Ngày tạo:</strong>{" "}
                      {moment(e.createTime).locale("vi").format("MMMM Do YYYY")}
                    </p>
                    <p>
                      <strong>Người gửi:</strong>{" "}
                      <Select options={users} style={{width:'50%'}} bordered={false} defaultValue={e.sendBy} disabled/>
                    </p>
                    {/* <p>
                      <strong>Nhận xét:</strong>{" "}
                      {encodeData ? encodeData.decription : null}
                    </p> */}
                    <hr />
                    <p>
                      <strong>Kết quả kiểm định:</strong>
                    </p>
                    <ul>
                      {e.test.map((item, index) => (
                        <li key={index}>
                          <strong>Test {item.testName}:</strong> {item.result}
                          {item.final && <span> (Đạt)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Col>
            );
          }) : null}
        </Row>
      </div>
    </>
  );
};

export default SearchPage;
