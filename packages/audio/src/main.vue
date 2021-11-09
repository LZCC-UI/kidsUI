<template>
  <div class="kids-audio">
    <div v-if="options.mode == 'line'" class="kids-audio-line">
      <div class="kids-auido-poster">
        <img
          :src="options.poster"
          v-if="options.poster"
          class="poster"
          alt=""
        />
        <div class="mask"></div>
      </div>
      <div class="kids-auido-wrapper">
        <div class="kids-audio-controller">
          <div class="kids-audio-name">
            {{ options.name || "" }}
          </div>
        </div>
        <div class="kids-audio-content">
          <kidsProgress
            class="audio-progress"
            :strokeWidth="options.strokeWidth || 6"
            :percent="percentage"
            @updatePercent="updatePercent"
            :showText="false"
          />
          <div class="kids-audio-timeDivider">
            {{ curTime + "/" + totalTime }}
          </div>
        </div>
      </div>
      <div class="kids-auido-btns">
        <div
          class="kids-audio-btn-play"
          :style="btnStyle"
          @click="playAudio"
        ></div>
      </div>
    </div>
    <div v-else class="kids-audio-block" :style="blockModeStyle">
      <div class="kids-audio-playWrapper">
        <div
          class="kids-audio-play"
          :class="{
            pause: isPause,
            rotate: isPlaying || isPause,
          }"
        >
          <div class="kids-audio-playBg" :style="blockModeStyle"></div>
        </div>
        <div
          class="kids-audio-playBtn"
          :style="btnStyle"
          @click="playAudio"
        ></div>
      </div>
      <div class="kids-audio-content">
        <div
          class="kids-audio-timeDivider"
          :style="{ fontSize: (options.strokeWidth || 6) + 'px' }"
        >
          {{ curTime }}
        </div>
        <kidsProgress
          class="audio-progress"
          :strokeWidth="options.strokeWidth || 6"
          :percent="percentage"
          @updatePercent="updatePercent"
          :showText="false"
        />
        <div
          class="kids-audio-timeDivider"
          :style="{ fontSize: (options.strokeWidth || 6) + 'px' }"
        >
          {{ totalTime }}
        </div>
      </div>
    </div>
    <audio
      :src="options.url"
      @loadeddata="onloadeddata"
      @timeupdate="ontimeupdate"
      @play="onplay"
      @pause="onpause"
    ></audio>
  </div>
</template>

<script>
import kidsProgress from "../../progress/index";
import { timeToString } from "../../../src/utils/utils";
import playIcon from "../assets/playIcon.png";
import pauseIcon from "../assets/pauseIcon.png";
import playBtn from "../assets/playBtn.png";
import pauseBtn from "../assets/pauseBtn.png";
export default {
  name: "KidsAudio",
  components: {
    kidsProgress,
  },
  props: {
    options: {
      required: true,
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      percentage: 0,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isPause: false,
      Audio: "",
    };
  },
  computed: {
    curTime() {
      return timeToString(this.currentTime);
    },
    totalTime() {
      return timeToString(this.duration);
    },
    btnStyle() {
      const style = {};
      style.backgroundImage = this.isPlaying
        ? `url(${this.options.mode == "line" ? pauseIcon : pauseBtn})`
        : `url(${this.options.mode == "line" ? playIcon : playBtn})`;
      return style;
    },
    blockModeStyle() {
      const style = {};
      style.backgroundImage = `url(${this.options.poster})`;
      return style;
    },
  },
  methods: {
    playAudio() {
      if (this.isPlaying) {
        this.Audio.pause();
      } else {
        this.Audio.play();
      }
    },
    updatePercent(percent) {
      this.Audio.currentTime = (percent / 100) * this.duration;
    },
    onplay() {
      this.isPause = false;
      this.isPlaying = true;
    },
    onpause() {
      this.isPause = true;
      this.isPlaying = false;
    },
    ontimeupdate(audio) {
      this.currentTime = audio.target.currentTime;
      this.percentage = (this.currentTime / this.duration) * 100;
    },
    onloadeddata(audio) {
      this.Audio = audio.target;
      this.duration = audio.target.duration;
      audio.target.currentTime = this.options.currentTime || 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-audio {
  position: relative;
  overflow: hidden;
  //   color: white;
  -webkit-tap-highlight-color: transparent;
  .kids-audio-line {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .kids-auido-poster {
      position: relative;
      height: 38px;
      width: 38px;
      margin-right: 0.4rem;
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        height: 38px;
        width: 38px;
        background-position: 2px -80px;
        background-image: url("../assets/playbar.png");
      }
    }
    .kids-auido-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      .kids-audio-controller {
        display: flex;
        justify-content: flex-start;
        .kids-audio-name {
          max-width: 80px;
          overflow: hidden;
          position: relative;
          white-space: nowrap;
          //   font-size: 0.1rem;
          .kids-audio-name-content {
            position: absolute;
          }
        }
      }
      .kids-audio-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .kids-audio-timeDivider {
          display: inline-block;
          margin-left: 0.2rem;
          font-size: 0.1rem;
        }
        .audio-progress {
          flex: 1;
        }
      }
    }
    .kids-auido-btns {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      cursor: pointer;
      .kids-audio-btn-play {
        width: 40px;
        height: 40px;
        background-size: contain;
        transition: background-image 0.2s;
      }
    }
  }
  .kids-audio-block {
    width: 100%;
    padding-top: 50%;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(5px);
    }
    .kids-audio-playWrapper {
      width: 30%;
      padding-top: 30%;
      position: absolute;
      top: 50%;
      border-radius: 50%;
      border: 0.2rem solid white;
      background-color: black;
      transform: translateY(-50%);
      .kids-audio-playBtn {
        width: 50%;
        height: 50%;
        background-repeat: no-repeat;
        background-size: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .kids-audio-play {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        .kids-audio-playBg {
          width: 80%;
          height: 80%;
          position: absolute;
          top: 50%;
          border-radius: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-size: contain;
        }
      }
      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .rotate {
        animation: rotation 3s linear infinite;
      }
      .pause {
        animation-play-state: paused;
      }
    }

    .kids-audio-content {
      display: flex;
      width: 100%;
      align-items: center;
      position: absolute;
      bottom: 0;
      .kids-audio-timeDivider {
        margin: 0 0.6rem;
      }
      .audio-progress {
        flex: 1;
      }
    }
  }
}
</style>
