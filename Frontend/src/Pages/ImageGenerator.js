import { Typography, Input, Space, Button, Select} from 'antd'
import React, {useState} from 'react'
import { Link } from 'react-router-dom';


const { Search } = Input;
export default function ImageGenerator() {

    const [imgUrl, setImgUrl] = useState("")
    const [prompt, setPrompt] = useState("")
    const [engine, setEngine] = useState("SD")
    const [loading, setLoading] = useState(false)

    const onSearch = () => {   
        setLoading(true);
        fetch(`http://localhost:5000/generate/image?prompt=${prompt}&engine=${engine}`).then((res) => res.json()).then((data) => {
            console.log(data)
            setImgUrl(data.imgUrl)
            setLoading(false)
        })
    }

    const onPromptChange = (e) => {
        setPrompt(e.target.value)
    }
    return (
        <>
    <Typography.Title level={1}>
        Image Generator
    </Typography.Title>
    <Space.Compact>
        <Input placeholder='Enter Prompt' value={prompt} onChange={onPromptChange}></Input>
        <Select style={{width: 120}}  value={engine} onChange={setEngine}>
            <Select.Option value="SD">S_Diff.</Select.Option>
            <Select.Option value="OpenAI">OpenAI</Select.Option>
        </Select>
        <Button type="primary" loading={loading} onClick={onSearch}>Generate</Button>

    {/* <Search placeholder="input search text" enterButton="Generate" size="large" loading={loading} onSearch={onSearch} /> */}
    </Space.Compact>

    {imgUrl && 
        <>
            <Typography.Title level={3}>Generated Image</Typography.Title>
            <img style={{borderRadius:".5rem"}}src={imgUrl} alt='What was generated'/>
            <br/>
            <Button type="primary"><Link to="/ImageExtender" state={{imgUrl}}>Extend the Image!</Link></Button>
        </>}
    </>
  )
}


