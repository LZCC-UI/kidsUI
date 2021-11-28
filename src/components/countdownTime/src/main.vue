<template>
  <div>
    <span v-if="!flag">{{ time }}</span>
    <span v-else>到期</span>
  </div>
</template>

<script>
export default {
  name: "kidsCountdownTime",
  props: {
    endTime: {
      require: true,
      type: String || Date,
      default: Date.now(),
    },
  },
  data() {
    return {
      flag: false,
      time: "",
    };
  },
  mounted() {
    let timeInterval = setInterval(() => {
      if (this.flag) {
        clearInterval(timeInterval);
      }
      this.timeDowm();
    }, 500);
  },
  methods: {
    timeDowm() {
      const endTime = new Date(this.endTime);
      const nowTime = new Date();
      let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);
      if (leftTime <= 0) {
        this.flag = true;
        this.$emit("timEnd");
        return;
      }
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));

      this.time = d > 0 ? `${d}:${h}:${m}:${s}` : `${h}:${m}:${s}`;
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
