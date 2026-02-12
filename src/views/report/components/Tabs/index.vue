<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>

<script>
import { reactive, provide } from "vue";
export default {
  name: "Tabs",
  props: {
    active: {
      type: [Number, String],
    },
  },
  setup(props, ctx) {
    function setActive(value) {
      ctx.emit("update:active", value);
    }
    provide("parent", {
      props,
      setActive,
    });
  },
};
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #dddddd;
  margin-bottom: @padding-base;
}
</style>