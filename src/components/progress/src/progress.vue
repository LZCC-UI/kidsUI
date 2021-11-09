<template>
  <div
    class="kids-progress"
    ref="kidsProgress"
    :class="{
      'kids-progress--without-text': !showText,
      'kids-progress--text-inside': textInside,
    }"
  >
    <div class="kids-progress-bar" :style="{ padding: strokeWidth + 'px 0' }">
      <div
        class="kids-progress_outer"
        ref="_outer"
        :style="{ height: strokeWidth + 'px' }"
      >
        <div class="kids-progress_inner" :style="barStyle">
          <div class="kids-progress_innerText" v-if="showText && textInside">
            {{ content }}
          </div>

          <div
            class="kids-progress_dragable"
            :style="dragableStyle"
            v-if="dragable"
            @click.stop
          ></div>
        </div>
      </div>
    </div>
    <div
      class="kids-progress__text"
      v-if="showText && !textInside"
      :style="{ fontSize: progressTextSize + 'px' }"
    >
      {{ content }}
    </div>
  </div>
</template>

<script>
import { isPC } from "@/utils/utils";
import pcDrag from "./mixins/pcDrag";
import mobileTouch from "./mixins/mobileTouch";
export default {
  name: "KidsProgress",
  mixins: [pcDrag, mobileTouch],
  props: {
    percent: {
      required: true,
      type: Number,
    },
    color: {
      type: [String, Array, Function],
      default: "",
    },
    strokeWidth: {
      type: Number,
      default: 6,
    },
    textInside: {
      type: Boolean,
      default: false,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    dragable: {
      type: Boolean,
      default: true,
    },
    format: Function,
  },
  watch: {
    dragable: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.initEvent();
          });
        }
      },
      immediate: true,
    },
    percent: {
      handler(val) {
        if (val > 100) {
          console.warn(
            "[Vue warn]: Invalid prop: custom validator check failed for prop 'percentage'."
          );
        }
        this.percentage = val < 100 ? val : 100;
      },
      immediate: true,
    },
  },
  computed: {
    dragableStyle() {
      const style = {};
      style.width = this.strokeWidth * 4 + "px";
      style.height = this.strokeWidth * 4 + "px";
      let trans = -(this.strokeWidth * 3) / 2;
      style.transform = `translate(${trans}px, ${trans - 0.5}px)`;
      return style;
    },
    barStyle() {
      const style = {};
      style.width = this.percentage + "%";
      style.backgroundColor = this.getCurrentColor(this.percentage);
      return style;
    },
    content() {
      if (typeof this.format == "function") {
        return this.format(this.percentage);
      } else {
        return `${this.percentage}%`;
      }
    },
    progressTextSize() {
      return 12 + this.strokeWidth * 0.4;
    },
    totalWidth() {
      return this.$el.offsetWidth;
    },
  },
  data() {
    return {
      isDragging: false,
      //   totalWidth: 0,
      percentage: 0,
    };
  },
  beforeUnmount() {
    // let el = this.$refs.progress_pivot;
    console.log("beforeDestroy");
  },
  methods: {
    // 初始化
    initEvent() {
      console.log("initEvent");
      let el = this.$el;
      if (isPC()) {
        el.addEventListener(
          "mousedown",
          this.mousedownHandler.bind(this),
          true
        );
        el.addEventListener(
          "mouseover",
          this.mouseoverHandler.bind(this),
          true
        );
        el.addEventListener("mouseup", this.mouseupHandler.bind(this), true);
        el.addEventListener(
          "mousemove",
          this.mousemoveHandler.bind(this),
          true
        );
        el.addEventListener("mouseout", this.mouseoutHandler.bind(this), true);
      } else {
        el.addEventListener("touchstart", this.startDragging.bind(this), true);
        el.addEventListener("touchend", this.stopDragging.bind(this), true);
        el.addEventListener("touchmove", this.onDragging.bind(this), true);
        // el.addEventListener("touchmove", this.onDragging.bind(this), true);
      }
    },
    getOffsetParentLeft() {
      let parent = this.$el.offsetParent;
      let offsetLeft = 0;
      while (parent && parent.tagName != "BODY" && parent.offsetParent) {
        offsetLeft += parent.offsetLeft;
        parent = parent.offsetParent;
      }
      return offsetLeft;
    },
    moveAt(pageX) {
      if (
        pageX > this.$refs.kidsProgress.offsetLeft &&
        pageX <=
          this.$el.offsetLeft + this.getOffsetParentLeft() + this.totalWidth
      ) {
        this.percentage = Math.round(
          Number(
            ((pageX - this.getOffsetParentLeft() - this.$el.offsetLeft) /
              this.totalWidth) *
              100
          )
        );
        this.$emit("updatePercent", this.percentage);
      }
    },
    getCurrentColor(percentage) {
      if (typeof this.color === "function") {
        return this.color(percentage);
      } else if (typeof this.color === "string") {
        return this.color;
      } else {
        return this.getLevelColor(percentage);
      }
    },
    getLevelColor(percentage) {
      const colorArray = this.getColorArray().sort(
        (a, b) => a.percentage - b.percentage
      );

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    },
    getColorArray() {
      const color = this.color;
      const span = 100 / color.length;
      return color.map((seriesColor, index) => {
        if (typeof seriesColor === "string") {
          return {
            color: seriesColor,
            progress: (index + 1) * span,
          };
        }
        return seriesColor;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-progress {
  position: relative;
  line-height: 1;
  height: fit-content;
  -webkit-tap-highlight-color: transparent;
  .kids-progress-bar {
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    vertical-align: middle;
    padding-right: 50px;
    margin-right: -55px;
    display: inline-block;

    .kids-progress_outer {
      height: 6px;
      background-color: #ebeef5;
      vertical-align: middle;
      position: relative;
      border-radius: 100px;
      //   overflow: hidden;
      .kids-progress_inner {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #409eff;
        border-radius: 100px;
        height: 100%;
        text-align: right;
        line-height: 1;
        white-space: nowrap;
        // transition: width 0.2s ease;
        .kids-progress-bar__innerText {
          display: inline-block;
          vertical-align: middle;
          color: #fff;
          font-size: 12px;
          margin: 0 5px;
        }
        .kids-progress_dragable {
          position: absolute;
          display: inline-block;
          vertical-align: middle;
          transform-origin: left;
          background-image: url(../assets/icon.png);
          background-size: 100% 100%;
        }
      }
    }
  }

  .kids-progress__text {
    font-size: 14px;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
  }
}
.kids-progress--text-inside {
  .kids-progress-bar {
    padding-right: 0;
    margin-right: 0;
  }
}
.kids-progress--without-text {
  .kids-progress-bar {
    padding-right: 0;
    margin-right: 0;
    display: block;
  }
}
</style>
