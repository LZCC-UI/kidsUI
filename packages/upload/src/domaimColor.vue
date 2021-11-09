<template>
  <div class="kids-domainColorList">
    <div class="kids-domianColor">
      <h5>Dominant Color</h5>
      <div class="swatch" :style="colors[0]"></div>
    </div>
    <div class="kids-palette">
      <h5>Palette Color</h5>
      <div class="kids-palette-container">
        <div
          class="swatch"
          v-for="item of colors"
          :key="item"
          :style="item"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colorList: {
      type: Array,
      require: true,
    },
  },
  computed: {
    colors() {
      let color = [];
      console.log("colorList", this.colorList);
      for (let item of this.colorList) {
        let temp = {
          backgroundColor: `rgb(${item.join(",")})`,
        };
        color.push(temp);
      }
      return color;
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-domainColorList {
  position: relative;
  display: flex;
  justify-content: space-between;
  .kids-palette {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 30px;
    .kids-palette-container {
      display: flex;
      div {
        margin: 0 5px;
      }
    }
  }
  .swatch {
    width: 2rem;
    height: 2rem;
    display: block;
    border-radius: 50%;
  }
}
</style>
