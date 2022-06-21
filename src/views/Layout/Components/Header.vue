<template>
  <div id="header" :class="[navMenuStatus ? 'close' : 'open']">
    <div class="pull-left header-icon" @click="changNavMenuStatus">
      <svg-icon iconName="menu" />
    </div>
    <div class="pull-right right-box">
      <div class="user-info">
        <img src="../../../assets/header-image.png" />
        <span>{{ userName }}</span>
      </div>
      <div class="header-icon" @click="exit">
        <svg-icon iconName="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../../../icons/SvgIcon.vue";
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  components: { SvgIcon },
  setup(props, { root }) {
    // 监听状态机中的菜单收缩
    const navMenuStatus = computed(() => {
      return root.$store.state.app.isCollapse;
    });

    const userName = computed(() => {
      return root.$store.state.app.username;
    });

    // 收缩导航菜单
    const changNavMenuStatus = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    // 退出
    const exit = () => {
      root.$store.dispatch("app/EXIT").then(() => {
        root.$router.push({ name: "Login" });
      });
    };
    return {
      navMenuStatus,
      changNavMenuStatus,
      userName,
      exit,
    };
  },
};
</script>

<style lang="scss" scoped>
#header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  height: $layoutHeader;
  background: #fff;
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
  line-height: $layoutHeader;
  transition: all 0.5s;
  &.open {
    left: $navMenuWidth;
  }
  &.close {
    left: 64px;
  }
}
.header-icon {
  padding: 0 30px;
  svg {
    font-size: 25px;
    margin-bottom: -8px;
    cursor: pointer;
  }
}
.right-box {
  display: flex;
  .user-info {
    padding-right: 23px;
    border-right: 1px solid #ededed;
    img {
      width: 36px;
      vertical-align: middle;
      margin-right: 18px;
    }
  }
}
</style>