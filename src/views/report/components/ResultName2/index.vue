<template>
  <div class="box">
    <div class="name">
      <span :style="{ color: titleColor }">{{ title }}：</span>
      <span :style="{ color }">{{ result }}</span>
      <!-- <div class="bottomicon"></div> -->
    </div>
    <div class="bottomicon"></div>
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
  },
  setup() { },
};
</script>

<style lang="less" scoped>
.box{
  // position: relative;
  //居中
width: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-bottom: 15px;
margin-top: 10px;

}
.name {
  color: @light-black;
  font-size: 19px;
  font-weight: bold;
  padding: @padding-sm 0 0;
  text-align: center;
  z-index:99;
  // margin-bottom: 15px;

  span {
    font-size: 18px;
    z-index: 10;
    // border-bottom: 10px #e4e8ff solid;
  }

}

.bottomicon {
  width: 160px;
  height: 10px;
  background: #e4e8ff;
  border-radius: 10px;
  // position: absolute;
  // bottom: 5px;
  // left: 50%;
  // transform: translateX(-50%);
  z-index: 0;
  // margin-left: 27%;
  margin-top: -8px;
}
</style>