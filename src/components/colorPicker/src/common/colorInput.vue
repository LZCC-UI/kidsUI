<template>
  <div>
    <div class="inputs-controls">
      <button class="formatBtn" @click="onChangeFormat">
        {{ currentFormat }}
      </button>
      <div class="format-group" v-if="currentFormat === 'hsv'">
        <input
          v-model="currentColor.hsv.h"
          type="number"
          min="0"
          max="360"
          placeholder="h"
          @blur="() => onInputChange('hsv')"
        />
        <input
          v-model="currentColor.hsv.s"
          type="number"
          min="0"
          max="1"
          placeholder="s"
          @blur="() => onInputChange('hsv')"
        />
        <input
          v-model="currentColor.hsv.v"
          type="number"
          min="0"
          max="1"
          placeholder="v"
          @blur="() => onInputChange('hsv')"
        />
      </div>
      <div class="format-group" v-else-if="currentFormat === 'hsl'">
        <input
          v-model="currentColor.hsl.h"
          type="number"
          min="0"
          max="360"
          placeholder="h"
          @blur="() => onInputChange('hsl')"
        />
        <input
          v-model="currentColor.hsl.s"
          type="number"
          min="0"
          max="1"
          placeholder="s"
          @blur="() => onInputChange('hsl')"
        />
        <input
          v-model="currentColor.hsl.l"
          type="number"
          min="0"
          max="1"
          placeholder="l"
          @blur="() => onInputChange('hsl')"
        />
      </div>
      <div class="format-group" v-else-if="currentFormat === 'rgb'">
        <input
          v-model="currentColor.rgb.r"
          type="number"
          min="0"
          max="255"
          placeholder="r"
          @blur="() => onInputChange('rgb')"
        />
        <input
          v-model="currentColor.rgb.g"
          type="number"
          min="0"
          max="255"
          placeholder="g"
          @blur="() => onInputChange('rgb')"
        />
        <input
          v-model="currentColor.rgb.b"
          type="number"
          min="0"
          max="255"
          @blur="() => onInputChange('rgb')"
          placeholder="b"
        />
      </div>

      <section class="format-group" v-else-if="currentFormat === 'hex'">
        <input
          v-model="currentColor.hex"
          type="text"
          maxlength="7"
          placeholder="hex"
          @blur="() => onInputChange('hex')"
        />
      </section>
    </div>
    <div class="inputs-controls">
      <button class="formatBtn">Alpha</button>
      <section class="format-group">
        <input
          v-model="currentColor.alpha"
          type="text"
          maxlength="7"
          placeholder="alpha"
          @blur="() => onInputChange('alpha')"
        />
      </section>
    </div>
  </div>
</template>

<script>
import colorClass from "@/utils/color";
import "../style/colorInput.scss";
const formatList = ["hex", "hsl", "rgb", "hsv"];
export default {
  name: "kidsColorInput",
  props: {
    color: {
      type: [String, Object],
      default: "#000000",
    },
  },
  watch: {
    color(val) {
      this.currentColor = val;
    },
  },
  data() {
    return {
      currentFormat: formatList[0],
      currentColor: colorClass.parseColor(this.color),
    };
  },
  methods: {
    onChangeFormat() {
      const index = formatList.findIndex((val) => val == this.currentFormat);
      this.currentFormat = formatList[(index + 1) % formatList.length];
    },
    doOnChange(data) {
      this.currentColor = colorClass.parseColor(data);
      this.$emit("update:color", this.currentColor);
      this.$emit("change", this.currentColor);
    },
    onInputChange(source) {
      switch (source) {
        case "hex":
          this.doOnChange({ hex: this.currentColor.hex, source: "hex" });
          break;
        case "hsl":
          this.doOnChange({ hsl: this.currentColor.hsl, source: "hsl" });
          break;
        case "rgb":
          this.doOnChange({ rgb: this.currentColor.rgb, source: "rgb" });
          break;
        case "hsv":
          this.doOnChange({ hsv: this.currentColor.hsv, source: "hsv" });
          break;
        case "alpha":
          this.doOnChange({ hsv: this.currentColor.hsv, source: "hsv" });
          break;
      }
    },
  },
};
</script>
