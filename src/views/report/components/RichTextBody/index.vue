<template>
  <div
    class="rich-text"
    v-html="data"
    v-if="data"
  ></div>
</template>

<script>
export default {
  name: "RichTextBody",
  props: {
    data: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
.rich-text {
  .content-font();
}
</style>