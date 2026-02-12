<template>
  <div
    class="tab-item"
    :class="{'active':isActive}"
    @click="hanleItemClick"
  >
    <slot>
    </slot>
  </div>
</template>

<script>
import { computed, inject } from "vue";
export default {
  name: "TabItem",
  props: {
    name: {
      type: [Number, String],
    },
  },
  setup(props) {
    const parent = inject("parent");
    function hanleItemClick() {
      parent.setActive(props.name);
    }
    const isActive = computed(() => parent.props.active === props.name);
    return {
      hanleItemClick,
      isActive,
    };
  },
};
</script>

<style lang="less" scoped>
.tab-item {
  color: #333;
  border-radius: 8px 8px 0 0;
  font-size: 15px;
  padding: 14px 0;
  flex: 1;
  text-align: center;
}
.active {
  background-color: #f0edf0;
  font-weight: bold;
}
</style>