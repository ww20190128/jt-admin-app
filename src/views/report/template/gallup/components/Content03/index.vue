<script setup>
import ContentWrapper from "../ContentWrapper";
import { px2number } from "@/utils/rem";
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
});
const duoweiduList = computed(() => props.data?.duoweiduList);
</script>

<template>
  <ContentWrapper title="您的优势才干得分" enTitle="Your talent distribution">
    <div class="wrapper">
      <div class="card-bg">
        <p>
          盖洛普优势测试在影响力、战略思维、执行力和关系建立四维度上进行评估。以下为各维度的才干得分。
        </p>
      </div>
      <div class="content">
        <van-row :gutter="px2number(10)">
          <van-col
            span="12"
            v-for="(item, index) in duoweiduList"
            :key="index"
            class="item-wrapper"
          >
            <div class="item">
              <div
                class="name"
                :style="{
                  borderColor: item.extend?.weidu_color,
                }"
              >
                {{ item.weidu_name }}<p>（满分100分）</p>
              </div>
              <div class="card-list">
                <van-row :gutter="px2number(6)">
                  <van-col v-for="child in item.childList" span="12">
                    <div
                      class="card-item"
                      :style="{
                        backgroundColor:
                          child.score_sort <= 10
                            ? item.extend?.weidu_color
                            : child.extend?.weidu_color,
                        color: child.score_sort <= 10 ? '#fff' : '#333',
                      }"
                    >
                      <div class="card-value">{{ child.score_sort }}</div>
                      <div class="card-name">{{ child.weidu_name }}</div>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {
  padding: 10px 10px 0 10px;
  .content {
    display: flex;
    flex-wrap: wrap;
    color: #333;

    .item {
      width: 100%;
      margin-bottom: 10px;
      background-size: 100% 100%;
      .name {
        border-radius: 4px;
        background-color: #f3f3f3;
        font-size: 16px;
        color: #333;
        height: 40px;
       
        text-align: center;
        margin-bottom: 6px;
        border-bottom: 4px solid;
        p {
          line-height: 15px;
          font-size: 12px;
          color: @gray-color;
        }
      }
      .card-list {
        .card-item {
          height: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          font-size: 14px;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
