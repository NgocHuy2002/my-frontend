import { Card, Table, Tag, Space, message, Image, Col, Row, Button } from "antd";
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

const KiemDuyet = () => {
  // const [blobUrls, setBlobUrls] = useState([]);
  const blobUrls = [];
  const [imageData, setImageData] = useState([]);
  const [individualImages, setIndividualImages] = useState([]);
  const [idImage, setIdImage] = useState([]);
  useEffect(() => {
    // Make a GET request to fetch the Blob URLs
    axios
      .get("http://localhost:3001/api/images/image", {
        params: {
          sendTo: "651ec0015c824d0f21986e22", // Replace with the actual sendTo value you want to fetch
        },
      })
      .then((response) => {
        console.log(response.data);
        setIdImage(response.data);
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
        // const blobs = response.data.map((data) => {

        // })
        // setBlobUrls(response.data);
        // response.data.forEach((imageData, index) => {
        //   const blob = new Blob([imageData.data], { type: imageData.contentType });
        //   const blobUrl = URL.createObjectURL(blob);
        //   blobUrls.push({ index, blobUrl });
        // });
        // console.log(blobUrls);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);
  //  console.log(idImage);

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
          {idImage.map((e) => (
            <Col key={e._id} span={6} style={{borderStyle:'solid', borderWidth:1, margin:10, padding: 5}}>
              {" "}
              {/* Adjust span to control the number of columns per row */}
              <div style={{ textAlign: "center" }}>
                <Image
                  width={250}
                  src={`http://localhost:3001/api/images/image-id/${e._id}`}
                />
                <h5>{e.filename}</h5>
                <Button type="primary">Chi tiết</Button>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  );
};
export default KiemDuyet;
