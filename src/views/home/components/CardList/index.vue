<template>
  <div class="card-list">
    <div
      class="item"
      v-for="item in data"
      :key="item.id"
      @click="handleItem(item)"
    >
      <div class="test-img-warper">
        <van-image
          :src="item.mainImg"
        >
        </van-image>
        <img v-if="tagImg" class="tag" :src="tagImg"></img>
      </div>
      <div class="title">{{ item.name }}</div>
      <div class="bottom">
        <div class="text">
          <!-- <i class="icon fa fa-heart"></i> -->
          {{item.saleNum}}人测过
        </div>
        <div class="go-button">立即测试</div>
      </div>
    </div>
  </div>
</template>
<!-- 首页卡片 -->
<script>
import { useRouter } from "vue-router";

export default {
  name: "CardList",
  props: {
    data: {
      type: Array,
      default: () => ({}),
    },
    tagImg: {
      type: String,
      default: "",
    },
  },
  setup() {
    const router = useRouter();
    function handleItem({ id }) {
      router.push({
        path: "/detail",
        query: {
          testPaperId:id,
        },
      });
    }
    return {
      handleItem
    };
  },
};
</script>

<style lang="less" scoped>
.van-icon {
  font-size: 20px;
  img {
    width: 20px;
    height: 20px;
  }
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 48%;
    .pointer();
    &:nth-child(2n + 1) {
      margin-right: 4%;
    }
    margin-bottom: @padding-base;
    .test-img-warper {
      position: relative;
      width: 100%;
      min-height: 80px;
   
      .van-image {
        width: 100%;
        min-height: 80px;
        height: auto;
        :deep(img) {
          border-radius: 5px;
        }
      }
      .tag {
        position: absolute;
        right: -10px;
        top: -5px;
        width: 40px;
        height: auto;
      }
    }
    .title {
      text-align: left;
      font-weight: bold;
      font-size: @font-size-base;
      height: 25px;
      line-height: 25px;
      .ellipsis();
    }
    .bottom {
      .space-between();
      height: 22px;
      line-height: 22px;
      .text {
        color: @gray-color;
        flex: 1;
        font-size: @font-size-sm !important;
        .icon {
          color: @theme-color;
        }
      }
      .go-button {
        text-align: center;
        // padding: 0 @padding-sm;
        color: #fff;
        font-size: @font-size-sm !important;
        background-color: @theme-color;
        border-radius: 15px;
        width: 70px;
      }
    }
  }
}
</style>