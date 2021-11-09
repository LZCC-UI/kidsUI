import { defineComponent, ref, watch, toRaw } from "@vue/runtime-core";
import Saturation from "./Saturation";
import Hue from "./Hue";
import Alpha from "./Alpha";
import colorUtils from "../../../../src/utils/color";
import ColorInput from "./colorInput";
import "../style/colorPicker.scss";
export default defineComponent({
  name: "ColorPicker",
  props: {
    color: {
      type: [String, Object],
      default: "#000000",
    },
    disableHue: {
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
  setup(props, { emit }) {
    const currentColor = ref(colorUtils.parseColor(props.color));
    const doOnChange = (data) => {
      console.log(data);
      currentColor.value = colorUtils.parseColor(data);
    };
    const doUpdate = () => {
      if (props.format) {
        emit("update:color", colorUtils.format(props.format));
        emit("change", colorUtils.format(props.format));
      } else {
        emit("update:color", currentColor.value);
        emit("change", currentColor.value);
      }
    };
    const onSaturationChange = (saturation, bright) => {
      doOnChange({
        h: currentColor.value.hsv.h,
        s: saturation,
        v: bright,
        a: currentColor.value.alpha,
        source: "saturation",
      });
      doUpdate();
    };
    const onHueChange = (hue) => {
      doOnChange({
        h: hue,
        s: currentColor.value.hsv.s,
        v: currentColor.value.hsv.v,
        a: currentColor.value.alpha,
        source: "hue",
      });
      doUpdate();
    };
    const onAlphaChange = (alpha) => {
      doOnChange({
        h: currentColor.value.hsv.h,
        s: currentColor.value.hsv.s,
        v: currentColor.value.hsv.v,
        a: alpha,
        source: "alpha",
      });
      doUpdate();
    };
    const onInputChange = (val) => {
      currentColor.value = val;
      doUpdate();
    };

    watch(
      () => props.color,
      (newVal) => {
        doOnChange(toRaw(newVal));
      }
    );
    return () => {
      return (
        <div class="kids-colorPicker">
          <Saturation
            saturation={currentColor.value.hsv.s}
            hue={currentColor.value.hsv.h}
            value={currentColor.value.hsv.v}
            onChange={onSaturationChange}
          />
          <div class="kids-colorPicker-body">
            <div class="kids-colorPicker-controls">
              <div class="kids-colorPicker-color-wrap transparent">
                <div
                  class="current-color"
                  style={{ background: currentColor.value.hex8 }}
                />
              </div>
              <div class="kids-colorPicker-sliders">
                {!props.disableHue && (
                  <Hue
                    hue={currentColor.value.hsv.h}
                    onChange={onHueChange}
                    size="small"
                  />
                )}
                {!props.disableAlpha && (
                  <Alpha
                    size="small"
                    color={currentColor.value.hex8}
                    onChange={onAlphaChange}
                    alpha={currentColor.value.alpha}
                  />
                )}
              </div>
            </div>
            <div class="kids-colorPicker-colorInput">
              <ColorInput color={currentColor.value} onChange={onInputChange} />
            </div>
            {/* 
            {!props.disableHistory && (
              <History
                color-list={storageColorList.value}
                round={props.historyRound}
                onChange={onCompactChange}
              />
            )} */}
          </div>
        </div>
      );
    };
  },
});
