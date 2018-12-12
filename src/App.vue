<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <!-- <Chat/> -->
          <loading/>
          <!-- <Header/> -->
          <Room/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "./components/Chat.vue";
import loading from "./components/loading.vue";
import Header from "./components/header.vue";
import Room from "./components/room/room.vue";
export default {
  name: "app",
  components: {
    Chat,
    loading,
    Header,
    Room
  }
};
</script>

<style lang="less">
#app{
  background-color: #f0f0f0;
}
</style>