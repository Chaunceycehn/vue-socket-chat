<template>
  <div class="app-main">
    <div class="content" ref="scroll">
      <div class="height-hook">
        <div v-for="(item, index) in messageList">
          <div class="item-box left-hook" v-if="item.type === 2">
            <div class="center">
              <div class="user">{{ item.msgUser.userName }}</div>
              <div class="text">
                <span class="horn">◀</span>
                {{ item.msg }}
              </div>
            </div>
            <br style="clear: both;">
          </div>
          <div class="item-box right-hook" v-if="item.type === 3">

            <div class="center">
              <div class="user">{{ item.msgUser.userName }}</div>
              <div class="text">
                <span class="horn">▶</span>
                {{ item.msg }}
              </div>
            </div>
            <br style="clear: both;">
          </div>
          <div class="item-box center-hook" v-if="item.type === 1">
            <span class="tip">{{ item.msg }}</span>
          </div>
        </div>
      </div>
    </div>
    <button @click="connectEvent">login</button>
    <div class="footer">
      <div class="main">
        <input
          type="text"
          class="input"
          v-model="inputValue"
          @keyup.enter="sendEvent"
          v-show="connectState"
        >
        <input type="text" class="input" disabled v-show="!connectState" v-model="inputValue">
        <div class="send" :class="{logout: !connectState}" @click="sendEvent">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      headerConfig: {
        left: "conn",
        right: "设置"
      },
      userInfo: {},
      userNameList: [
        "加菲猫 ",
        "流氓兔",
        "蜡笔小新",
        "樱木花道",
        "机器猫",
        "皮卡丘",
        "史努比",
        "蓝精灵",
        "紫龙",
        "芭比 "
      ],
      onlineUserList: [],
      messageList: [],
      inputValue: "",
      connectState: false,
      socket: io("localhost:3001")
    };
  },
  created() {
    this.userInfo = {};
    this.messageList = []; // type = 1 提示信息     type = 2 对方内容     type = 3 我发送内容
  },
  mounted() {
    this.connectEvent();
  },
  methods: {
    connectEvent() {
      var me = this;
      var randomNum = Math.floor(Math.random() * 10);
      this.userInfo = {
        userId: this.getUserId(),
        userName: this.userNameList[randomNum],
        userImg: randomNum + 1
      };
      this.socket.emit("login", this.userInfo);
      this.socket.on("login", function(obj) {
        console.log(obj);
        me.onlineUserList = obj.onlineUserList;
        me.messageList.push({
          type: 1,
          msg: "用户 " + obj.msgUser.userName + " 加入聊天",
          msgUser: obj.msgUser
        });
      });
      this.socket.on("loginSuccess", function(obj) {
        // 1 成功
        if (obj.sign === 1) {
          me.onlineUserList = obj.onlineUserList;
          me.connectState = true; // 登录状态
          me.headerConfig.left = me.userInfo.userImg.toString();
          console.log("连接好了");
        }
      });
      this.socket.on("message", function(obj) {
        console.log(obj);
        me.onlineUserList = obj.onlineUserList;
        me.messageList.push({ type: 2, msg: obj.msg, msgUser: obj.user });
      });
    },
    getUserId() {
      return (
        new Date().getTime() + "" + Math.floor(Math.random() * 100000 + 100) - 0
      );
    },
    sendEvent() {
      this.inputValue = this.trim(this.inputValue);
      if (this.inputValue.length > 0) {
        if (this.connectState) {
          this.socket.emit("message", {
            msg: this.inputValue,
            user: this.userInfo
          });
          this.messageList.push({
            type: 3,
            msg: this.inputValue,
            msgUser: this.userInfo
          });
          this.inputValue = "";
        }
      }
    },
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    }
  }
};
</script>


<style scoped>
</style>
