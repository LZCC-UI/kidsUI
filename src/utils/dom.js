export default class DomUtils {
  static addEventListener(element, handler, option) {
    if (element && handler && option) {
      element.addEventListener(handler, option);
    }
  }
  static removeEventListener(element, handler, option) {
    if (element && handler && option) {
      element.removeEventListener(handler, option);
    }
  }
  static addDragEvent(element, options) {
    let isDragging = false;
    const moveFn = function (event) {
      options.drag?.(event);
    };

    const upFn = (event) => {
      DomUtils.removeEventListener(document, "mousemove", moveFn);
      DomUtils.removeEventListener(document, "mouseup", upFn);
      document.onselectstart = null;
      document.ondragstart = null;

      isDragging = false;

      options.end?.(event);
    };

    DomUtils.addEventListener(element, "mousedown", (event) => {
      if (isDragging) return;
      document.onselectstart = () => false;
      document.ondragstart = () => false;
      DomUtils.addEventListener(document, "mousemove", moveFn);
      DomUtils.addEventListener(document, "mouseup", upFn);

      isDragging = true;

      options.start?.(event);
    });

    return;
  }
}
