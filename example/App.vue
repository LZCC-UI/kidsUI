<template>
  <div id="app">
    <kidsDivider></kidsDivider>
    <kidsCountdownTime endTime="2021-11-22 11:30:00"></kidsCountdownTime>
    <kidsColorPicker v-model="color"></kidsColorPicker>
    <!-- <kidsUpload :pickColor="true" v-model="imgUrl" :httpRequest="uploadImg">
      <img v-if="imgUrl" :src="imgUrl" ref="imgTarget" id="image" alt="" />
      <i v-else>+</i>
    </kidsUpload> -->
    <img
      style="width: 500px"
      src="https://kids.nosdn.127.net/kids/test/1629960416572.gif"
      ref="imgTarget"
      id="image"
      alt=""
    />
    <kidsColorStraw
      :targetEl="strawTarget"
      :beforeStraw="beforeStraw"
      @change="handleChange"
    ></kidsColorStraw>

    <div class="videoStyle">
      <kidsVideo
        url="https://stream.nosdn.127.net/kids/1628844128331.mp4"
      ></kidsVideo>
    </div>
    <div style="width: 500px">
      <kidsAudio :options="audioOption"></kidsAudio>
    </div>
  </div>
</template>

<script>
import kidsDivider from "@/components/divider/src/main.vue";
import kidsColorPicker from "@/components/colorPicker/src/index.vue";
// import kidsUpload from "@/components/upload/src/main.vue";
import kidsColorStraw from "@/components/colorStraw/src/main.vue";
// import kidsPopup from "@/components/popup/src/main.vue";
import kidsCountdownTime from "@/components/countdownTime/src/main.vue";
import strawImg from "../src/components/colorStraw/src/image.png";
import kidsVideo from "@/components/video/src/main.vue";
import kidsAudio from "@/components/audio/src/main.vue";
export default {
  name: "App",
  components: {
    kidsDivider,
    kidsColorPicker,
    // kidsUpload,
    kidsColorStraw,
    // kidsPopup,
    kidsCountdownTime,
    kidsAudio,
    kidsVideo,
  },
  data() {
    return {
      popupVis: true,
      color: "red",
      imgUrl: "",
      strawImg: strawImg,
      strawTarget: null,
      audioOption: {
        url: "https://music.163.com/song/media/outer/url?id=1347524822.mp3",
        mode: "block",
        poster: "https://kids.nosdn.127.net/kids/test/1629960416572.gif",
        currentTime: 0,
        strokeWidth: 3,
        name: "辞.九门回忆",
      },
    };
  },
  mounted() {},
  methods: {
    handleChange(color) {
      this.color = color;
    },
    beforeStraw() {
      this.strawTarget = this.$refs.imgTarget;
      if (this.strawTarget) {
        return true;
      }
      return false;
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
.videoStyle {
  width: 500px;
  margin-bottom: 100px;
}
</style>
