<template>
  <div class="title">
    <slot></slot>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "Title",
  setup() {},
};
</script>

<style lang="less" scoped>
.title {
  font-size: 17px;
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-weight: bold;
  position: relative;
  margin: @padding-base 0;
  &::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 3px;
    border-radius: 3px;
    background-color: #dddddd;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>