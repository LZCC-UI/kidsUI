<template>
  <div>
    <div class="kids-upload-container" @click="handleClick">
      <input
        type="file"
        class="kids-upload__input"
        ref="input"
        :accept="accept"
        @change="handleChange"
      />
      <slot></slot>
    </div>
    <DomainColor :colorList="colorList" v-if="colorList.length" />
    <!-- <input type="color" /> -->
  </div>
</template>

<script>
import ColorThief from "colorthief";
import DomainColor from "./domaimColor.vue";
export default {
  name: "KidsUpload",
  components: {
    DomainColor,
  },
  props: {
    accept: String,
    pickColor: {
      type: Boolean,
      default: false,
    },
    httpRequest: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      imgUrl: "",
      colorList: [],
    };
  },
  methods: {
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }

      if (postFiles.length === 0) {
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(postFiles[0]);
      reader.onload = (e) => {
        this.imgUrl = e.target.result;
        if (this.pickColor) {
          this.getColor();
        }
        this.$emit("update:value", this.imgUrl);
        this.httpRequest(this.imgUrl);
      };
    },
    getColor() {
      const colorThief = new ColorThief();
      const img = new Image();
      img.addEventListener("load", () => {
        this.colorList = colorThief.getPalette(img, 5);
      });
      img.crossOrigin = "Anonymous";
      img.src = this.imgUrl;
    },
    handleClick() {
      this.$refs.input.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.kids-upload-container {
  width: 6.6rem;
  height: 6.6rem;
  border: 1px dashed black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
  .kids-upload__input {
    display: none;
  }
}
</style>
