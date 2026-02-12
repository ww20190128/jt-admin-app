<template>
  <div class="content-wrapper">
    <LargeTitle :label="title" />
    <slot class="wrapper">
    </slot>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import LargeTitle from "../../../../components/LargeTitle";
// mbti 
export default {
  name: "gallup",
  props: {
    title: {
      type: String,
      default: () => '',
    },
    enTitle: {
      type: String,
      default: () => '',
    },
  },
  components: {
    LargeTitle,
  },

  setup(props, { emit }) {
    const state = reactive({
      components: {

      },
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>

</style>