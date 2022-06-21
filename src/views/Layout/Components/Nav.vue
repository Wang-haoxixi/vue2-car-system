<template>
  <div id="navMenu" :class="[navMenuStatus ? 'close' : 'open']">
    <h1 class="logo">
      <img src="../../../assets/vuelogo.png" alt=""/>
    </h1>
    <el-menu
      :default-active="$route.path"
      background-color="transparent"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :collapse="navMenuStatus"
      router
    >
      <template v-for="(item, index) in navData">
        <el-submenu :index="item.path" :key="index" v-if="!item.hidden">
          <!-- 一级菜单 -->
          <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <svg-icon :iconName="item.meta.icon" class="svgicon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子级菜单 -->
          <template v-for="(subItem, subIndex) in item.children">
            <el-menu-item
              v-if="!subItem.hide"
              :key="subIndex"
              :index="subItem.path"
              >{{ subItem.meta.name }}</el-menu-item
            >
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root, content, }) {
    console.log(root.$route)
    /**
     * data
     */
    // 菜单导航路由数据
    const navData = ref(root.$router.options.routes);
    /**
     * methods
     */
    // 导航菜单收缩  监听状态机中的isCollapse状态并返回值
    const navMenuStatus = computed(() => {
      return root.$store.state.app.isCollapse;
    });
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };

    return {
      navMenuStatus,
      handleOpen,
      handleClose,
      navData,
    };
  },
};
</script>

<style lang="scss" scoped>
#navMenu {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: #344a5f;
  transition: all .5s;
  &.open{
    width: $navMenuWidth;
    .logo {
      img {
        margin: auto;
        width: 70px;
        display: block;
        margin-top: 28px;
        margin-bottom: 25px;
      }
    }
  }
  &.close{
    width: 64px;
    .logo {
      img {
        margin: auto;
        width: 50px;
        display: block;
        margin-top: 28px;
        margin-bottom: 25px;
      }
    }
  }
  .svgicon {
    margin-right: 5px;
    font-size: 16px;
  }
}
</style>