<template>
    <div id="main" :class="[navMenuStatus ? 'close' : 'open']">
        <div class="main-warp">
            <div class="content">
                <!-- keep-alive缓存组件，切换组件过程中将状态保存在内存中，保持组件活跃，不会被destroy销毁掉，防止重复渲染 -->
                <!-- <keep-alive include="info"> -->
                <!-- include：值为缓存组件文件中的name,只有名称匹配的组件会被缓存,优先级最高，在其他组件设置缓存不生效 -->
                <!-- exclude：值为缓存组件文件中的name，名称匹配的组件不会缓存 -->
                <keep-alive>
                    <!-- 子路由显示区 -->
                    <!-- 需要缓存的 -->
                    <router-view v-if="$route.meta.keepAlive" />
                </keep-alive>
                <!-- 不需要缓存的 -->
                <router-view v-if="!$route.meta.keepAlive" />
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
    name: "layoutMain",
    setup(props, { root }) {
        // console.log(root.$route);
        const navMenuStatus = computed(() => {
            return root.$store.state.app.isCollapse;
        });
        return {
            navMenuStatus,
        };
    },
};
</script>

<style lang="scss" scoped>
#main {
    // position: fixed;
    // top: 75px;
    // left: $navMenuWidth;
    // right: 0;
    // bottom: 0;
    // border: 12px solid #f7f7f7;
    // height: 100vh;
    // padding-left: $navmenuWidth;
    height: 100vh;
    box-sizing: border-box;
    transition: all 0.5s;
    &.open {
        padding-left: $navMenuWidth;
        padding-top: $layoutHeader;
    }
    &.close {
        padding-left: 64px;
        padding-top: $layoutHeader;
    }
    .main-warp {
        width: 100%;
        height: 100%;
        padding: 20px 20px 0 20px;
        box-sizing: border-box;
        background: #f7f7f7;

        .content {
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            background: #fff;
        }
    }
}
</style>