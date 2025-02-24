//引入express、express-ws
const express = require('express');
const expressWs = require('express-ws')(express())
const app=expressWs.app;
// 创建监听端口
const port=4600
const { Ollama }=require('@langchain/community/llms/ollama');
const model=new Ollama({
  baseUrl:'http://localhost:11434',//连接本地的ollama服务
  model:'deepseek-r1:1.5b'
})
// 提供一个deepseek的接口
// req 请求头
app.ws('/question',(ws,req)=>{
  // 由web传递过来的消息
  // ws中的on监听
  ws.on('message',async(msg)=> {
    const stream=await model.stream(msg);
    for await(let str of stream) {
      ws.send(JSON.stringify({data:str,isEnd:false}))
    }
    ws.send(JSON.stringify({data:'',isEnd:true}))
  })
  ws.on('open',()=> {
    console.log('serve.open')
  })
  ws.on('error',()=> {
    console.log('serve.error')
  })
  ws.on('close',()=> {
    console.log('serve.close')
  })
})
// 启动服务
app.listen(port,()=> {
  console.log('后端服务已经启动')
})