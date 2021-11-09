import { defineComponent, ref, watch, toRaw } from "vue";
import ColorPicker from "./common/index";
export default defineComponent({
  name: "kidsColorPicker",
  props: {
    color: String,
  },
  setup() {
    return () => {
      return <div></div>;
    };
  },
});
