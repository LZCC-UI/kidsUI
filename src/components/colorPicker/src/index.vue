<template>
  <div>
    <div class="colorArea" :style="bgStyle" @click="handleClick"></div>
    <Popup v-model="popupVis">
      <Main :color="color" @change="handleChange"></Main>
    </Popup>
  </div>
</template>

<script>
import Main from "./main.vue";
import Popup from "../../popup/index.js";
export default {
  components: {
    Main,
    Popup,
  },
  model: {
    prop: "color",
    event: "updateColor",
  },
  props: {
    color: {
      type: [String, Object],
      default: "#000000",
    },
    disableHue: {
      type: Boolean,
      defalut: false,
    },
    disableAlpha: {
      type: Boolean,
      defalut: false,
    },
    format: {
      type: String,
      validator: (value) =>
        [
          "rgb",
          "prgb",
          "hex",
          "hex6",
          "hex3",
          "hex4",
          "hex8",
          "name",
          "hsl",
          "hsv",
        ].indexOf(value) != -1,
    },
  },
  data() {
    return {
      popupVis: false,
    };
  },
  computed: {
    bgStyle() {
      const style = {};
      style.backgroundColor = this.color;
      return style;
    },
  },
  methods: {
    handleClick() {
      this.popupVis = true;
    },
    handleChange(color) {
      this.$emit(
        "updateColor",
        `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.colorArea {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
