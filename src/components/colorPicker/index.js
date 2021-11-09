import KidsColorPicker from "./src/main";
KidsColorPicker.install = function (app) {
  app.component(KidsColorPicker.name, KidsColorPicker);
};
export default KidsColorPicker;
