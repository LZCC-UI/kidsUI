import kidsDivider from "./components/divider/index.js";
import kidsAudio from "./components/audio/index.js";
import kidsVideo from "./components/video/index.js";
import kidsColorPicker from "./components/colorPicker/index.js";
import kidsColorStraw from "./components/colorStraw/index.js";
import kidsCountDownTime from "./components/countdownTime/index.js";
import kidsUpload from "./components/upload/index.js";
import kidsPopup from "./components/popup/index.js";
const components = [
  kidsDivider,
  kidsAudio,
  kidsVideo,
  kidsColorPicker,
  kidsColorStraw,
  kidsCountDownTime,
  kidsUpload,
  kidsPopup,
];

const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default { install, kidsDivider };
