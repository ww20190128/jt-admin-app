<script setup>
import { computed } from "vue";
import ContentWrapper from "../ContentWrapper";
import RadarChart from "./RadarChart";

const props = defineProps({
  data: {
    type: Object,
  },
});
const childWeiduList = computed(() => props.data?.childWeiduList);
const dataList = computed(() =>
  childWeiduList.value
    .sort((a, b) => b.last_percent - a.last_percent)
    .slice(0, 5)
);

const radarChartData = computed(() =>
  dataList.value.map((item) => ({
    name: item.weidu_name,
    value: parseInt(item.last_percent),
  }))
);
const CN_NUMBERS = ["一", "二", "三", "四", "五"];
</script>

<template>
  <ContentWrapper title="您最突出的五大优势才干" enTitle="Your five most outstanding strengths and abilities">
    <div class="wrapper">
      <div class="chart">
        <RadarChart :data="radarChartData" />
        <div class="card-bg">
          {{ data.setting?.cgjs }}
        </div>
      </div>
      <div class="content" v-for="(item, index) in dataList" :key="index">
        <!-- 标题 -->
        <div class="title-warper">
          <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-left" />
          <div class="text-warper">
            <span class="tag">第{{ CN_NUMBERS[index] }}优势</span>
            <span class="name" :style="{
              backgroundColor: item.p_extend?.weidu_color,
            }">{{ item.weidu_name }}</span>
          </div>
          <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-right" />
        </div>
        <div class="rank" v-if="false">
          <div class="left">
            <div class="item" v-for="(child, index) in childWeiduList.slice(0, 10)" :key="index" :style="{
              backgroundColor:
                item.score_sort === child.score_sort ? item.p_extend?.weidu_color : '#c9c7ca',
            }"></div>
          </div>
          <div class="right">
            <div class="item" v-for="(child, index) in childWeiduList.slice(10, 34)" :key="index" :style="{
              backgroundColor:
                item.score_sort === child.score_sort ? item.p_extend?.weidu_color : '#c9c7ca',
            }"></div>
          </div>
          <div class="tag" :style="{
            backgroundColor: item.p_extend?.weidu_color,
          }">
            {{ item.weidu_name }}
          </div>
        </div>
        <div class="content-item" v-html="item.extend?.content1"></div>
      </div>
    </div>
  </ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {
  color: #333;

  .chart {
    font-size: 14px;
  }

  .content {

    // 标题
    .title-warper {

      color: #4e48e6;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 0;

      .text-warper {
        position: relative;
        border: 1px solid #ff9e57;
        padding: 2px 15px 18px 15px;
        margin: 0 5px;
        border-radius: 10px;

        .tag {
          font-size: 22px;
        }

        .name {
          color: #fff;
          // background-color: #fff;

          border-radius: 50%;
          font-size: 16px;
          line-height: 40px;
          // height: 23px;
          height: 40px;
          width: 40px;
          text-align: center;
          position: absolute;
          // border: 1px solid #ff9e57;
          left: 50%;
          bottom: 0px;
          transform: translateY(50%) translateX(-50%);
        }
      }

      .arrow {
        width: 80px;
        &.arrow-right {
          transform: rotate(-180deg);
        }
      }
    }


    .rank {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 40px;

      .tag {
        height: 20px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        position: absolute;
        left: 15px;
        bottom: -8px;

        border-radius: 4px;
        color: #fff;
        transform: translateY(100%);
      }

      .left,
      .right {
        display: flex;
        justify-content: space-between;
        background-color: #f6f4f7;
        padding: 3px;
        border-radius: 4px;

        .item {
          width: 6px;
          height: 32px;
          border-radius: 6px;
        }
      }

      .left {
        width: 108px;
        margin: 0 12px;
      }

      .right {
        width: 227px;
        margin: 0 12px;
      }
    }

    :deep(.content-item) {
      font-size: 14px;
      padding: 10px;

      h4 {
        font-size: 16px;
        font-weight: bold;
        border-left: 5px solid #ff9e57;
        line-height: 20px;
        padding-left: 6px;
        margin-bottom: 10px;
      }

      &>p {
        padding: 8px 0;
        line-height: 24px;
      }

      &>ul {
        li {
          list-style: none;
          padding: 8px 0;
          line-height: 24px;
          text-indent: 10px;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 20px;
            transform: translateY(-50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #ff9e57;
          }
        }
      }
    }

    &:not(:last-child) {
      .content-item {

        

        // width: 17.06667rem;
        // margin: .3rem -.5rem;
        // height: .4rem;
        // background: #E4F0FF;
        position: relative;
        padding-bottom: 50px;
        &::after {
          content: "";
          position: absolute;
          left: 10px;
          bottom: 0;
          height: .4rem;
          margin: .3rem -.5rem;
          background: #E4F0FF;
          width: calc(100% + 20px);
        }
      }
    }
  }
}
</style>
