<script setup>
import { computed } from "vue";
import ContentWrapper from "../ContentWrapper";

const props = defineProps({
  data: {
    type: Object,
  },
});
const childWeiduList = computed(() => props.data?.childWeiduList);


</script>

<template>
  <ContentWrapper title="您的盖洛普才干排名" enTitle="">
    <div class="wrapper">
      <div class="card-bg">
        <p>
          盖洛普优势测试识别您的34项才干，助您深入了解自身优势，提升认知，在工作和生活中取得卓越成就。以下是您的各项才干排名：
        </p>
      </div>

      <div class="rank-header">
        <div class="left">
          <div class="item" v-for="(item, index) in childWeiduList.slice(0, 10)" :key="index"
            :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
        </div>
        <div class="right">
          <div class="item" v-for="(item, index) in childWeiduList.slice(10, 34)" :key="index"
            :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
        </div>
      </div>
      <div class="rank-value">
        <div class="left">

          <div class="title">前十名才干</div>
          <div class="columns">
            <div class="column">
              <div class="item" v-for="(item, index) in childWeiduList.slice(0, 10)" :key="index">
                <div class="tag" :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
                <div class="index">{{ item.score_sort }}.</div>
                <div class="text">{{ item.weidu_name }}</div>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div class="right">
          <div class="title">其他才干</div>
          <div class="columns">
            <div class="column">
              <div class="item" v-for="(item, index) in childWeiduList.slice(10, 20)" :key="index">
                <div class="tag" :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
                <div class="index">{{ item.score_sort }}.</div>
                <div class="text">{{ item.weidu_name }}</div>
              </div>
            </div>
            <div class="column">
              <div class="item" v-for="(item, index) in childWeiduList.slice(20, 30)" :key="index">
                <div class="tag" :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
                <div class="index">{{ item.score_sort }}.</div>
                <div class="text">{{ item.weidu_name }}</div>
              </div>
            </div>
            <div class="column">
              <div class="item" v-for="(item, index) in childWeiduList.slice(30, 34)" :key="index">
                <div class="tag" :style="{ backgroundColor: item.p_extend?.weidu_color }"></div>
                <div class="index">{{ item.score_sort }}.</div>
                <div class="text">{{ item.weidu_name }}</div>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {
  margin-bottom: 10px;
  color: #333;

  .rank-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 35px;
    background-image: url("~@/assets/images/gallup/rhombus-bg.png");
    background-size: 100% 100%;

    .left,
    .right {
      display: flex;
      justify-content: space-between;
      padding: 3px;
      border-radius: 4px;

      .item {
        width: 4px;
        height: 25px;
        border-radius: 2px;
      }
    }

    .left {
      width: 108px;
      padding-left: 12px;
    }

    .right {
      margin-left: 10px;
      width: 227px;
      padding-left: 12px;
    }
  }

  .rank-value {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;

    .left {
      width: 82px;
      background: url("~@/assets/images/gallup/arrow-bg.png");
      background-size: 100% 100%;
    }

    .right {
      width: 246px;
      background: url("~@/assets/images/gallup/arrow-plus-bg.png");
      background-size: 100% 100%;
    }

    .left,
    .right {
      font-size: 12px;

      border-radius: 6px;
      position: relative;
      flex-shrink: 0;
      padding: 20px 0 0 0;

      .title {
        padding: 6px;
      }

      .columns {
        display: flex;
        justify-content: center;

        .column {
          width: 80px;

          .item {
            display: flex;
            align-items: center;
            line-height: 28px;
            padding: 0 6px;

            .tag {
              flex-shrink: 0;
              width: 4px;
              height: 16px;
              border-radius: 4px;
              background-color: #7a2481;
              margin-right: 6px;
            }

            .index {
              flex-shrink: 0;
              width: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
