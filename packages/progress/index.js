import KidsProgress from "./src/progress.vue";

KidsProgress.install = function(app) {
  app.component(KidsProgress.name, KidsProgress);
};
export default KidsProgress;
