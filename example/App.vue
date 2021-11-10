<template>
  <div id="app">
    <kidsDivider></kidsDivider>
  </div>
</template>

<script>
import kidsDivider from "@/components/divider/src/main.vue";

export default {
  name: "App",
  components: {
    kidsDivider,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
