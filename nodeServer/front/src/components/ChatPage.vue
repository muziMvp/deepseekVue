<template>
  <div class="chat-container">
    <div class="chat-msg">
      <div v-for="(item,index) in msg" :key="index" :class="['message',item.sender]">
        <div class="res-container">
          {{ item.text }}
        </div>
      </div>
    </div>
    <!-- <div class="chat-content">
      {{ newMsg }}
    </div> -->
    <div class="chat-input">
      <input v-model="newMsg" type="text" @keyup.enter="sendMsg" placeholder="Type a message...">
      <button @click="sendMsg">Send</button>
    </div>
  </div>
</template>
<script setup>
  import {ref,reactive,onMounted} from 'vue';
  const msg=reactive([
    {text:'Hello',sender:'user',isActive:false},
    {text:'你好 有什么可以帮助你的吗',sender:'bot',isActive:false}
  ]);
  const newMsg=ref('');
  const sendMsg=()=> {
    let userMsg=newMsg.value
    if (userMsg.trim()==='') {
      return
    }else {
      msg.push({text: userMsg, sender: 'user'})
    }
    socket.send(userMsg)
  }
  onMounted(()=> {
    initSocket()
  })
  // 连接后端socket接口
  let socket = new WebSocket('http://127.0.0.1:4600/question')

  // 消息的回调
  const messageHandler=(e)=> {
    // 将后端返回字符串还原成对象
    const resData=JSON.parse(e.data)
    console.log(resData,'resData')
    // 添加内容之前需要遍历对话数据判断是否存在还没完成的内容
    const idx=msg.findIndex(item=>item.isActive===true)
    // isEnd===true数据遍历完成
    if (!resData.isEnd) {
      if (idx===-1) {
        msg.push({text:'',sender:'bot',isActive:true})
      }else {
        msg[idx].text=msg[idx].text+=resData.data
      }
    }else {
      msg[idx].isActive=false
      newMsg.value=''
      console.log(msg,'esle')
    }
  }

  // 消息成功的回调
  const openSuccess=()=> {
    console.log('openSuccess')
  }
  // 消息失败的回调
  const errorHanlder=()=> {
    console.log('errorHanlder')
  }
  // 消息关闭的回调
  const closeHanlder=()=> {
    console.log('closeHanlder')
  }
  // socket监听方法
  const initSocket=()=> {
    // 接收到消息的回调
    socket.onmessage=messageHandler
    // 连接成功的回调
    socket.onopen=openSuccess
    // 连接失败的回调
    socket.onerror=errorHanlder
    // 连接关闭的回调
    socket.onclose=closeHanlder
  }

</script>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 95vh;
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 auto;
  padding: 10px;
}
.chat-msg {
  flex:1;
  overflow-y: auto;
  padding: 10px;
  border-bottom:1px solid #ccc;
  .message {
    margin-bottom: 10px;
    padding: 8px;
    display: table;
    max-width: 70%;
    border-radius: 5px;
  }
  .user {
    font-size: 14px;
    font-weight: bold;
    color:white;
    background-color: #007bff; 
    margin: 15px 0;
  }
  .bot {
    background-color: #eee; 
  }
}
.res-container {
  display: inline-block;
  text-align: left;
  font-family: monospace; /***使用等宽字体，模拟打字机效果 */
  animation: blink 0.75s step-end infinite;
}
.chat-input {
  padding:10px;
  display: flex;
}
.chat-input input{ 
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  /* color: white; */
  border-radius:5px ;
}
.chat-input button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius:5px ;
  cursor: pointer;
}
.chat-input button:hover {
  background-color: #0056b3;
}
/* 光标闪烁动画 */
@keyframes blik {
  0%,100% {border-right-color: transparent;}
  50% {border-right-color:#000}
}
</style>