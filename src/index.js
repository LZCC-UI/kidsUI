import Progress from "./components/progress/index.js";
import Audio from "./components/audio/index.js";
import Video from "./components/video/index.js";
import Upload from "./components/upload/index.js";
import Divider from "./components/divider/index.js";
import ColorPicker from "./components/colorPicker/index.js";
const components = [Progress, Audio, Video, Upload, Divider, ColorPicker];

const kidsUI = {
  install: function (Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  },
};

export { Progress, Video, Upload, Audio, Divider, ColorPicker };
export default kidsUI;
