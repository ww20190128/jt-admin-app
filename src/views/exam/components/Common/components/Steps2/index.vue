<template>
  <transition name="van-slide-down">
    <div class="steps" v-show="activeIndex > 0">
      <div
        class="step"
        v-for="(item, index) in questionGroup"
        :key="index"
        :class="[getStatus(index)]"
      >
        <div class="dot-wrapper">
          <div class="dot">
            <!-- <van-icon
            name="success"
            class="icon"
            v-if="getStatus(index) === status.DONE"
          /> -->
            <img
              src="@/assets/images/selected.png"
              class="icon"
              v-if="getStatus(index) === status.DONE"
            />
            <!-- <div class="index"> {{ index + 1 }}</div> -->
            <img 
              src="@/assets/images/notselected2.png"
              class="icon2"
              v-else
            />
          </div>
          <div class="name" style="color:#ff9058">{{ item?.name }}</div>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const status = {
  DONE: "done",
  DOING: "doing",
  UNDONE: "undone",
};
const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
  questionGroup: {
    type: Array,
    default: () => [],
  },
});

function getStatus(index) {
  const activeIndex = props.activeIndex;
  if (activeIndex > index) return status.DONE;
  if (activeIndex === index) return status.DOING;
  if (activeIndex < index) return status.UNDONE;
}
</script>

<style lang="less" scoped>
.steps {
  display: flex;
  justify-content: space-between;
  padding: 8px 30px;
  background-color: #fff;
  height: 60px;
  .step {
    position: relative;
    flex: 1;
    display: flex;

    .dot-wrapper {
      flex-shrink: 0;
      width: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .dot {
        width: 18px;
        height: 18px;
        color: #fff;
        // background-color: #ff9058;
        // background-color: #fff;
        font-size: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-top: 5px;
        .index {
          // padding-bottom: 2px;
          // width: 100%;
          // height: 100%;
          // background-image: url("~@/assets/images/notselected.png");
          // background-size:100% 100%;
          
        }
        .icon {
          // position: absolute;
          width: 18px;
          // bottom: 0px;
          // top: 0px;
          // left: 50%;
          // transform: translateX(-50%);
          // z-index: 99;
        }
        .icon2 {
          // position: absolute;
          width: 18px;
          // bottom: 0px;
          // top: 0px;
          // left: 50%;
          // transform: translateX(-50%);
          // z-index: 23;
        }
      }

      .name {
        position: absolute;
        left: 50%;
        width: 100px;
        text-align: center;
        transform: translate(-50%, 100%);
        bottom: 13px;
        font-size: 16px;
        color: #cccccc;
      }
    }

    .line {
      flex: 1;
      height: 1px;
      background-color: #ff9058;
      margin-top: 15px;
      transform: translateY(-50%);
    }

    &.done {
      .dot {
        margin-top: 5px;
        // background-color: #f56b82;
        // background-color: #ff9058;
        // background-color: #fff;
       

      }

      .line {
        // background-color: #f56b82;
        background-color: #ff9058;
      }

      .name {
        // color: #f56b82;
        color: #ff9058;
      }
    }

    &.doing {
      .dot {
        margin-top: 5px;
        // background-color: #f56b82;
        background-color: #fff;
      }

      .name {
        // font-weight: bold;
        // font-size: 15px;
        color: #f56b82;
      }
    }

    &:last-child {
      width: 30px;
      flex-shrink: 0;
      flex: none;

      .line {
        display: none;
      }
    }
  }
}
</style>
