<template>
  <div class="kids-colorPicker">
    <Saturation
      :saturation="currentColor.hsv.s"
      :hue="currentColor.hsv.h"
      :value="currentColor.hsv.v"
      @change="onSaturationChange"
    />
    <div class="kids-colorPicker-body">
      <div class="kids-colorPicker-controls">
        <div class="kids-colorPicker-color-wrap transparent">
          <div
            class="current-color"
            :style="{ background: currentColor.hex8 }"
          />
        </div>
        <div class="kids-colorPicker-sliders">
          <Hue
            v-if="!disableHue"
            :hue="currentColor.hsv.h"
            @change="onHueChange"
            size="small"
          />

          <Alpha
            v-if="!disableAlpha"
            size="small"
            :color="currentColor.hex8"
            @change="onAlphaChange"
            :alpha="currentColor.alpha"
          />
        </div>
      </div>
      <div class="kids-colorPicker-colorInput">
        <ColorInput :color="currentColor" @change="onInputChange" />
      </div>
    </div>
  </div>
</template>

<script>
import Saturation from "./common/Saturation.vue";
import Hue from "./common/Hue.vue";
import Alpha from "./common/Alpha.vue";
import colorUtils from "@/utils/color";
import ColorInput from "./common/colorInput.vue";
import "./style/colorPicker.scss";
export default {
  components: {
    Saturation,
    Hue,
    Alpha,
    ColorInput,
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
  watch: {
    color(val) {
      this.doOnChange(val);
    },
  },
  data() {
    return {
      currentColor: colorUtils.parseColor(this.color),
    };
  },
  methods: {
    doOnChange(data) {
      this.currentColor = colorUtils.parseColor(data);
    },
    doUpdate() {
      if (this.format) {
        // this.$emit("update:color", colorUtils.format(this.format));
        this.$emit("change", colorUtils.format(this.format));
      } else {
        // this.$emit("update:color", this.currentColor);
        this.$emit("change", this.currentColor);
      }
    },
    onSaturationChange(saturation, bright) {
      this.doOnChange({
        h: this.currentColor.hsv.h,
        s: saturation,
        v: bright,
        a: this.currentColor.alpha,
        source: "saturation",
      });
      this.doUpdate();
    },
    onHueChange(hue) {
      this.doOnChange({
        h: hue,
        s: this.currentColor.hsv.s,
        v: this.currentColor.hsv.v,
        a: this.currentColor.alpha,
        source: "hue",
      });
      this.doUpdate();
    },
    onAlphaChange(alpha) {
      this.doOnChange({
        h: this.currentColor.hsv.h,
        s: this.currentColor.hsv.s,
        v: this.currentColor.hsv.v,
        a: alpha,
        source: "alpha",
      });
      this.doUpdate();
    },
    onInputChange(val) {
      this.currentColor = val;
      this.doUpdate();
    },
  },
};
</script>
