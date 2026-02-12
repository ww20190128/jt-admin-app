<template>
  <div class="suggest-warp" v-if="data">
    <div class="title-warp">
      <div class="icon"><i class="fa fa-lightbulb-o"></i></div>
      <span class="name">指导建议</span>
    </div>
    <div class="content-warp" v-html="data">
    </div>
  </div>
</template>

<script>
export default {
  name: "Suggest",
  props: {
    data: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
.suggest-warp {

  margin-bottom: 20px;

  background-color: @bg-color;
  color: @light-black;


  border-radius: 8px;

  .title-warp {
    color: #ffff;
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
    background-image: linear-gradient(270deg, #f093fb 0%, #f5576c 100%);
    height: 40px;
    font-weight: bold;
    font-size: 18px;
    padding-left: 10px;

    .icon {
      line-height: 20px;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #fff;
      text-align: center;
      padding-top: 2px;

      i {
        color: #f5576c;
        font-size: 18px;
      }
    }

    .name {
      font-weight: 600;
      margin-left: 10px;
      line-height: 40px;
      font-size: 18px;
    }
  }

  .content-warp {
    background-color: @bg-color;
    padding: 5px 10px;
    line-height: 2;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    font-size: .37333rem;
    border: 1px solid #fabfc1;
    border-top: none;
  }
}

:deep(.content-warp) {
  p {
    margin-bottom: 12px;
  }
}
</style>