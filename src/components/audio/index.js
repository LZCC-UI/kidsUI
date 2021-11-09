import KidsAudio from "./src/main.vue";
KidsAudio.install = function (app) {
  app.component(KidsAudio.name, KidsAudio);
};
export default KidsAudio;
