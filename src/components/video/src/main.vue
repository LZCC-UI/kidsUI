<template>
  <div class="kids-video" :style="backgroundStyle">
    <video
      :src="options.url"
      @loadeddata="onloadeddata"
      @timeupdate="ontimeupdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onended"
      playsinline
      @click.stop="controlBar"
      @fullscreenchange="onFullScreen"
    ></video>
    <div class="kids-video-playBtn" @click.stop="playVideo" v-show="!isPlaying">
      <img src="../assets/playBtn.png" alt="" />
    </div>
    <transition name="fade">
      <div
        class="kids-video-controller"
        :style="controllBarStyle"
        v-show="loaded && controllerBar.show"
      >
        <div
          class="kids-video-playControll"
          :style="btnStyle"
          @click.stop="playVideo"
        ></div>
        <div
          class="kids-video-playControll"
          :style="voiceStyle"
          @click="changeVoice"
          v-if="showVoice"
        ></div>
        <kidsProgress
          class="kids-video-progress"
          :strokeWidth="
            (options.controller && options.controller.strokeWidth) || 6
          "
          :percent="percentage"
          @updatePercent="updatePercent"
          :showText="false"
        />
        <div
          v-if="options.controller && options.controller.timeDivider"
          class="kids-video-timeDivider"
        >
          {{ curTime + "/" + totalTime }}
        </div>
        <div
          class="kids-video-playControll kids-video-fullScreen"
          @click="setFullScreen"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
import kidsProgress from "../../progress/index";
import playBtn from "../assets/playMini.png";
import pauseBtn from "../assets/pauseMini.png";
import openIcon from "../assets/open.png";
import closeIcon from "../assets/close.png";
import { timeToString } from "@/utils/utils";
export default {
  name: "KidsVideo",
  components: {
    kidsProgress,
  },
  props: {
    options: {
      require: true,
      default: {
        url: "https://stream.nosdn.127.net/kids/test/1633946824596.mp4",
        currentTime: 0,
        autoplay: false,
        muted: false,
        backgroundColor: "red",
        controller: {
          strokeWidth: 4,
          voice: true,
          fullScreen: true,
          timeDivider: true,
        },
      },
    },
  },
  data() {
    return {
      Video: "",
      percentage: 0, //进度
      loaded: false, //video load
      isPlaying: false,
      isFullScreen: false,
      isCloseVoice: false, //是否静音
      currentTime: 0, //当前时间
      duration: 0, //视频时长
      videoWidth: 0, //视频得宽度
      controllerBar: {
        show: true,
        timer: null,
      },
    };
  },
  computed: {
    curTime() {
      return timeToString(this.currentTime);
    },
    totalTime() {
      return timeToString(this.duration);
    },
    backgroundStyle() {
      return {
        backgroundColor: this.options.backgroundColor
          ? this.options.backgroundColor
          : "white",
      };
    },
    controllBarStyle() {
      const style = {};
      //   style.visibility = this.controllerBar.show ? "visible" : "hidden";
      //   style.opacity = this.controllerBar.show ? 1 : 0;
      style.width = this.videoWidth ? this.videoWidth + "px" : "auto";
      return style;
    },
    showVoice() {
      return this.options.controller.voice != undefined
        ? this.options.controller.voice
        : true;
    },
    voiceStyle() {
      const style = {};
      style.backgroundImage = this.isCloseVoice
        ? `url(${closeIcon})`
        : `url(${openIcon})`;
      return style;
    },
    fullScreenStyle() {
      const style = {};
      style.backgroundImage = this.isCloseVoice;
      return style;
    },
    btnStyle() {
      const style = {};
      style.backgroundImage = this.isPlaying
        ? `url(${pauseBtn})`
        : `url(${playBtn})`;
      return style;
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    playVideo() {
      clearTimeout(this.controllerBar.timer);
      if (!this.isPlaying) {
        this.Video.play();
        this.$emit("play");
        this.controllerBar.timer = setTimeout(() => {
          this.controllerBar.show = false;
        }, 3000);
      } else {
        this.Video.pause();
        this.$emit("pause");
      }
    },
    controlBar() {
      this.clearTimer();
      if (!this.isPlaying) {
        return;
      }
      this.controllerBar.show = !this.controllerBar.show;

      this.startTimer();
    },
    clearTimer() {
      if (this.controllerBar.timer) {
        clearTimeout(this.controllerBar.timer);
      }
    },
    startTimer() {
      if (this.isPlaying) {
        this.controllerBar.timer = setTimeout(() => {
          this.controllerBar.show = false;
        }, 3000);
      }
    },
    onPlay() {
      this.isPlaying = true;
    },
    onPause() {
      this.isPlaying = false;
    },
    onended() {
      this.$emit("end");
    },
    updatePercent(percent) {
      this.clearTimer();
      this.Video.currentTime = (percent / 100) * this.duration;
      this.startTimer();
    },
    // 开启或者关闭声音
    changeVoice() {
      this.Video.muted = !this.Video.muted;
      this.isCloseVoice = this.Video.muted;
      this.clearTimer();
      this.startTimer();
    },
    // 设置视频全屏
    setFullScreen() {
      if (this.Video.requestFullscreen) {
        this.Video.requestFullscreen();
      } else if (this.Video.msRequestFullscreen) {
        this.Video.msRequestFullscreen();
      } else if (this.Video.mozRequestFullScreen) {
        this.Video.mozRequestFullScreen();
      } else if (this.Video.webkitRequestFullscreen) {
        this.Video.webkitRequestFullscreen();
      } else {
        console.log("Fullscreen API is not supported");
      }
    },
    //全屏变化监听
    onFullScreen() {
      this.onResize();
      this.$emit("fullScreenChange", (this.isFullScreen = !this.isFullScreen));
    },
    ontimeupdate(player) {
      this.currentTime = player.path[0].currentTime;
      this.percentage = (this.currentTime / this.duration) * 100;
    },
    onloadeddata(player) {
      this.Video = player.target;
      this.videoWidth = this.Video.clientWidth;
      this.Video.muted = this.options.muted || false;
      this.Video.poster = this.options.poster || "";
      this.Video.autoplay = this.options.autoplay || false;
      this.duration = this.Video.duration;
      this.loaded = true;
    },
    onResize() {
      let temp = this.Video.clientWidth;
      this.videoWidth = temp;
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-video {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  color: white;
  -webkit-tap-highlight-color: transparent;
  video {
    width: auto;
    height: 100%;
  }
  .kids-video-playBtn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 3.4rem;
      height: 3.4rem;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .kids-video-controller {
    height: fit-content;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    padding: 0 0.3rem;
    padding-top: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    .kids-video-playControll {
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-size: cover;
      transition: background-image 0.6s ease;
      cursor: pointer;
    }
    .kids-video-fullScreen {
      background-image: url("../assets/fullScreen.png");
    }
    .kids-video-progress {
      flex: 1;
      margin: 0 0.5rem;
    }
    .kids-video-timeDivider {
      margin-right: 0.2rem;
      font-size: 0.24rem;
    }
  }
}
</style>
