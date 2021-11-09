import { _debounce, _set } from "lodash";
export default {
  bind(el, bindings, vnode) {
    el.addEventListener(
      "blur",
      _debounce(
        (e) => {
          console.log("blur-trim");
          let initVal = String(e.target.value).replace(/(^\s+)|(\s+$)/g, "");
          e.target.value = initVal;
          _set(vnode.context, vnode.data.model.expression, initVal);
        },
        bindings.arg || 200,
        { leading: true }
      ),
      true
    );
  },
};
