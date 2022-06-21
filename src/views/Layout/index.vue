<template>
  <div id="layout">
    <Header />
    <Main />
    <Nav />
  </div>
</template>

<script>
import Header from "./Components/Header";
import Main from "./Components/Main";
import Nav from "./Components/Nav";
export default {
  name: "layout",
  components: {
    Header,
    Main,
    Nav,
  },
};
</script>

<style lang="scss" scoped>
</style>