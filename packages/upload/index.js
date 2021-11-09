import KidsUpload from "./src/main.vue";

KidsUpload.install = function(app) {
  app.component(KidsUpload.name, KidsUpload);
};
export default KidsUpload;
