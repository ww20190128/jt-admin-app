<template>
  <!-- <div class="name" v-if="position === 'left'">
    <span :style="{ color: titleColor }">{{ title }}：</span>
    <span :style="{ color }">{{ result }}</span>
  </div> -->
  <!-- 标题 -->
  <div class="title-warp">
    <div class="title">{{ title }}</div>
    <span class="sub-title" v-if="result">{{ result }}</span>
    <!-- <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-left" /> -->

    <!-- <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-right" /> -->
  </div>
</template>

<script>

export default {
  name: "ResultName",
  props: {
    color: {
      type: String,
      default: "#F6727E",
    },
    titleColor: {
      type: String,
      default: "#F6727E",
    },
    title: {
      type: String,
    },
    result: {
      type: String,
    },
    position: {
      type: String,
      default: "center",
    },
  },
  setup() { },
};
</script>

<style lang="less" scoped>
.name {
  color: @light-black;
  font-weight: bold;
  padding: @padding-sm 0 0;

  span {
    font-size: 20px;
  }
}


.title-warp {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 35px;
  width: 100%;
  background-color: #fff;

  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  color: #fff;
  line-height: 35px;

  position: relative;

  .title {
    text-align: center;
border-radius:5px;
    height: 35px;
    background-color: #fff;
    padding: 0 10px;
    z-index: 10;
    position: relative;
    font-size: 16px;
    font-weight: 600;
    &::before {
      content: "";
      position: absolute;
      border-radius: 5px;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: #4b7296;
      box-shadow: 2px 2px 0 #fecc46, 2px 2px 0 0.5px #fecc46;
      transform: translate(-50%, -50%) skew(-15deg); // 平移并倾斜45度
      z-index: -1; // 使伪元素在文字后面显示
    }

  }

  .sub-title {
    border-radius: 5px;
    margin-left: 10px;
    height: 35px;
    // background-color: #fff;
    padding: 0 10px;
    z-index: 10;
    position: relative;
    font-size: 16px;
    font-weight: 500;
    color: @light-black;
    &::before {
      border-radius: 5px;
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border: 1px solid #5b90c2;
      // background: #4b7296;
      box-shadow: 2px 2px 0 #4b7296, 2px 2px 0 0.5px #4b7296;
      transform: translate(-50%, -50%) skew(-15deg); // 平移并倾斜45度
      z-index: -1; // 使伪元素在文字后面显示
    }
  }
}
</style>