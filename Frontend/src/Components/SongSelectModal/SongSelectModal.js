import React, {useEffect, useState} from 'react'
import { Button, Modal, Typography, Upload, message } from 'antd'
import { ItalicOutlined, UploadOutlined } from '@ant-design/icons';


export const SongSelectModal = ({isModalOpen, handleOk, closeModal, currentAlbum ,updateAlbum}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const UploadProps = {
      name: 'image',
      action: 'http://localhost:5000/image',
      maxCount: 1,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          console.log(info.file.response.imgUrl);
          updateAlbum(info.file.response.imgUrl);
          messageApi.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          messageApi.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (

      <Modal title="Select Album" open={isModalOpen} onOk={handleOk} onCancel={closeModal}>
        {contextHolder}
        <Upload {...UploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Typography.Paragraph style={{fontStyle: 'italic'}}>Song Search Coming Soon</Typography.Paragraph>
        
      </Modal>
    )
  }
  