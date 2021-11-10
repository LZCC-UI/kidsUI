import kidsDivider from "./components/divider/index.js";

const components = [kidsDivider];

const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default { install, kidsDivider };
