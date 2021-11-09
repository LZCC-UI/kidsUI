import kidsProgress from "./components/progress/index.js";
import kidsAudio from "./components/audio/index.js";
import kidsVideo from "./components/video/index.js";
import kidsUpload from "./components/upload/index.js";
import kidsDivider from "./components/divider/index.js";
import kidsColorPicker from "./components/colorPicker/index.js";
const components = [
  kidsProgress,
  kidsAudio,
  kidsVideo,
  kidsUpload,
  kidsDivider,
  kidsColorPicker,
];

const kidsUI = {
  install: function (Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  },
};

export {
  kidsProgress,
  kidsAudio,
  kidsVideo,
  kidsUpload,
  kidsDivider,
  kidsColorPicker,
};
export default kidsUI;
