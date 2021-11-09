import tinycolor from "tinycolor2";
export default {
  Instance: tinycolor("#000000"),
  parseColor: function (data) {
    // if (isDef(data) || isNull(data)) {
    //   data = "#000000";
    // }

    if (data && data.hsl) {
      this.instance = tinycolor(data.hsl);
    } else if (data && data.hex && data.hex.length > 0) {
      this.instance = tinycolor(data.hex);
    } else if (data && data.hex8 && data.hex8.length > 0) {
      this.instance = tinycolor(data.hex8);
    } else if (data && data.hsv) {
      this.instance = tinycolor(data.hsv);
    } else if (data && data.rgba) {
      this.instance = tinycolor(data.rgba);
    } else if (data && data.rgb) {
      this.instance = tinycolor(data.rgb);
    } else {
      this.instance = tinycolor(data);
    }

    const hsl = this.instance.toHsl();
    const hsv = this.instance.toHsv();
    const rgb = this.instance.toRgb();

    if (hsl.s === 0) {
      hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || 0;
    }

    if (hsv.h === 0 || hsl.h === 0) {
      hsv.h = hsl.h = data.h || 0;
    }

    if (hsv.v === 0) {
      hsv.s = (data.s && data.s) || (data.hsv && data.hsv.s) || 0;
    }

    return {
      hsl: {
        h: Math.round(hsl.h),
        s: Number(Math.round(hsl.s * 100).toFixed(2)) / 100,
        l: Number(Math.round(hsl.l * 100).toFixed(2)) / 100,
        a: Math.round(hsl.a * 100) / 100,
      },
      hex: this.instance.toHexString().toUpperCase(),
      hex8: this.instance.toHex8String().toUpperCase(),
      rgb: {
        r: Math.round(rgb.r),
        g: Math.round(rgb.g),
        b: Math.round(rgb.b),
        a: Math.round(rgb.a * 100) / 100,
      },
      hsv: {
        h: Math.round(hsv.h),
        s: Math.round(hsv.s * 100) / 100,
        v: Math.round(hsv.v * 100) / 100,
        a: Math.round(hsl.a * 100) / 100,
      },
      source: data.source,
      alpha: Math.round((data.a || this.instance.getAlpha()) * 100) / 100,
    };
  },
  format: function (format) {
    return this.instance.toString(format);
  },
};
