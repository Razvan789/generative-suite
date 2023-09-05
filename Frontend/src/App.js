import { Typography} from 'antd';
import './App.css';

import React from 'react';



function App() {
  return (
    <div style={{padding: " 0 2rem"}}>
    <Typography.Title level={1}>Welcome to The Generate Suite!</Typography.Title>
    <Typography.Title level={3}>What is this?</Typography.Title>
    <Typography.Paragraph>
      This is a suite of generative tools that I have created.
      The tools are currently in beta, and are not guaranteed to work. If you have any questions, comments, or concerns, please email me at <a href="mailto:
      razvanbeldeanu789@gmail.com">razvanbeldeanu789@gmail.com</a>
    </Typography.Paragraph>
    <Typography.Title level={2}>Select a page from the sidebar to get started!</Typography.Title>

    </div>
  );

}



export default App;
