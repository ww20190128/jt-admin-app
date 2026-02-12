<template>
  <div class="hexagon-box">
    <div class="box-f hexagon-0">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[0],'#EEEEEE')"
        >
          <div class="icon"><i
              :class="[options[0]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[0]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-1">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[1])"
        >
          <div class="icon"><i
              :class="[options[1]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[1]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-2">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[2])"
        >
          <div class="icon"><i
              :class="[options[2]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[2]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-3">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[3])"
        >
          <div class="icon"><i
              :class="[options[3]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[3]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-4">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[4])"
        >
          <div class="icon"><i
              :class="[options[4]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[4]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-5">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[5])"
        >
          <div class="icon"><i
              :class="[options[5]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[5]?.name}}</div>
        </div>
      </div>
    </div>
    <div class="box-f hexagon-6">
      <div class="box-s">
        <div
          class="box-t"
          :style="style(options[6])"
        >
          <div class="icon"><i
              :class="[options[6]?.icon]"
              class="fa"
            ></i></div>
          <div class="name">{{options[6]?.name}}</div>
        </div>
      </div>
    </div>
    <div style="clear: both;"></div>
  </div>
</template>

<script>
export default {
  name: "Hexagon",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    function style(item, color) {
      const styles = {
        backgroundColor: "#EEEEEE",
        color: "#000",
      };

      if (!item) {
        styles.backgroundColor = color || "red";
      }

      if (item?.active) {
        styles.backgroundColor = item.bgColor;
        styles.color = "#fff";
      }
      return styles;
    }
    return {
      style,
    };
  },
};
</script>

<style lang="less" scoped>
body {
  position: relative;
  overflow-y: hidden;
}
.hexagon-box {
  margin-top: 100px;
  margin-bottom: 260px;
  position: relative;
  width: 100%;
}

.hexagon-box .icon {
  font-size: 36px;
}

.hexagon-box .name {
  font-size: 20px;
}

.hexagon-0 .icon {
  display: none;
}

.hexagon-0 .name {
  font-size: 40px;
}

.hexagon-box::after {
  content: "";
  width: 100%;
  height: 1px;
  display: block;
  clear: both;
}

.box-f,
.box-s,
.box-t {
  width: 100px;
  height: 150px;
  overflow: hidden;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
}

.box-f {
  transform: rotate(120deg);
}

.box-s {
  transform: rotate(-60deg);
}

.box-t {
  transform: rotate(-60deg);
  background: no-repeat 50% center;
  background-size: 125% auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hexagon-0 {
  left: 0;
  right: 0;
}

.hexagon-1 {
  left: -220px;
}

.hexagon-4 {
  left: 220px;
}

.hexagon-6 {
  top: 95px;
  left: -113px;
}

.hexagon-5 {
  top: 95px;
  left: 113px;
}

.hexagon-2 {
  top: -95px;
  left: -113px;
}

.hexagon-3 {
  top: -95px;
  left: 113px;
}
</style>