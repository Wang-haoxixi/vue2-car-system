<template>
  <svg :class="style" aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed,
} from "@vue/composition-api";
export default {
  name: "svgIcon",
  props: {
    // svg图路径
    iconName: {
      type: String,
      default: "",
    },
    // svg图样式
    iconStyle: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const icon = computed(() => {
      return `#icon-${props.iconName}`;
    });
    const style = computed(() => {
      // 判断是否有传svg的样式进来，有就添加进iconStyle类名
      if (props.iconStyle) {
        return `iconStyle ${props.iconStyle}`;
      } else {
        return `iconStyle`;
      }
    });
    return {
      icon,
      style,
    };
  },
};
</script>

<style lang="scss" scoped>
.iconStyle {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>