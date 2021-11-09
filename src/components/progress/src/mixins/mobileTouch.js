const generateMethods = function () {
  return {
    methods: {
      // 拖拽 切换进度
      startDragging(e) {
        if (!this.dragable) return;
        this.moveAt(e.targetTouches[0].pageX);
        this.isDragging = true;
      },
      onDragging(e) {
        if (!this.isDragging) return;
        this.moveAt(e.targetTouches[0].pageX);
      },
      stopDragging() {
        if (!this.dragable || !this.isDragging) return;
        this.isDragging = false;
      },
    },
  };
};
export default generateMethods();
