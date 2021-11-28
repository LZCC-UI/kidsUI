<template>
  <div class="kids-domainColorList">
    <div class="kids-domianColor">
      <h5>Dominant Color</h5>
      <div class="swatch" :style="colors[0]" @click="handleClick(0)"></div>
    </div>
    <div class="kids-palette">
      <h5>Palette Color</h5>
      <div class="kids-palette-container">
        <div
          class="swatch"
          v-for="(item, index) of colors"
          :key="index"
          :style="item"
          @click="handleClick(index)"
        ></div>
      </div>
    </div>
    <kidsPopup></kidsPopup>
  </div>
</template>

<script>
import kidsPopup from "../../popup/src/main.vue";
export default {
  components: {
    kidsPopup,
  },
  props: {
    colorList: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      popupVisible: false,
      target: {
        color: "",
        key: 0,
      },
    };
  },
  computed: {
    colors() {
      let color = [];
      for (let item of this.colorList) {
        let temp = {
          backgroundColor: `rgb(${item.join(",")})`,
        };
        color.push(temp);
      }
      return color;
    },
  },
  methods: {
    handleClick(index) {
      this.target.color = this.colors[index];
      this.target.key = index;
      this.popupVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-domainColorList {
  position: relative;
  .kids-domianColor {
    text-align: left;
  }
  .kids-palette {
    text-align: left;

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
