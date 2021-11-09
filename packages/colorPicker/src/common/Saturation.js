import {
  defineComponent,
  watch,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
} from "vue";
import "../style/saturation.scss";
import DomUtils from "../../../../src/utils/dom";
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
export default defineComponent({
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
  emits: ["update:saturation", "update:value", "change"],
  setup(props, { emit }) {
    //实例
    const instance = getCurrentInstance();
    // data
    const cursorTop = ref(0);
    const cursorLeft = ref(0);
    const background = ref("hsl(" + props.hue + ",100%,50%)");
    const currentHsv = reactive({
      h: props.hue,
      s: props.saturation,
      v: props.value,
    });
    const updatePosition = () => {
      if (instance) {
        const el = instance.vnode.el;
        cursorLeft.value = currentHsv.s * el?.clientWidth;
        cursorTop.value = (1 - currentHsv.v) * el?.clientHeight;
      }
    };
    const handleDrag = (event) => {
      if (instance) {
        const el = instance.vnode.el;
        const rect = el?.getBoundingClientRect();

        let left = event.clientX - rect.left;
        let top = event.clientY - rect.top;

        left = clamp(left, 0, rect.width);
        top = clamp(top, 0, rect.height);

        const saturation = Math.round((left / rect.width) * 100) / 100;
        const bright =
          Math.round(clamp(-(top / rect.height) + 1, 0, 1) * 100) / 100;

        cursorLeft.value = left;
        cursorTop.value = top;

        currentHsv.s = saturation;
        currentHsv.v = bright;

        emit("update:saturation", saturation);
        emit("update:value", bright);
        emit("change", saturation, bright);
      }
    };
    onMounted(() => {
      if (instance && instance.vnode.el) {
        DomUtils.addDragEvent(instance.vnode.el, {
          drag: (event) => {
            handleDrag(event);
          },
          end: (event) => {
            handleDrag(event);
          },
        });

        updatePosition();
      }
    });
    // watch
    watch(
      () => props.hue,
      (hue) => {
        currentHsv.h = hue;
        background.value = "hsl(" + Math.round(currentHsv.h) + ", 100%, 50%)";
      }
    );

    watch(
      () => props.value,
      (value) => {
        currentHsv.v = value;
        updatePosition();
      }
    );

    watch(
      () => props.saturation,
      (saturation) => {
        currentHsv.s = saturation;
        updatePosition();
      }
    );
    return () => {
      return (
        <div
          class="kids-saturation"
          style={{ backgroundColor: background.value }}
        >
          <div class="kids-saturation__white"></div>
          <div class="kids-saturation__black"></div>
          <div
            class="kids-saturation__cursor"
            style={{
              top: cursorTop.value + "px",
              left: cursorLeft.value + "px",
            }}
            onClick={handleDrag}
          ></div>
        </div>
      );
    };
  },
});
