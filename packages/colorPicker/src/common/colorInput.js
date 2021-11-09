import { defineComponent, ref, toRaw, watch, Suspense } from "vue";
import colorClass from "../../../../src/utils/color";
import "../style/colorInput.scss";
const formatList = ["hex", "hsl", "rgb", "hsv"];

export default defineComponent({
  name: "kidsColorInput",
  props: {
    color: {
      type: [String, Object],
      default: "#000000",
    },
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const currentFormat = ref(formatList[0]);
    const currentColor = ref(colorClass.parseColor(props.color));

    const onChangeFormat = () => {
      const index = formatList.findIndex((val) => val == currentFormat.value);
      console.log(currentColor.value);
      currentFormat.value = formatList[(index + 1) % formatList.length];
    };

    watch(
      () => props.color,
      (newVal) => {
        currentColor.value = toRaw(newVal);
      }
    );

    const doOnChange = (data) => {
      currentColor.value = colorClass.parseColor(data);
      emit("update:color", currentColor.value);
      emit("change", currentColor.value);
    };

    const onInputChange = (source) => {
      switch (source) {
        case "hex":
          doOnChange({ hex: currentColor.value.hex, source: "hex" });
          break;
        case "hsl":
          doOnChange({ hsl: currentColor.value.hsl, source: "hsl" });
          break;
        case "rgb":
          doOnChange({ rgb: currentColor.value.rgb, source: "rgb" });
          break;
        case "hsv":
          doOnChange({ hsv: currentColor.value.hsv, source: "hsv" });
          break;
        case "alpha":
          doOnChange({ hsv: currentColor.value.hsv, source: "hsv" });
          break;
      }
    };

    return () => {
      return (
        <div>
          <div class="inputs-controls">
            <button class="formatBtn" onClick={onChangeFormat}>
              {currentFormat.value}
            </button>
            {currentFormat.value === "hsv" && (
              <div class="format-group">
                <input
                  v-model={currentColor.value.hsv.h}
                  type="number"
                  min="0"
                  max="360"
                  placeholder="h"
                  onBlur={() => onInputChange("hsv")}
                />
                <input
                  v-model={currentColor.value.hsv.s}
                  type="number"
                  min="0"
                  max="1"
                  placeholder="s"
                  onBlur={() => onInputChange("hsv")}
                />
                <input
                  v-model={currentColor.value.hsv.v}
                  type="number"
                  min="0"
                  max="1"
                  placeholder="v"
                  onBlur={() => onInputChange("hsv")}
                />
              </div>
            )}
            {currentFormat.value === "hsl" && (
              <div class="format-group">
                <input
                  v-model={currentColor.value.hsl.h}
                  type="number"
                  min="0"
                  max="360"
                  placeholder="h"
                  onBlur={() => onInputChange("hsl")}
                />
                <input
                  v-model={currentColor.value.hsl.s}
                  type="number"
                  min="0"
                  max="1"
                  placeholder="s"
                  onBlur={() => onInputChange("hsl")}
                />
                <input
                  v-model={currentColor.value.hsl.l}
                  type="number"
                  min="0"
                  max="1"
                  placeholder="l"
                  onBlur={() => onInputChange("hsl")}
                />
              </div>
            )}
            {currentFormat.value === "rgb" && (
              <div class="format-group">
                <input
                  v-model={currentColor.value.rgb.r}
                  type="number"
                  min="0"
                  max="255"
                  placeholder="r"
                  onBlur={() => onInputChange("rgb")}
                />
                <input
                  v-model={currentColor.value.rgb.g}
                  type="number"
                  min="0"
                  max="255"
                  placeholder="g"
                  onBlur={() => onInputChange("rgb")}
                />
                <input
                  v-model={currentColor.value.rgb.b}
                  type="number"
                  min="0"
                  max="255"
                  onBlur={() => onInputChange("rgb")}
                  placeholder="b"
                />
              </div>
            )}
            {currentFormat.value === "hex" && (
              <section class="format-group">
                <input
                  v-model={currentColor.value.hex}
                  type="text"
                  maxlength="7"
                  placeholder="hex"
                  onBlur={() => onInputChange("hex")}
                />
              </section>
            )}
          </div>
          <div class="inputs-controls ">
            <button class="formatBtn">Alpha</button>
            <section class="format-group">
              <input
                v-model={currentColor.value.alpha}
                type="text"
                maxlength="7"
                placeholder="alpha"
                onBlur={() => onInputChange("alpha")}
              />
            </section>
          </div>
        </div>
      );
    };
  },
});
