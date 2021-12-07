<template>
  <div>
    <svg
      t="1636539549674"
      class="icon"
      @click="beforeInit"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2127"
      width="200"
      height="200"
    >
      <path
        d="M628.394667 244.906667L195.626667 675.541333a96.384 96.384 0 0 0-28.032 62.72l-15.189334 15.189334a83.498667 83.498667 0 0 0 117.973334 118.016l15.274666-15.189334a95.402667 95.402667 0 0 0 62.72-28.032L781.098667 397.653333l-152.704-152.746666z"
        fill="#FFFFFF"
        p-id="2128"
      ></path>
      <path
        d="M803.328 104.618667c17.578667 0 34.432 6.997333 46.848 19.456l40.661333 40.618666c25.898667 25.898667 25.941333 67.882667 0.085334 93.824L796.501333 352.853333l15.445334 15.445334 3.584 4.010666a42.624 42.624 0 0 1-3.584 56.32l-29.909334 29.866667a42.666667 42.666667 0 0 1-60.288 0.085333l-0.981333-0.981333-372.394667 370.688c-14.848 14.933333-34.133333 24.490667-54.912 27.306667l-7.808 0.725333-15.274666 15.189333A82.688 82.688 0 0 1 211.413333 896a83.498667 83.498667 0 0 1-63.872-137.216l4.864-5.290667 15.189334-15.146666c1.152-21.034667 9.173333-41.002667 22.698666-56.96l5.333334-5.802667 372.48-370.773333-4.224-4.181334-7.381334-7.381333-3.584-4.053333a42.666667 42.666667 0 0 1 3.541334-56.32l29.866666-29.866667a42.666667 42.666667 0 0 1 60.330667 0l15.402667 15.445333 94.378666-94.378666a66.176 66.176 0 0 1 46.890667-19.456z m-205.098667 230.4L225.792 705.706667c-7.978667 8.021333-13.226667 18.304-15.018667 29.354666l-0.597333 5.589334-0.896 16.298666-26.666667 26.666667a40.832 40.832 0 0 0 53.589334 61.269333l4.053333-3.584 26.837333-26.794666 16.341334-0.853334c11.221333-0.597333 21.888-4.693333 30.634666-11.861333l4.224-3.797333 372.266667-370.602667-92.330667-92.458667z"
        fill="#5D6D7E"
        p-id="2129"
      ></path>
    </svg>
    <canvas ref="canvas" id="canvas" width="0" height="0"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    targetEl: {
      require: true,
    },
    beforeStraw: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      canvasRef: null,
      contextRef: null,
      startCatch: false, //开始取色
      scale: 8, //放大倍数
      originalRadius: 45, //放大镜的半径
      centerPoint: { x: 0, y: 0 }, //鼠标位置即放大镜中心
      originalRectangle: { x: 0, y: 0, width: 0, height: 0 }, //图片被放大区域
      canvasRectangle: { x: 0, y: 0, width: 0, height: 0 },
    };
  },
  mounted() {},
  methods: {
    beforeInit() {
      let res = this.beforeStraw();
      if (res && res.then) {
        res.then(() => {
          this.initStraw();
        });
      } else {
        if (res) {
          this.$nextTick(() => {
            if (this.targetEl.tagName != "IMG") {
              console.log("取色元素须为image元素！");
            } else {
              this.targetEl.crossOrigin = "";
              this.initStraw();
            }
          });
        }
      }
    },
    //   初始化canvas
    initStraw() {
      let bbox = this.targetEl.getBoundingClientRect();
      console.log(bbox);
      this.canvasRef = this.$refs.canvas;
      this.canvasRef.width = bbox.width;
      this.canvasRef.height = bbox.height;
      this.contextRef = this.canvasRef.getContext("2d");
      this.targetEl.style.cursor = "none";
      this.disableScroll();
      this.canvasRef.setAttribute(
        "style",
        `position: fixed;top:${bbox.top}px;left:${bbox.left}px;display: block;z-index:1;cursor:crosshair;pointer-events: none;`
      );
      this.contextRef.drawImage(
        this.targetEl,
        0,
        0,
        this.canvasRef.width,
        this.canvasRef.height
      );
      this.addCatchEvent();
    },
    // 禁止滚动
    disableScroll() {
      var mo = function () {
        false;
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", mo, false); //禁止页面滑动
    },
    //取消滚动限制
    enableScroll() {
      var mo = function () {
        false;
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", mo, false);
    },
    // 添加获取事件
    addCatchEvent() {
      if (this.startCatch) {
        return;
      }
      this.startCatch = true;
      this.targetEl.addEventListener("click", this.onmousedown, false);
      this.targetEl.addEventListener("mousemove", this.onmousemove, false);
      document.addEventListener("keyup", this.handleEsc, false);
    },
    // 移除获取事件
    removeCatchEvent() {
      if (this.startCatch) {
        return;
      }
      this.targetEl.removeEventListener("mousemove", this.onmousemove, false);
      this.targetEl.removeEventListener("click", this.onmousedown, false);
    },
    windowToCanvas(x, y) {
      let bbox = this.targetEl.getBoundingClientRect();
      this.canvasRectangle.x = bbox.x;
      this.canvasRectangle.y = bbox.y;
      this.canvasRectangle.width = bbox.width;
      this.canvasRectangle.height = bbox.height;
      return { x: x - bbox.left, y: y - bbox.top };
    },
    handleEsc(e) {
      if (e.keyCode == 27) {
        this.startCatch = false;
        this.removeCatchEvent();
        this.resume();
        document.removeEventListener("keyup", this.handleEsc, false);
      }
    },
    // 鼠标移动中，寻找对应像素点，canvas移动
    onmousemove(event) {
      this.centerPoint = this.windowToCanvas(event.clientX, event.clientY);
      this.draw();
    },
    // 确定最终位置，获取最终像素
    onmousedown(event) {
      event.stopPropagation();
      this.startCatch = false;
      this.removeCatchEvent();
      let { x, y } = this.windowToCanvas(event.clientX, event.clientY);
      let pixel = this.contextRef.getImageData(x, y, 1, 1);
      let data = pixel.data;
      let rgba =
        "rgba(" +
        data[0] +
        "," +
        data[1] +
        "," +
        data[2] +
        "," +
        (data[3] / 255).toFixed(2) +
        ")";
      this.resume();
      this.$emit("change", rgba);
    },
    resume() {
      this.contextRef.clearRect(
        0,
        0,
        this.canvasRef.width,
        this.canvasRef.height
      );
      this.enableScroll();
      this.removeCatchEvent();
      this.targetEl.style.cursor = "default";
    },
    clamp(value, min, max) {
      return min < max
        ? value < min
          ? min
          : value > max
          ? max
          : value
        : value < max
        ? max
        : value > min
        ? min
        : value;
    },
    // 放大原图的区域
    calOriginalRectangle() {
      this.originalRectangle.x = this.centerPoint.x - this.originalRadius;
      this.originalRectangle.y = this.centerPoint.y - this.originalRadius;
      this.originalRectangle.width = this.originalRadius * 2;
      this.originalRectangle.height = this.originalRadius * 2;
    },
    drawMagnifyingGlass() {
      let scaleGlassRectangle = {
        x: this.centerPoint.x - (this.originalRectangle.width * this.scale) / 2,
        y:
          this.centerPoint.y - (this.originalRectangle.height * this.scale) / 2,
        width: this.originalRectangle.width * this.scale,
        height: this.originalRectangle.height * this.scale,
      };

      this.contextRef.save();
      this.contextRef.beginPath();
      this.contextRef.arc(
        this.centerPoint.x,
        this.centerPoint.y,
        this.originalRadius,
        0,
        Math.PI * 2,
        false
      );
      this.contextRef.clip();

      this.contextRef.drawImage(
        this.canvasRef,
        this.originalRectangle.x,
        this.originalRectangle.y,
        this.originalRectangle.width,
        this.originalRectangle.height,
        scaleGlassRectangle.x,
        scaleGlassRectangle.y,
        scaleGlassRectangle.width,
        scaleGlassRectangle.height
      );

      this.contextRef.restore();
      //   绘制网格
      this.contextRef.save();
      this.contextRef.beginPath();
      this.contextRef.arc(
        this.centerPoint.x,
        this.centerPoint.y,
        this.originalRadius,
        0,
        Math.PI * 2,
        false
      );
      this.contextRef.clip();
      this.drawGrid();
      this.contextRef.restore();
    },
    // 绘制网格
    drawGrid(stepX = 10, stepY = 10, lineWidth = 1) {
      let startX = this.originalRectangle.x;
      let startY = this.originalRectangle.y;
      // 设置绘制颜色
      this.contextRef.strokeStyle = `rgb(18,20,19,0.3)`;
      // 设置绘制线段的宽度
      this.contextRef.lineWidth = lineWidth;
      // 创建垂直格网线路径
      for (
        let i = startX + stepX;
        i < startX + this.originalRadius * 2;
        i += stepX
      ) {
        this.contextRef.moveTo(i, startY);
        this.contextRef.lineTo(i, startY + this.originalRadius * 2);
      }
      // 创建水平格网线路径
      for (
        let j = startY + stepX;
        j < startY + this.originalRadius * 2;
        j += stepY
      ) {
        this.contextRef.moveTo(startX, j);
        this.contextRef.lineTo(startX + this.originalRadius * 2, j);
      }

      //绘制格网
      this.contextRef.stroke();
      //   绘制中心点的边框颜色
      this.contextRef.beginPath();
      this.contextRef.lineWidth = 1;

      let pixel = this.contextRef.getImageData(
        this.originalRectangle.x + this.originalRectangle.width / 2,
        this.originalRectangle.y + this.originalRectangle.height / 2,
        1,
        1
      );
      let rgb = [];
      if (
        pixel.data[0] >= 200 &&
        pixel.data[1] <= 100 &&
        pixel.data[2] <= 100
      ) {
        rgb = [0, 0, 0];
      } else {
        rgb = [255, 0, 0];
      }
      this.contextRef.strokeStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      this.contextRef.rect(
        this.originalRectangle.x + this.originalRectangle.width / 2 - 5,
        this.originalRectangle.y + this.originalRectangle.height / 2 - 5,
        10,
        10
      );
      this.contextRef.stroke();
    },
    fillGridColor() {
      let data = this.contextRef.getImageData(
        this.originalRectangle.x +
          (3 * this.originalRectangle.width) / 2 / this.scale,
        this.originalRectangle.y +
          (3 * this.originalRectangle.height) / 2 / this.scale,
        this.originalRectangle.width / this.scale,
        this.originalRectangle.height / this.scale
      ).data;
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          let ind = (y * 9 + x) * 4;
          let r = data[ind];
          let g = data[ind + 1];
          let b = data[ind + 2];
          let a = data[ind + 3];
          this.contextRef.beginPath();
          if (y == 5 && x == 5) {
            this.rgba = { r: r, g: g, b: b, a: a };
          }
          this.contextRef.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          this.contextRef.rect(
            this.originalRectangle.x + x * 10,
            this.originalRectangle.y + y * 10,
            10,
            10
          );
          this.contextRef.fill();
        }
      }
    },
    drawBackGround() {
      this.contextRef.drawImage(
        this.targetEl,
        0,
        0,
        this.canvasRef.width,
        this.canvasRef.height
      );
    },
    draw() {
      this.contextRef.clearRect(
        0,
        0,
        this.canvasRef.width,
        this.canvasRef.height
      );
      this.drawBackGround();
      this.calOriginalRectangle();

      this.drawMagnifyingGlass();
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  max-width: 30px;
  cursor: pointer;
}
</style>
