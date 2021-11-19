<template>
  <div
    :class="[
      'kids-colorPicker-hue',
      'transparent',
      {
        'is-vertical': this.vertical,
        'small-hue-slider': this.size === 'small' && !this.vertical,
      },
    ]"
    @click="handleClick"
  >
    <div class="kids-colorPicker-hue__inner" ref="bar" :style="linearGradient">
      <div
        :class="[
          'kids-colorPicker-hue__inner-pointer',
          { 'small-bar': this.size === 'small' && !this.vertical },
        ]"
        ref="barHandle"
        :style="{
          left: handleLeft + 'px',
          top: handleTop + 'px',
        }"
      >
        <div
          :class="[
            'kids-colorPicker-hue__inner-handle',
            { vertical: this.vertical },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DomUtils from "@/utils/dom";
import "../style/Hue.scss";
const bg =
  "-webkit-linear-gradient(left, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66%, rgb(0, 255, 0) 33.33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66%, rgb(255, 0, 255) 83.33%, rgb(255, 0, 0) 100%)";
const verticalBg =
  "-webkit-linear-gradient(bottom, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66%, rgb(0, 255, 0) 33.33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66%, rgb(255, 0, 255) 83.33%, rgb(255, 0, 0) 100%)";

export default {
  name: "KidsHue",
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "default",
    },
    hue: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0 && value <= 360;
      },
    },
  },
  data() {
    return {
      handleLeft: 0,
      handleTop: 0,
      currentHue: this.hue,
    };
  },
  watch: {
    hue(val) {
      this.currentHue = val;
    },
    currentHue() {
      this.updatePosition();
    },
  },
  computed: {
    linearGradient() {
      return {
        background: this.vertical ? verticalBg : bg,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      const dragConfig = {
        drag: (event) => {
          this.handleDrag(event);
        },
        end: (event) => {
          this.handleDrag(event);
        },
      };

      if (this.$refs.bar && this.$refs.barHandle) {
        DomUtils.addDragEvent(this.$refs.bar, dragConfig);
        DomUtils.addDragEvent(this.$refs.barHandle, dragConfig);
      }
      this.updatePosition();
    });
  },
  methods: {
    getBarLeftPosition() {
      if (this.vertical) return 0;
      if (this.$refs.bar && this.$refs.barHandle) {
        const rect = this.$refs.bar?.getBoundingClientRect();

        if (this.currentHue === 360) {
          return rect.width - this.$refs.barHandle.offsetWidth / 2;
        }
        return (
          ((this.currentHue % 360) *
            (rect.width - this.$refs.barHandle.offsetWidth)) /
            360 +
          this.$refs.barHandle.offsetWidth / 2
        );
      }

      return 0;
    },
    getBarTopPosition() {
      if (!this.vertical) return 0;
      if (this.$refs.bar && this.$refs.barHandle) {
        const rect = this.$refs.bar?.getBoundingClientRect();

        if (this.currentHue === 360) {
          return this.$refs.barHandle?.offsetHeight / 2;
        }
        return (
          ((360 - (this.currentHue % 360)) *
            (rect.height - this.$refs.barHandle.offsetHeight)) /
            360 +
          this.$refs.barHandle.offsetHeight / 2
        );
      }

      return 0;
    },
    updatePosition() {
      this.handleLeft = this.getBarLeftPosition();
      this.handleTop = this.getBarTopPosition();
    },
    handleDrag(event) {
      if (this.$refs.bar && this.$refs.barHandle) {
        const rect = this.$refs.bar?.getBoundingClientRect();

        if (!this.vertical) {
          let left = event.clientX - rect.left;
          left = Math.min(
            left,
            rect.width - this.$refs.barHandle.offsetWidth / 2
          );
          left = Math.max(this.$refs.barHandle.offsetWidth / 2, left);

          this.currentHue = Math.round(
            ((left - this.$refs.barHandle.offsetWidth / 2) /
              (rect.width - this.$refs.barHandle.offsetWidth)) *
              360
          );
        } else {
          let top = event.clientY - rect.top;
          top = Math.min(
            top,
            rect.height - this.$refs.barHandle?.offsetHeight / 2
          );
          top = Math.max(this.$refs.barHandle.offsetHeight / 2, top);

          this.currentHue = Math.round(
            ((top - this.$refs.barHandle.offsetHeight / 2) /
              (rect.height - this.$refs.barHandle.offsetHeight)) *
              360
          );
        }

        this.$emit("update:hue", this.currentHue);
        this.$emit("change", this.currentHue);
      }
    },
    handleClick(event) {
      const target = event.target;
      if (target !== this.$refs.barHandle) {
        this.handleDrag(event);
      }
    },
  },
};
</script>
