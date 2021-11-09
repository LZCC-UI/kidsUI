export default {
  data() {
    return {
      // 鼠标进body时是否是mousedown
      isMouseDownOnBody: false,
      // 鼠标离开进度条时的clientX
      outProgressClientX: 0,
      // 主要用于防止一个页面内有多个本组件，MouseMove时互相影响而设置的字段
      isCurrentProgress: false,
    };
  },
  methods: {
    mousedownHandler(e) {
      // 是否是鼠标左键点击
      if (e.which === 1) {
        this.isDragging = true;
        this.isCurrentProgress = true;
      }
    },
    mousemoveHandler(e) {
      if (this.isDragging && this.isCurrentProgress) {
        this.moveAt(e.clientX);
      }
    },
    mouseupHandler(e) {
      if (this.isDragging && this.isCurrentProgress) {
        console.log(e);
        this.moveAt(e.clientX);
        this.isDragging = false;
        this.isCurrentProgress = false;
        this.bodyRemoveEventHandler();
      }
    },
    mouseoverHandler(e) {
      // 没有按左键进入进度条
      if (e.which === 0) {
        this.isDragging = false;
      }
    },
    mouseoutHandler(e) {
      if (e.which === 1 && this.isCurrentProgress) {
        this.outProgressClientX = e.clientX;
        if (!this.isMouseDownOnBody) {
          this.bodyRemoveEventHandler();
          this.isMouseDownOnBody = true;
          this.bodyEventHandler();
        }
      }
    },
    // body元素的事件监听器
    bodyEventHandler() {
      let body = document.getElementsByTagName("body")[0];
      body.addEventListener("mousemove", this.bodyMousemoveHandler, true);
      body.addEventListener("mouseup", this.bodyMouseupHandler, true);
    },
    bodyRemoveEventHandler() {
      this.isMouseDownOnBody = false;
      let body = document.getElementsByTagName("body")[0];
      body.removeEventListener("mousemove", this.bodyMousemoveHandler, true);
      body.removeEventListener("mouseup", this.bodyMouseupHandler, true);
    },
    bodyMouseupHandler() {
      this.isDragging = false;
      this.isMouseDownOnBody = false;
      this.outProgressClientX = 0;
      this.isCurrentProgress = false;
      this.bodyRemoveEventHandler();
    },
    // body元素的mousemove事件监听器
    bodyMousemoveHandler(e) {
      e.preventDefault();
      if (e.which === 1 && this.isMouseDownOnBody === true) {
        let offsetX = e.clientX - this.outProgressClientX;
        // 右移了
        if (offsetX > 0) {
          // 在进度条右边界内
          if (e.clientX < this.totalWidth + this.$el.offsetLeft) {
            this.moveAt(e.clientX);
            // 超出右边界
          } else {
            this.percentage = 100;
            this.$emit("updatePercent", 100);
          }
          // 左移了
        } else if (offsetX < 0) {
          // 在进度条左边界内
          if (e.clientX > this.$el.offsetLeft) {
            this.moveAt(e.clientX);
            // 超出左边界
          } else {
            this.percentage = 0;
            this.$emit("updatePercent", 0);
          }
        }
      }
    },
  },
};
