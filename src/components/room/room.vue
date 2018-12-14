<template>
  <div class="app-main">
    <div class="content" ref="scroll">
      <div class="height-hook">
        <div v-for="(item, index) in messageList">
          <div class="item-box left-hook" v-if="item.type === 2">
            <div class="left">
              <img src="../../images/1.png" v-if="item.msgUser.userImg === 1">
              <img src="../../images/2.png" v-if="item.msgUser.userImg === 2">
              <img src="../../images/3.png" v-if="item.msgUser.userImg === 3">
              <img src="../../images/4.png" v-if="item.msgUser.userImg === 4">
              <img src="../../images/5.png" v-if="item.msgUser.userImg === 5">
              <img src="../../images/6.png" v-if="item.msgUser.userImg === 6">
              <img src="../../images/7.png" v-if="item.msgUser.userImg === 7">
              <img src="../../images/8.png" v-if="item.msgUser.userImg === 8">
              <img src="../../images/9.png" v-if="item.msgUser.userImg === 9">
              <img src="../../images/10.png" v-if="item.msgUser.userImg === 10">
            </div>
            <div class="center">
              <div class="user">{{ item.msgUser.userName }}</div>
              <div class="text" id="text">
                <span class="horn">◀</span>
                {{ item.msg }}
              </div>
            </div>
            <br style="clear: both;">
          </div>
          <div class="item-box right-hook" v-if="item.type === 3">
            <div class="right">
              <img src="../../images/1.png" v-if="userInfo.userImg === 1">
              <img src="../../images/2.png" v-if="userInfo.userImg === 2">
              <img src="../../images/3.png" v-if="userInfo.userImg === 3">
              <img src="../../images/4.png" v-if="userInfo.userImg === 4">
              <img src="../../images/5.png" v-if="userInfo.userImg === 5">
              <img src="../../images/6.png" v-if="userInfo.userImg === 6">
              <img src="../../images/7.png" v-if="userInfo.userImg === 7">
              <img src="../../images/8.png" v-if="userInfo.userImg === 8">
              <img src="../../images/9.png" v-if="userInfo.userImg === 9">
              <img src="../../images/10.png" v-if="userInfo.userImg === 10">
            </div>
            <div class="center">
              <div class="user">{{ item.msgUser.userName }}</div>
              <div class="text" id="text">
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
    <button @click="sendImg">发送图片</button>
    <input type="file" id="tupian">

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
      socket: io("localhost:3001"),
      ImgidList: [],
    };
  },
  created() {
    this.userInfo = {};
    this.messageList = []; // type = 1 提示信息     type = 2 对方内容     type = 3 我发送内容
  },
  mounted() {
    this.connectEvent();
  },
  updated() {
    this.scroll();
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
      this.socket.on("receiveImg", data => {
        let ImgDIV = document.createElement("div");
        let text = document.getElementById("text");
        let newtext = text.lastChild
        ImgDIV.innerHTML = `<div>${data.id}: <img style="width=100px; height:100px ;" " src="${data.img}" /></div>`;
        // me.ImgidList.push(data.img);
        // console.log(me.ImgidList);
        // newtext.appendChild(ImgDIV);
        text.appendChild(ImgDIV);
        // console.log(data);
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
    sendImg() {
      let that = this;
      let Imginput = document.getElementById("tupian");
      let file = Imginput.files[0]; //得到该图片
      let reader = new FileReader(); //创建一个FileReader对象，进行下一步的操作
      reader.readAsDataURL(file); //通过readAsDataURL读取图片
      reader.onload = function(event) {
        //读取完毕会自动触发，读取结果保存在result中
        let data = { img: event.target.result };
        that.socket.emit("sendImg", data);
      };
    },
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    scroll() {
      this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
    }
  }
};
</script>


<style lang="less" scoped>
.app-main {
  font-family: "Microsoft YaHei";
  width: 100%;
  height: 100%;
  position: relative;
  .header-title {
    text-align: center;
  }
  .content {
    width: 100%;
    height: 70vh;
    position: absolute;
    top: 50px;
    bottom: 50px;
    display: block;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #f0f0f0;
    .item-box {
      width: 100%;
      margin-bottom: 10px;
      .left {
        float: left;
        width: 40px;
        img {
          height: 40px;
        }
      }
      .right {
        float: right;
        width: 40px;
        img {
          height: 40px;
        }
      }
      .center {
        max-width: 65%;
        .text {
          position: relative;
          font-size: 13px;
          padding: 8px 10px 5px 10px;
          border-radius: 3px;
          line-height: 20px;
          .horn {
            position: absolute;
            top: 5px;
            font-size: 12px;
          }
        }
      }
      &.center-hook {
        text-align: center;
        padding: 20px 0;
        .tip {
          padding: 3px 6px;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
    .left-hook {
      .center {
        float: left;
        margin-left: 10px;
        .text {
          background: #fff;
          color: #333;
          .horn {
            color: #fff;
            left: -8px;
          }
        }
        .user {
          margin-bottom: 5px;
          font-size: 12px;
          color: #aaa;
          line-height: 12px;
        }
      }
    }
    .right-hook {
      .center {
        float: right;
        text-align: right;
        margin-right: 10px;
        .text {
          background: #499eff;
          color: #fff;
          .horn {
            color: #499eff;
            right: -8px;
          }
        }
        .user {
          text-align: right;
          margin-bottom: 5px;
          font-size: 12px;
          color: #aaa;
          line-height: 12px;
        }
      }
    }
  }
  .userList {
    h5 {
      margin: 0;
      padding-top: 15px;
      line-height: 25px;
      text-align: center;
      color: #444;
    }
    ul {
      padding: 15px 0;
      margin: 0 auto;
      width: 90%;
      font-size: 0;
      li {
        width: 25%;
        display: inline-block;
        
        .box {
          width: 80%;
          margin: 0 auto;
          padding-bottom: 5px;
          img {
            width: 100%;
          }
          .name {
            width: 100%;
            text-align: center;
            line-height: 16px;
            color: #888;
            font-size: 12px;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    border-top: 1px solid #dedede;
    padding: 8px 10px;
    box-sizing: border-box;
    .main {
      width: 100%;
      height: 100%;
      .input {
        float: left;
        width: 78%;
        height: 34px;
        outline: none;
        border: 1px solid #ddd;
        background: #efefef;
        padding: 0;
        box-sizing: border-box;
        border-radius: 5px 0 0 5px;
        text-indent: 10px;
        color: #444;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        &:focus {
          border: 1px solid #ccc;
        }
      }
      .send {
        float: right;
        width: 22%;
        height: 34px;
        outline: none;
        background: #499eff;
        border-radius: 0 5px 5px 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 34px;
        color: #fff;
        cursor: pointer;
        &.logout {
          background: #aaa;
        }
      }
    }
  }
}
</style>
