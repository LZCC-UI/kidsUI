<template>
  <div
    class="kids-video"
    :style="backgroundStyle"
    @click.stop="
      controlBar();
      onVideoDbClick();
    "
  >
    <video
      :src="url"
      ref="video"
      controlsList="nodownload"
      @timeupdate="ontimeupdate"
      @play="onPlay"
      @pause="onPause"
      @canplay="oncanplay"
      preload="auto"
      autoplay
      @ended="onended"
      webkit-playsinline="true"
      playsinline="true"
      x5-video-player-type="h5-page"
      @fullscreenchange="onFullScreen"
    ></video>
    <img
      v-if="(!isPlaying && poster && !loaded) || showPoster"
      :src="poster"
      class="poster"
      alt=""
    />
    <div v-if="isPlaying && !loaded" class="loading" :style="loadingBgStyle">
      <p>加载中...</p>
    </div>
    <img
      src="../assets/playBtn.png"
      alt=""
      class="kids-video-playBtn"
      @click.stop="playVideo"
      v-show="!isPlaying"
    />
    <transition name="fade">
      <div
        class="kids-video-controller"
        v-show="controllerBar.show"
        :style="controllBarStyle"
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
            (options.controller && options.controller.strokeWidth) || 0.1
          "
          :percent="percentage"
          @updatePercent="updatePercent"
          :showText="false"
        />
        <div
          v-if="options.controller && options.controller.timeDivider"
          ref="timeDivider"
          class="kids-video-timeDivider"
        >
          <p :style="timeDividerStyle">{{ curTime + "/" + totalTime }}</p>
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
import { timeToString } from "@/utils/utils.js";
export default {
  name: "KidsVideo",

  components: {
    kidsProgress,
  },
  props: {
    url: {
      require: true,
      type: String,
    },
    index: {
      type: Number,
      require: true,
    },
    poster: {
      type: String,
    },
    options: {
      default: () => {
        return {
          // url: 'https://stream.nosdn.127.net/kids/test/1633946824596.mp4',
          currentTime: 0,
          autoplay: false,
          muted: false,
          backgroundColor: "white",
          controller: {
            strokeWidth: 0.8,
            voice: true,
            fullScreen: true,
            timeDivider: true,
          },
        };
      },
    },
  },
  data() {
    return {
      canPlay: false,
      Video: "",
      showPoster: true,
      percentage: 0, //进度
      loaded: false, //video load
      isPlaying: false,
      isFullScreen: false,
      isCloseVoice: false, //是否静音
      currentTime: 0, //当前时间
      duration: 0, //视频时长
      videoWidth: 0, //视频得宽度
      timeDividerScale: 1,
      timeDividerWith: 0,
      dbClickTimer: null, //双击全屏事件计时，用于过滤掉单击事件
      dbClickTime: 0, //当值变为2的时候,响应双击事件
      controllerBar: {
        show: true,
        timer: null, //计时300ms之后隐藏
      },
    };
  },
  watch: {
    isPlaying() {
      this.showPoster = false;
    },
    videoWidth() {
      if (
        this.options.controller &&
        this.options.controller.timeDivider &&
        this.$refs.timeDivider
      ) {
        this.$nextTick(() => {
          const timeWith = this.videoWidth * 0.12;
          this.timeDividerWith =
            this.timeDividerWith ||
            this.$refs.timeDivider.childNodes[0].clientWidth;
          console.log(this.videoWidth, timeWith, this.timeDividerWith);
          this.timeDividerScale = timeWith / this.timeDividerWith;
        });
      }
    },
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
    loadingBgStyle() {
      const style = {};
      if (this.poster) {
        style.backgroundImage = "url(" + this.poster + ")";
      }

      return style;
    },
    controllBarStyle() {
      const style = {};
      style.opacity = this.loaded ? 1 : 0;
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
    timeDividerStyle() {
      const style = {};
      style.transform = "scale(" + this.timeDividerScale + ")";

      return style;
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    // 处理ios上loadeddata事件不响应的问题
    this.Video = this.$refs.video;
    this.videoWidth = this.Video.clientWidth;
  },
  methods: {
    playVideo() {
      clearTimeout(this.controllerBar.timer);
      if (!this.isPlaying) {
        this.Video.play();
        this.controllerBar.timer = setTimeout(() => {
          this.controllerBar.show = false;
        }, 1000);
      } else {
        this.Video.pause();
      }
    },
    stopVideo() {
      if (this.isPlaying) {
        this.Video.pause();
      }
    },
    controlBar() {
      this.dbClickTime++;
      clearTimeout(this.dbClickTimer);
      this.dbClickTimer = setTimeout(() => {
        this.clearTimer();
        this.dbClickTime = 0;
        if (!this.isPlaying) {
          return;
        }
        this.controllerBar.show = !this.controllerBar.show;
        this.startTimer();
      }, 1000);
    },
    onVideoDbClick() {
      //   alert(this.dbClickTime)
      if (this.dbClickTime >= 2) {
        this.dbClickTime = 0;
        clearTimeout(this.dbClickTimer);
        this.setFullScreen();
      }
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
      this.$emit("play");
    },
    onPause() {
      this.isPlaying = false;
      this.$emit("pause");
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
      } else if (this.Video.webkitEnterFullScreen) {
        this.Video.webkitEnterFullScreen();
      } else {
        console.log("Fullscreen API is not supported");
      }
    },
    //全屏变化监听
    onFullScreen() {
      this.$nextTick(() => {
        this.$emit(
          "fullScreenChange",
          (this.isFullScreen = !this.isFullScreen),
          this.index
        );
        this.onResize();
      });
    },
    ontimeupdate(player) {
      this.currentTime = player.target.currentTime;
      this.percentage = (this.currentTime / this.duration) * 100;
    },
    oncanplay(player) {
      this.canPlay = true;

      this.Video = player ? player.target : this.$refs.video;

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
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  color: white;
  -webkit-tap-highlight-color: transparent;
  video {
    width: 100%;
    height: 100%;
  }
  .poster {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    color: rgba($color: white, $alpha: 0.8);
    display: flex;
    background-size: contain;
    justify-content: center;
    align-items: center;
  }
  .kids-video-playBtn {
    width: 25%;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .kids-video-controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 2%;
    padding-top: 3%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    .kids-video-playControll {
      width: 6%;
      height: 20px;
      line-height: 20px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      transition: background-image 0.6s ease;
      cursor: pointer;
    }
    .kids-video-fullScreen {
      flex-basis: 6%;
      height: 20px;
      background-image: url("../assets/fullScreen.png");
    }
    .kids-video-progress {
      flex-grow: 1;
      flex-shrink: 1;
      margin: 0 3%;
    }
    .kids-video-timeDivider {
      width: 12%;
      height: 20px;
      margin-right: 2%;
      font-size: 0.24rem;
      position: relative;
      p {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        line-height: 20px;
        transform-origin: left 5px;
      }
    }
  }
}
</style>
