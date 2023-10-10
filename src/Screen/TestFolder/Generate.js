import React, { useRef, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Result, Row } from "antd";
import axios from "axios";
import html2canvas from "html2canvas";

const userInput = "đấódihaoídjáoid"; // Replace with the user's input

const GenerateKey = () => {
  const [form] = Form.useForm();
  const [privateKeyBase64, setpk64] = useState();
  const [privateKeyFileName, setpk] = useState();
  const [publicKeyBase64, setplk64] = useState();
  const modalContentRef = useRef(null);
  const [publicKeyFileName, setplk] = useState();
  //   ================================ DOWNLOAD KEY =======================================
  const handleTest = () => {
    axios
      .post("http://localhost:3001/api/users/generate-keys", { userInput })
      .then((response) => {
        // Handle the response from the server
        console.log(response.data);
        setpk64(response.data.privateKeyBase64);
        setpk(response.data.privateKeyFileName);
        setplk64(response.data.publicKeyBase64);
        setplk(response.data.publicKeyFileName);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };
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
  // Convert to image //
  const captureModalContent = async (value) => {
    html2canvas(modalContentRef.current).then((canvas) => {
      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        // Create a FormData object to send the image as a file
        const formData = new FormData();
        formData.append("image", blob, "aswd.png");
        formData.append("privateKey", privateKeyFile);
        // formData.append("image", value.imageFile);

        try {
          const response = axios.post(
            "http://localhost:3001/api/users/encode-image",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          alert("Image encoded and saved successfully.");
        } catch (error) {
          console.error("Error uploading and encoding image:", error);
          alert("Error uploading and encoding image.");
        }
        // Send the image to the backend
        // try {
        //   const response = axios.post(
        //     "http://localhost:3001/api/images/upload-image",
        //     formData,
        //     {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //       },
        //     }
        //   );
        //   if (response) {
        //     messageApi.open({
        //       type: "success",
        //       content: response,
        //     });
        //     form.resetFields();
        //   }
        // } catch (error) {
        //   messageApi.open({
        //     type: "error",
        //     content: error,
        //   });
        // }
      });
    });
  };
  //   =====================================================================================
  const [privateKeyFile, setPrivateKeyFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handlePrivateKeyChange = (event) => {
    const file = event.target.files[0];
    setPrivateKeyFile(file);
  };

  const handleUpload = async (value) => {
    // if (!privateKeyFile || !imageFile) {
    //   alert("Please select both a private key file and an image file.");
    //   return;
    // }
    console.log(value);
    const formData = new FormData();
    formData.append("privateKey", privateKeyFile);
    formData.append("image", value.imageFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/encode-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Image encoded and saved successfully.");
    } catch (error) {
      console.error("Error uploading and encoding image:", error);
      alert("Error uploading and encoding image.");
    }
  };

  return (
    <>
      <Result
        style={{ height: "100%" }}
        icon={<SmileOutlined />}
        title="Great, we have done all the operations!"
        extra={
          <Button type="primary" onClick={() => handleTest()}>
            Next
          </Button>
        }
      />
      <Row>
        <Col>
          <Button
            onClick={() =>
              downloadKeyFile(privateKeyFileName, privateKeyBase64)
            }
          >
            Download privateKey
          </Button>
          <Button
            onClick={() => downloadKeyFile(publicKeyFileName, publicKeyBase64)}
          >
            Download publicKey
          </Button>
        </Col>
        <Col>
          <div ref={modalContentRef}>
            <Form onFinish={(value) => captureModalContent(value)} form={form}>
              <Form.Item label={"Text"} name={"imageFile"}>
                <Input />
              </Form.Item>
              <Form.Item label={"Key"} name={"privateKeyFile"}>
                <input
                  type="file"
                  accept=".pem, .jpg, .png, .crt"
                  id="privateKeyFile"
                  onChange={handlePrivateKeyChange}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Upload and Encode
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* <button onClick={handleUpload}>Upload and Encode</button> */}
        </Col>
      </Row>
    </>
  );
};
export default GenerateKey;
