<template>
  <div class="comments">
    <div
      class="item"
      v-for="item in data"
      :key="item"
    >
      <div class="left">
        <img
          :src="item.headimageurl"
        >
      </div>
      <div class="right">
        <div class="time">发布时间：{{item.comment_time}}</div>
        <div class="text">
          {{item.content}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "Comments",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {},
};
</script>

<style lang="less" scoped>
.comments {
  padding: 0 @padding-base;
  font-size: @font-size-sm;
  .item {
    padding: @padding-base 0;
    .space-between();
    border-bottom: 1px solid #f1f1f1;
    &:nth-last-child {
      border: none;
    }
    .left {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .right {
      flex: 1;
      padding-left: @padding-base;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .time {
        color: @gray-color;
      }
    }
  }
}
</style>