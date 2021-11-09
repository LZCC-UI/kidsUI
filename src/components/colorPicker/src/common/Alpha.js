import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  computed,
} from "vue";
import tinycolor from "tinycolor2";
import DomUtils from "@/utils/dom";
import "../style/alpha.scss";
export default defineComponent({
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
  setup(props, { emit }) {
    const barEle = ref(null);
    const cursorEle = ref(null);
    const cursorLeft = ref(0);
    const cursorTop = ref(0);

    const currentAlpha = ref(props.alpha);

    const gradientColor = computed(() => {
      const rgb = tinycolor(props.color).setAlpha(1).toRgbString();
      const alphaGgb = tinycolor(props.color).setAlpha(0).toRgbString();

      let deg = "right";
      if (props.vertical) {
        deg = "bottom";
      }
      return {
        background: `linear-gradient(to ${deg}, ${alphaGgb}, ${rgb}`,
      };
    });

    const getCursorLeft = () => {
      if (props.vertical) return 0;
      if (barEle.value && cursorEle.value) {
        const alpha = currentAlpha.value;
        const rect = barEle.value?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.width - cursorEle.value?.offsetWidth) +
            cursorEle.value?.offsetWidth / 2
        );
      }

      return 0;
    };

    const getCursorTop = () => {
      if (!props.vertical) return 0;
      if (barEle.value && cursorEle.value) {
        const alpha = currentAlpha.value;
        const rect = barEle.value?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.height - cursorEle.value.offsetHeight) +
            cursorEle.value.offsetHeight / 2
        );
      }
      return 0;
    };

    const updatePosition = () => {
      cursorLeft.value = getCursorLeft();
      cursorTop.value = getCursorTop();
    };

    const onDragSlider = (event) => {
      event.stopPropagation();
      if (barEle.value && cursorEle.value) {
        const rect = barEle.value?.getBoundingClientRect();

        if (!props.vertical) {
          let left = event.clientX - rect.left;
          left = Math.max(cursorEle.value.offsetWidth / 2, left);
          left = Math.min(left, rect.width - cursorEle.value.offsetWidth / 2);

          currentAlpha.value =
            Math.round(
              ((left - cursorEle.value.offsetWidth / 2) /
                (rect.width - cursorEle.value.offsetWidth)) *
                100
            ) / 100;
        } else {
          let top = event.clientY - rect.top;
          top = Math.max(cursorEle.value.offsetHeight / 2, top);
          top = Math.min(top, rect.height - cursorEle.value.offsetHeight / 2);

          currentAlpha.value =
            1 -
            Math.round(
              ((top - cursorEle.value.offsetHeight / 2) /
                (rect.height - cursorEle.value.offsetHeight)) *
                100
            ) /
              100;
        }

        emit("update:alpha", currentAlpha.value);
        emit("change", currentAlpha.value);
      }
    };

    const onSliderClick = (event) => {
      const target = event.target;

      if (target !== barEle.value) {
        onDragSlider(event);
      }
    };
    watch(
      () => props.alpha,
      () => {
        currentAlpha.value = props.alpha;
      }
    );
    watch(
      () => currentAlpha.value,
      () => {
        updatePosition();
      }
    );
    onMounted(() => {
      nextTick(() => {
        const dragConfig = {
          drag: (event) => {
            onDragSlider(event);
          },
          end: (event) => {
            onDragSlider(event);
          },
        };

        if (barEle.value && cursorEle.value) {
          DomUtils.addDragEvent(barEle.value, dragConfig);
          DomUtils.addDragEvent(barEle.value, dragConfig);
        }
      });
      updatePosition();
    });
    return () => {
      const wrapClass = [
        "kids-alpha",
        "transparent",
        {
          "is-vertical": props.vertical,
          "small-alpha-slider": props.size === "small" && !props.vertical,
        },
      ];
      return (
        <div class={wrapClass}>
          <div
            class="kids-alpha-slider__bar"
            ref={barEle}
            style={gradientColor.value}
            onClick={onSliderClick}
          >
            <div
              class={[
                "kids-alpha-slider__bar-pointer",
                { "small-bar": props.size === "small" && !props.vertical },
              ]}
              ref={cursorEle}
              style={{
                left: cursorLeft.value + "px",
                top: cursorTop.value + "px",
              }}
            >
              <div
                class={[
                  "kids-alpha-slider__bar-handle",
                  { vertical: props.vertical },
                ]}
              />
            </div>
          </div>
        </div>
      );
    };
  },
});
