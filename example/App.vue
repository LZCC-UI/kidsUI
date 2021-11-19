<template>
  <div id="app">
    <kidsDivider></kidsDivider>
    <kidsColorPicker :color="color"></kidsColorPicker>
    <kidsUpload :pickColor="true" v-model="imgUrl" :httpRequest="uploadImg">
      <img :src="imgUrl" ref="imgTarget" id="image" alt="" />
      <!-- <i v-else>aaaa</i> -->
    </kidsUpload>
    <kidsColorStraw
      :targetEl="strawTarget"
      :beforeStraw="beforeStraw"
      @change="handleChange"
    ></kidsColorStraw>
    <img :src="strawImg" alt="" />

    <!-- <div>
      <kidsVideo
        url="https://stream.nosdn.127.net/kids/1636624915048/3.mp4"
      ></kidsVideo>
    </div> -->
  </div>
</template>

<script>
import kidsDivider from "@/components/divider/src/main.vue";
import kidsColorPicker from "@/components/colorPicker/src/main.vue";
import kidsUpload from "@/components/upload/src/main.vue";
import kidsColorStraw from "@/components/colorStraw/src/main.vue";
import strawImg from "../src/components/colorStraw/src/image.png";
// import kidsVideo from "@/components/video/src/main.vue";
export default {
  name: "App",
  components: {
    kidsDivider,
    kidsColorPicker,
    kidsUpload,
    kidsColorStraw,
    // kidsVideo,
  },
  data() {
    return {
      color: "red",
      imgUrl: "",
      strawImg: strawImg,
      strawTarget: null,
    };
  },
  mounted() {
    this.strawTarget = this.$refs.imgTarget;
    console.log(this.$refs);
  },
  methods: {
    handleChange(color) {
      this.color = color;
    },
    beforeStraw() {
      this.strawTarget = this.$refs.imgTarget;
      console.log(this.$refs);
      return true;
    },
    uploadImg(file) {
      console.log(file);
      this.imgUrl = file;
    },
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
