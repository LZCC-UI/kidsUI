<template>
  <div
    :class="[
      'kids-alpha',
      'transparent',
      {
        'is-vertical': vertical,
        'small-alpha-slider': size === 'small' && !vertical,
      },
    ]"
  >
    <div
      class="kids-alpha-slider__bar"
      ref="barEle"
      :style="gradientColor"
      @click="onSliderClick"
    >
      <div
        :class="[
          'kids-alpha-slider__bar-pointer',
          { 'small-bar': size === 'small' && !vertical },
        ]"
        ref="cursorEle"
        :style="{
          left: cursorLeft + 'px',
          top: cursorTop + 'px',
        }"
      >
        <div
          :class="['kids-alpha-slider__bar-handle', { vertical: vertical }]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import tinycolor from "tinycolor2";
import DomUtils from "@/utils/dom";
import "../style/alpha.scss";
export default {
  name: "kidsAlpha",
  props: {
    color: {
      type: String,
      default: "#000000",
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "default",
    },
    alpha: {
      type: Number,
      default: 1,
      validator: (value) => {
        return value >= 0 && value <= 1;
      },
    },
  },
  data() {
    return {
      cursorLeft: 0,
      cursorTop: 0,
      currentAlpha: this.alpha,
    };
  },
  computed: {
    gradientColor() {
      const rgb = tinycolor(this.color).setAlpha(1).toRgbString();
      const alphaGgb = tinycolor(this.color).setAlpha(0).toRgbString();

      let deg = "right";
      if (this.vertical) {
        deg = "bottom";
      }
      return {
        background: `linear-gradient(to ${deg}, ${alphaGgb}, ${rgb}`,
      };
    },
  },
  watch: {
    alpha(val) {
      this.currentAlpha = val;
    },
    currentAlpha() {
      this.updatePosition();
    },
  },
  mounted() {
    this.$nextTick(() => {
      const dragConfig = {
        drag: (event) => {
          this.onDragSlider(event);
        },
        end: (event) => {
          this.onDragSlider(event);
        },
      };

      if (this.$refs.barEle && this.$refs.cursorEle) {
        DomUtils.addDragEvent(this.$refs.barEle, dragConfig);
        DomUtils.addDragEvent(this.$refs.cursorEle, dragConfig);
      }
    });
    this.updatePosition();
  },
  methods: {
    getCursorLeft() {
      if (this.vertical) return 0;
      if (this.$refs.barEle && this.$refs.cursorEle) {
        const alpha = this.currentAlpha;
        const rect = this.$refs.barEle?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.width - this.$refs.cursorEle?.offsetWidth) +
            this.$refs.cursorEle?.offsetWidth / 2
        );
      }
      return 0;
    },
    getCursorTop() {
      if (!this.vertical) return 0;
      if (this.$refs.barEle && this.$refs.cursorEle) {
        const alpha = this.currentAlpha;
        const rect = this.$refs.barEle?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.height - this.$refs.cursorEle.offsetHeight) +
            this.$refs.cursorEle.offsetHeight / 2
        );
      }
      return 0;
    },
    updatePosition() {
      this.cursorLeft = this.getCursorLeft();
      this.cursorTop = this.getCursorTop();
    },
    onDragSlider(event) {
      event.stopPropagation();
      if (this.$refs.barEle && this.$refs.cursorEle) {
        const rect = this.$refs.barEle?.getBoundingClientRect();

        if (!this.vertical) {
          let left = event.clientX - rect.left;
          left = Math.max(this.$refs.cursorEle.offsetWidth / 2, left);
          left = Math.min(
            left,
            rect.width - this.$refs.cursorEle.offsetWidth / 2
          );

          this.currentAlpha =
            Math.round(
              ((left - this.$refs.cursorEle.offsetWidth / 2) /
                (rect.width - this.$refs.cursorEle.offsetWidth)) *
                100
            ) / 100;
        } else {
          let top = event.clientY - rect.top;
          top = Math.max(this.$refs.cursorEle.offsetHeight / 2, top);
          top = Math.min(
            top,
            rect.height - this.$refs.cursorEle.offsetHeight / 2
          );

          this.currentAlpha =
            1 -
            Math.round(
              ((top - this.$refs.cursorEle.offsetHeight / 2) /
                (rect.height - this.$refs.cursorEle.offsetHeight)) *
                100
            ) /
              100;
        }

        this.$emit("update:alpha", this.currentAlpha);
        this.$emit("change", this.currentAlpha);
      }
    },
    onSliderClick(event) {
      const target = event.target;

      if (target !== this.$refs.barEle) {
        this.onDragSlider(event);
      }
    },
  },
};
</script>
