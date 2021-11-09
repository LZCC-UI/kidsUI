import { defineComponent } from "vue";
import ColorPicker from "./common/index";
export default defineComponent({
  name: "kidsColorPicker",
  props: {
    color: String,
  },
  setup() {
    return () => {
      return (
        <div>
          <ColorPicker> </ColorPicker>
        </div>
      );
    };
  },
});
