<script setup>
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => { },
  },
  value: {
    type: Number,
  },
});
const emit = defineEmits(["select"]);

const selections = computed(() => props.data?.selections ?? []);
const matter = computed(() => {
  return props.data?.matter.split("|");
});
function isAcive(index) {
  return index === props.value;
}
function handleOption(index) {
  emit("select", index);
}
const optionStyle = computed(() => ({
  width: `${100 / selections.value.length}%`,
}));
</script>

<template>
  <div class="question-warp">
    <!-- 题干 -->
    <div class="subject">
      <div class="item"><span class="mark">A.</span> <span class="value-text">{{ matter?.[0] }}</span></div>
      <div class="item"><span class="mark">B.</span> <span class="value-text">{{ matter?.[1] }}</span></div>
    </div>
    <!-- 选项 -->
    <div class="options">
      <div :style="optionStyle" class="option" :class="{ active: isAcive(index) }" v-for="(item, index) in selections"
        :key="index" @click="handleOption(index)">
        <div class="value">
          <div class="text">{{ item.name }}</div>
          <div class="letter" v-if="[0, 1].includes(index)">A</div>
          <div class="letter" v-if="[3, 4].includes(index)">B</div>
        </div>
        <div class="trigger">
          <div class="radio" :class="{ [value + $index]: true }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@orange-color: #f3af1d;
@blue-color: #684fd6;

.question-warp {
  min-height: 240px;
  background-color: #F7FBFE;
  border-radius: 10px;
  position: relative;

  .subject {
    display: flex;
    justify-content: space-between;
    font-size: 16px !important;
    line-height: 24px;
    border-radius: 4px;
    padding: 10px;

    .item {
      width: 46%;
      line-height: 24px;

      .mark {
        font-size: 22px !important;
      }

      .value-text {
        font-size: 15px !important;
        font-weight: bold;
      }


      &:first-child {
        span {
          color: @orange-color;
        }
      }

      &:last-child {
        span {
          color: @blue-color;
        }
      }
    }
  }

  .options {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #E0F0FE;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    .option {

      flex-shrink: 0;

      line-height: 20px;
      cursor: pointer;

      &:not(:last-child) {
        border-right: 1px solid #fff;
      }

      &:nth-child(-n + 2) {
        .letter {
          color: @orange-color;
        }
      }

      &:nth-last-child(-n + 2) {
        .letter {
          color: @blue-color;
        }
      }

      &.active {
        background-color: #91bee6;

        .trigger {
          .radio {
            position: relative;

            &::before {
              content: "";
              position: absolute;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #f82828;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }

      .value {
        font-size: 16px !important;
        height: 54px;
        border-bottom: 1px solid #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        text-align: center;
      }

      .trigger {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;

        .radio {
          width: 15px;
          height: 15px;
          background-color: #fff;
          border-radius: 50%;
        }
      }
    }
  }


}
</style>
