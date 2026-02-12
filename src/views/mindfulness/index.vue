<template>
  <div class="mindfulness-index-warper">
    <div class="top-warper" :style="{ backgroundImage: 'url(' + sentence?.img + ')' }">
      <p class="tag-left">“</p>
      <p class="text" v-if="sentence?.text">{{ sentence?.text }}</p>
      <p class="tag-right">”</p>
      <p class="source" v-if="sentence?.source && sentence.source"><span>{{ sentence?.source }}</span></p>

    </div>
    <!-- 导航栏   -->
    <div class="classify-list">
      <div class="item-list">
        <div class="item" v-for="item in classifyList" :key="item" @click="handleClassifyChange(item)">
          <van-image fit="cover" :src="item?.iconImg"> </van-image>
          <div class="name" :class="{ 'activity': activeClassifyId == item.id }">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <CardList :mindfulnessList="mindfulnessList" @clickItem="handleDetailItem" />
    <!-- <AudioPlayer> </AudioPlayer> -->
  </div>
</template>

<script>

import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import CardList from "./components/CardList";
import { info, getListByClassify } from "@/api/mindfulness";
import iconAll from "@/assets/images/icon/mindfulness-icon-all.png";
import iconEmotion from "@/assets/images/icon/mindfulness-icon-emotion.png";
import iconGrow from "@/assets/images/icon/mindfulness-icon-grow.png";
import iconMeditation from "@/assets/images/icon/mindfulness-icon-meditation.png";
import iconRelax from "@/assets/images/icon/mindfulness-icon-relax.png";
import iconSleep from "@/assets/images/icon/mindfulness-icon-sleep.png";

// import AudioPlayer from "./components/AudioPlayer/index.vue";
export default {
  name: "mindfulnessIndex",
  components: {
    CardList,
    // AudioPlayer,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      sentence: {},
      mindfulnessList: [],
      activeClassifyId: 0,
      classifyList:[],
    });
    

    onMounted(() => {
      init();
    });
    // 初始化首页数据
    async function init() {
      try {
        const { sentence, list, classifyList } = await info();
        state.sentence = sentence;
        state.mindfulnessList = list;
        state.classifyList = classifyList;
      } catch (error) {
      }
    }
    // 课程详情
    function handleDetailItem({ id }) {
      router.push({
        path: "/mindfulness/detail",
        query: {
          mindfulnessId: id,
        },
      });
    }

    // 切换分类
    async function handleClassifyChange(item) {
      if (this.activeClassifyId == item.id) {
        return false;
      }
      state.mindfulnessList = [];
      this.activeClassifyId = item.id
      try {
        const { list } = await getListByClassify({
          mindfulnessClassifyId: this.activeClassifyId,
        });
        state.mindfulnessList = list;
      } catch (error) {
      }
    }
    return {
      ...toRefs(state),
      handleDetailItem,
      handleClassifyChange,
    };
  },
};
</script>

<style lang="less" scoped>
.mindfulness-index-warper {
  width: 100%;
  position: relative;

  .top-warper {
    width: 100%;
    // height: 220px;
    height: 160px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding: 10px 10px 0px 10px;
    // display: flex;

    // flex-direction: column;
    // justify-content: center;
    .text {
      padding: 0 10px;
      font-size: 14px;
      color: #fff;
      font-weight: 100 !important;
      line-height: 1.5 !important;
      text-align: left;
      font-style: italic !important;
      letter-spacing: 3px;
    }

    .tag-left,
    .tag-right {
      font-size: 24px;
      color: #fff;
    }

    .tag-right {
      text-align: right;
    }


    position: relative;

    .source {
      font-size: 15px;
      color: #fff;
      font-weight: 0 !important;
      font-style: italic;
      text-align: right;
      font-style: italic !important;
      letter-spacing: 3px;
      position: absolute;
      right: 10px;
      bottom: 10px;

      span {
        position: relative;
        padding-left: 5px;

        &:before {
          content: '';
          display: block;
          height: 1px;
          width: 35px;
          background-color: #fff;
          position: absolute;
          left: 0px;
          top: 8px;
          transform: translateX(-100%);
        }
      }

    }
  }

  .classify-list {
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
}
</style>