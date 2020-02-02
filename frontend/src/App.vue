<template>
  <a-layout style="padding-top:64px;background:white">
    <a-layout-header style="width:100%;padding:0;position:fixed;top:0">
      <a-button :ghost="true" icon="menu-fold" @click="showMeau" style="padding-left:0px;border-left:0;border-radius:0 3px 3px 0;" />
      <a-avatar icon="user" style="margin:0 8px;top:-1px;"/>
      <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
      <a-drawer
        placement="left"
        :closable="false"
        @close="onMeauClose"
        :visible="bShowMeau"
        :wrapStyle="{background:'#001529'}"
        :bodyStyle="{padding:'0'}"
      >
        <div style="height:64px;line-height:64px;">
          <a-avatar icon="user" style="margin:0 8px;top:-1px;"/>
          <span style="color:#fff">Keillion</span>
        </div>
        <a-menu mode="inline" theme="dark"
          :defaultSelectedKeys="['home']">
          <a-menu-item key="home"><a-icon type="home"></a-icon><router-link to="/">Home</router-link></a-menu-item>
          <a-menu-item key="chat"><a-icon type="message"></a-icon><router-link to="/chat">Chat</router-link></a-menu-item>
          <a-menu-item key="file"><a-icon type="folder"></a-icon><router-link to="/file">File</router-link></a-menu-item>
        </a-menu>
      </a-drawer>
    </a-layout-header>
    <router-view/>
  </a-layout>
</template>

<script>
  export default {
    data(){
      return {
        bShowMeau: false
      };
    },
    methods: {
      showMeau(){
        this.bShowMeau = true;
      },
      onMeauClose() {
        this.bShowMeau = false;
      },
      onSearch(value) {
        console.log(value);
      }
    }
  }
</script>

<style lang="scss">
.ant-menu-item a{
  display: inline;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
