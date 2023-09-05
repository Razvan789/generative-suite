import { Button, Typography, Space, Input } from "antd";
import { SongSelectModal } from "../Components/SongSelectModal/SongSelectModal";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const { Search } = Input;

export default function ImageExtender() {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [extendedUrl, setExtendedUrl] = useState(null);
  const [extendPrompt, setExtendPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const loc = useLocation();

  // let openai;

  useEffect(() => {
    console.log("location", loc);
    if (loc.state) {
      setImgUrl(loc.state.imgUrl);
    }
    // openai.current.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{role:"user", content:"Hello, how are you?"}]
    //   }).then((response) => {
    //     console.log(response.choices);
    //   }).catch((err) => {
    //     console.log(err);
    //   });
  }, [loc]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const updatePrompt = (e) => {
    setExtendPrompt(e.target.value);
  };

  const extendImage = () => {
    console.log("extend image");
    setLoading(true);
    fetch(`http://localhost:5000/image/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl: imgUrl, transform:"extend", prompt: extendPrompt }),
    }).then((res) => res.json()).then((data) => {
      console.log(data);
      setLoading(false);
      setExtendedUrl(data.transformedImgUrl);
    });
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "album.png";
    link.href = imgUrl;
    link.click();
  };
  return (
    <>
      <Typography.Title level={1}>Image Extender</Typography.Title>
      <Button type="primary" onClick={openModal}>
        Select Image
      </Button>

      <SongSelectModal
        isModalOpen={modalOpen}
        handleOk={closeModal}
        closeModal={closeModal}
        album={imgUrl}
        updateAlbum={setImgUrl}
      />
      {imgUrl != null && (
        <>
          <Typography.Title level={2}>Selected Image</Typography.Title>
          <img width={200} height={200} src={imgUrl} alt="album art" />
          <br></br>
          <Space>
            {/* <Search placeholder="Give it a theme!" enterButton="Generate" size="large" loading={loading} onSearch={extendImage} /> */}
          </Space>
          <Space.Compact>
            <Input
              placeholder="Give it a theme!"
              value={extendPrompt}
              onChange={updatePrompt}
            />
            <Button type="primary" onClick={extendImage} loading={loading}>Extend!</Button>
          </Space.Compact>
          <br></br>

          {/* If The image has been extended */}
          {extendedUrl && (
            <>
            <Typography.Title level={2}>Extended Image</Typography.Title>
            <img width={600} src={extendedUrl} alt="Extended Creation"></img>
            <br></br>
            <Button type="primary" onClick={downloadImage}>
              Download New Image!
            </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
