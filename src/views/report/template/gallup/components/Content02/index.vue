<script setup>
import ContentWrapper from "../ContentWrapper";
import { px2number } from "@/utils/rem";
import { computed, nextTick, onMounted, ref } from "vue";
import * as echarts from "echarts";
const props = defineProps({
  data: {
    type: Object,
  },
});
const duoweiduList = computed(() => props.data?.duoweiduList);

const max = computed(() => {
  const [item] = duoweiduList.value.sort(
    (a, b) => b.weidu_percent - a.weidu_percent
  );
  return item;
});

const chartRef = ref();
function setOptions() {
  const data = duoweiduList.value.map((item) => ({
    value: item.weidu_percent,
    name: item.weidu_name,
    itemStyle: {
      color: item.extend?.weidu_color,
    },
    label: {
      textStyle: {
        color: item.extend?.weidu_color,
        fontSize: px2number(12),
      },
    },
  }));

  const option = {
    tooltip: {
      trigger: "item",
    },

    series: [
      {
        type: "pie",
        radius: ["80%", "130%"],
        center: ["50%", "100%"],
        // adjust the start angle
        startAngle: 180,

        data: [
          ...data,
          {

            value: data.reduce((pre, cur) => +pre + +cur.value, 0),
            itemStyle: {
              color: "none",
              decal: {
                symbol: "none",
              },
            },
            label: {
              show: false,
            },
          },
        ],
      },
    ],
  };
  const chart = echarts.init(chartRef.value);
  chart.setOption(option);
}
onMounted(() => {
  nextTick(() => setOptions());
});

function hex2rgba(hex, opacity = 1) {
  return `rgba(${[
    parseInt(`0x${hex.slice(1, 3)}`),
    parseInt(`0x${hex.slice(3, 5)}`),
    parseInt(`0x${hex.slice(5, 7)}`),
    opacity,
  ].join(",")})`;
}
</script>

<template>
  <ContentWrapper title="您的四大优势占比">
    <div class="wrapper">
      <div class="head-desc">
        <p>你的<span :style="{
          color: max.extend?.weidu_color,
        }">{{ max.weidu_name }}</span>优势最为突出</p>
      </div>
      <div class="content">
        <van-row :gutter="px2number(10)">
          <van-col span="12" v-for="(item, index) in duoweiduList" :key="index">
            <div class="item" :style="{
              background: `linear-gradient(to top,${item.extend?.weidu_color
                },${hex2rgba(item.extend?.weidu_color, 0.5)})`,
            }">
              <div class="title-warp">
                <span class="name">{{ item.weidu_name }}</span>
                <span class="percent">{{ Math.round(item.weidu_percent) }}%</span>
              </div>
              <div class="desc-warp" v-html="item.jianjie"></div>
              <img :src="item.extend?.weidu_icon" />
            </div>
          </van-col>
        </van-row>
      </div>


    </div>
  </ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {
  .head-desc {
    text-align: center;
    p {
      font-size: 16px !important;
      span {
        font-weight: 500;
        font-size: 18px !important;
      }
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    .item {
      margin-bottom: 10px;
      background-size: 100% 100%;
      color: #fff;
      border-radius: 5px;
      position: relative;

      .title-warp {
        height: 40px;
        font-size: 16px;
        padding: 5px 0 0 5px;

        .name {
          font-weight: 500;
          font-size: 18px;
        }

        .percent {
          padding-left: 5px;
          font-size: 23px;
          font-weight: 200;
        }
      }

      .desc-warp {
        z-index: 9999;
        border-radius: 10px;
        margin-top: 10px;
        padding: 5px;
        height: 64px;
        margin-top: 5px;
        line-height: 18px;
        // background-color: rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: flex-end;

        span {
          font-weight: 200;
          font-size: 14px;
        }
      }

      img {
        width: auto;
        height: 35px;
        position: absolute;
        right: 5px;
        top: 5px;
        // transform: translateY(-50%);
      }
    }
  }

}
</style>
