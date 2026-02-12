<template>
  <div class="pc-select">
    <input
      type="text"
      @click.stop="visible=!visible"
      v-model="inputValue"
      :placeholder="placeholder"
      :class="{'focus':visible}"
    >
    <div
      class="pc-icon"
      @click.stop="visible=!visible"
    >
      <van-icon
        name="arrow-down"
        class="icon"
        :class="{'caret':visible}"
      />
    </div>

    <div
      class="pc-dropdown"
      v-show="visible"
      ref="dropdownRef"
    >
      <div
        class="pc-dropdown-item"
        :class="{'selected':item.value===modelValue}"
        v-for="item in options"
        :key="item.value"
        @click="handleItem(item)"
      >
        {{item.label}}
      </div>
    </div>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  nextTick,
  watch,
} from "vue";
import { useEventListener } from "@/hooks/useEventListener";
export default {
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    placeholder: {
      type: [String, Number],
    },
    options: {
      type: Array,
      required: true,
    },
  },
  setup(props, ctx) {
    const dropdownRef = ref(null);
    const { on, off } = useEventListener();
    onMounted(() => {
      on(document, "click", close);
    });
    function close() {
      state.visible = false;
    }

    onBeforeUnmount(() => {
      off(document, "click", close);
    });
    const state = reactive({
      visible: false,
    });
    watch(
      () => state.visible,
      (val) => {
        if (!val) return;
        nextTick(() => {
          const index = props.options.findIndex(
            (v) => v.value === props.modelValue
          );
          dropdownRef.value.scrollTop = 34 * index;
        });
      }
    );
    function handleItem({ value }) {
      ctx.emit("update:modelValue", value);
      state.visible = false;
    }
    const inputValue = computed(() => {
      const current = props.options.find((v) => v.value === props.modelValue);
      return current?.label ?? "";
    });
    return {
      handleItem,
      ...toRefs(state),
      inputValue,
      dropdownRef,
    };
  },
};
</script>
<style lang="less" scoped>
.selected {
  background-color: #f5f7fa;
  font-weight: bold;
}
.focus {
  border-color: #409eff !important;
}
.caret {
  transform: rotate(180deg) !important;
}

.pc-select {
  position: relative;
  color: @light-black;
  font-size: @font-size-base;
  width: 100px;
  .pc-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    .icon {
      color: #dcdfe6;
      transition: transform 0.3s;
      transform: rotate(0deg);
    }
  }
  input {
    cursor: pointer;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 35px;
    line-height: 35px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    color: transparent;
    text-shadow: 0 0 0 @light-black;
    &::placeholder {
      color: #dddee0;
    }
    &:hover {
      border-color: #c0c4cc;
    }
  }
  .pc-dropdown {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    width: 100%;
    max-height: 272px;
    overflow-y: auto;
    transform-origin: center bottom;
    z-index: 2005;
    position: absolute;
    top: 35px;
    left: 0;
    .scroll-bar();
    &::-webkit-scrollbar {
      display: block;
    }
    .pc-dropdown-item {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>