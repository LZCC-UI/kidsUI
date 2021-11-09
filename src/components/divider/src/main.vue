<template>
  <div :class="['kids-divider', `kids-divider--${direction}`]">
    <div
      v-if="direction == 'horizontal' && $slots.default"
      :class="['kids-divider__text', `is-${contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "KidsDivider",
  props: {
    direction: {
      type: String,
      default: "horizontal",
      validator(val) {
        return ["horizontal", "vertical"].indexOf(val) !== -1;
      },
    },
    contentPosition: {
      type: String,
      default: "center",
      validator(val) {
        return ["left", "center", "right"].indexOf(val) !== -1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-divider {
  background-color: #dcdfe6;
  position: relative;
}
.kids-divider--horizontal {
  width: 100%;
  height: 1px;
  margin: 24px 0;
}
.kids-divider--vertical {
  width: 1px;
  height: 1em;
  margin: 0 8px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
}
.kids-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}
.is-left {
  left: 20px;
  transform: translateY(-50%);
}
.is-center {
  left: 50%;
  transform: translate(-50%, -50%);
}
.is-right {
  right: 20px;
  transform: translateY(-50%);
}
</style>
