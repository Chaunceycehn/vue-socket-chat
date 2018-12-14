<template>
  <div class="app">
    <!-- <li-load @loadFinishEvent="loadEvent"></li-load> -->
    <h1>登录</h1>
    <hr>
    <div class="login">
      <label>用户名</label>
      <input type="text">
      <input type="button" value="登录" id="loginbutton" @click="Ilogin">
    </div>
  </div>
</template>

<script>
// import load from '../loading';
// import header from '../header';
export default {
  components: {
    // 'li-header': header,
    // 'li-load': load
  },
  data() {
    return {
      load: false
    };
  },
  methods: {
    loadEvent() {
      // this.$router.replace({path: '/room'});
    }
  }
};
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100%;
  background: #fff;

  h1 {
    text-align: center;
  }
  .login {
      text-align: center;
    .chatinput {
      display: block;
      width: 100%;
      position: absolute;
      min-height: 30px;
      bottom: 0;
    }
    #content {
      height: auto;
    }
  }
  .loading {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #499eff;
    font-family: "Microsoft YaHei";
    text-align: center;
  }
}
</style>
