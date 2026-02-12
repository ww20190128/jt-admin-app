<template>
  <div class="classify-bar">
    <div class="item-list">
      <div class="item" v-for="item in classifyList" :key="item" @click="handleClassifyChange(item)">
        <van-image fit="cover" :src="item?.iconImg"> </van-image>
        <div class="name" :class="{ 'activity': activeClassify == item.name }">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import iconAll from "@/assets/images/icon/mindfulness-icon-all.png";
import iconEmotion from "@/assets/images/icon/mindfulness-icon-emotion.png";
import iconGrow from "@/assets/images/icon/mindfulness-icon-grow.png";
import iconMeditation from "@/assets/images/icon/mindfulness-icon-meditation.png";
import iconRelax from "@/assets/images/icon/mindfulness-icon-relax.png";
import iconSleep from "@/assets/images/icon/mindfulness-icon-sleep.png";
export default {
  name: "classifyBar",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      activeClassify: '',
    });

    // tabbar
    const classifyList = [
      {
        iconImg: iconAll,
        name: "全部",

      },
      {
        iconImg: iconSleep,
        name: "睡眠改善",

      },
      {
        iconImg: iconRelax,
        name: "疲劳放松",

      },
      {
        iconImg: iconEmotion,
        name: "情绪管理",

      },
      {
        iconImg: iconGrow,
        name: "个人成长",

      },
      {
        iconImg: iconMeditation,
        name: "冥想",
      },
    ];
    // 分类切换事件
    function handleClassifyChange(item) {
      this.activeClassify = item.name
    }
    return {
      classifyList,
      handleClassifyChange,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.classify-bar {
  position: relative;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 10px 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .item-list {
    flex-wrap: nowrap;
    display: flex;
    margin-bottom: 10px;

    .item {
      flex: 0 0 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &.activity {
        border-radius: 10px;
        background-color: #F7F4FF !important;
      }

      .van-image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 auto;

        :deep(img) {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .name {
        text-align: center;
        padding-top: 10px;
        font-size: @font-size-sm;

        &.activity {

          color: #8ec5fc !important;
        }
      }
    }
  }

}
</style>