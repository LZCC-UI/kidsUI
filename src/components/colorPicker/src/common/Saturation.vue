<template>
  <div class="kids-saturation" :style="{ backgroundColor: background }">
    <div class="kids-saturation__white"></div>
    <div class="kids-saturation__black"></div>
    <div
      class="kids-saturation__cursor"
      :style="{
        top: cursorTop + 'px',
        left: cursorLeft + 'px',
      }"
      @click="handleDrag"
    ></div>
  </div>
</template>

<script>
import "../style/saturation.scss";
import DomUtils from "@/utils/dom";
const clamp = (value, min, max) => {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
};
export default {
  name: "Saturation",
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 360,
    },
    saturation: {
      type: Number,
      defalut: 0,
      validator: (value) => value >= 0 && value <= 1,
    },
    value: {
      type: Number,
      defalut: 0,
      validator: (value) => value >= 0 && value <= 1,
    },
  },
  data() {
    return {
      cursorTop: 0,
      cursorLeft: 0,
      background: "hsl(" + this.hue + ",100%,50%)",
      currentHsv: {
        h: this.hue,
        s: this.saturation,
        v: this.value,
      },
    };
  },
  watch: {
    hue(hue) {
      this.currentHsv.h = hue;
      this.background = "hsl(" + Math.round(this.currentHsv.h) + ", 100%, 50%)";
    },
    value(val) {
      this.currentHsv.v = val;
      //   this.updatePosition();
    },
    saturation(val) {
      this.currentHsv.v = val;
      //   this.updatePosition();
    },
  },
  mounted() {
    this.$nextTick(() => {
      DomUtils.addDragEvent(this.$el, {
        drag: (event) => {
          this.handleDrag(event);
        },
        end: (event) => {
          this.handleDrag(event);
        },
      });

      this.updatePosition();
    });
  },
  methods: {
    updatePosition() {
      if (this) {
        const el = this.$el;
        this.cursorLeft = this.currentHsv.s * el?.clientWidth;
        this.cursorTop = (1 - this.currentHsv.v) * el?.clientHeight;
        console.log(this.cursorLeft, this.cursorTop);
      }
    },
    handleDrag(event) {
      if (this) {
        const el = this.$el;
        const rect = el?.getBoundingClientRect();

        let left = event.clientX - rect.left;
        let top = event.clientY - rect.top;
        left = clamp(left, 0, rect.width);
        top = clamp(top, 0, rect.height);
        // console.log("final", top);
        const saturation = Math.round((left / rect.width) * 100) / 100;
        const bright =
          Math.round(clamp(-(top / rect.height) + 1, 0, 1) * 100) / 100;

        this.cursorLeft = left;
        this.cursorTop = top;

        this.currentHsv.s = saturation;
        this.currentHsv.v = bright;
        this.$emit("change", saturation, bright);
      }
    },
  },
};
</script>
