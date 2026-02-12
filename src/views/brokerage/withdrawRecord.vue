<template>
  <div class="withdraw-record" v-if="dataList.length > 0">
    <div
      class="item"
      v-for="item in dataList"
      :key="item"
      @click="handleItem(item)"
    >
      <div class="left">
        <p class="text">提现金额</p>
        <p>{{ item.amount }}元</p>
      </div>
      <div class="center">
        <p class="text">提现时间</p>
        <p>{{ $filters.formatDate(item.createTime, "yyyy/MM/dd") }}</p>
      </div>
      <div class="right">
        <p class="text">状态</p>
        <p>{{ statusMap[item?.status] }}</p>
      </div>
    </div>
  </div>
  <div class="no-data" v-else>
    <img src="@/assets/images/collect-bg.png" />
    <p>暂无提现记录</p>
  </div>
  <div class="footer">
    <div class="button" @click="$router.go(-1)">点这里返回上一页</div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { getHomeData, getSentence } from "@/api/app";
import { getGiveList } from "@/api/give";
import { withdrawList } from "@/api/brokerage";
export default {
  name: "withdrawRecord",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      dataList: [],
      statusMap: ["审核中", "审核中", "待审核", "审核中", "已审核", "已到账"],
    });

    onMounted(() => init());
    // 初始化首页数据
    async function init() {
      const { list } = await withdrawList(state.query);
      state.dataList = [...list];
    }
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.no-data {
  height: 100% !important;
  position: relative;
  text-align: center;

  img {
    margin-top: 40%;
    width: 50%;
    height: auto;
  }

  p {
    text-align: center;
    color: @gray-color;
    font-size: @font-size-base;
  }
}

.withdraw-record {
  width: 100%;
  padding: 20px 20px 60px 20px;
  position: relative;
  min-height: 100vh;
  background: #f0f0f0;

  .item {
    padding: 10px 0;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 100%;
    height: 60px;
    background-color: #fff;

    box-shadow: 0px 0px 2px #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    .text {
      color: @gray-color;
      font-size: @font-size-sm;
      margin-bottom: 5px;
    }

    .left,
    .center,
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex-direction: column;
    }

    // left部分样式
    .left {
      height: 100%;
      font-size: 20px;
      color: red;
      width: 25%;
      border-right: 1px dashed gainsboro;
      position: relative;

      &:before,
      &::after {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f0f0f0;
        position: absolute;
        right: -5px;
      }

      &:before {
        top: -15px;
      }

      &::after {
        bottom: -15px;
      }
    }

    // center部分样式
    .center {
      height: 100%;
      flex: 1;

      border-right: 1px dashed gainsboro;
      position: relative;

      &:before,
      &::after {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f0f0f0;
        position: absolute;
        right: -5px;
      }

      &:before {
        top: -15px;
      }

      &::after {
        bottom: -15px;
      }
      .outBillNo {
        margin-top: 10px;
        font-size: 12px;
      }
    }

    // right部分样式
    .right {
      height: 100%;
      width: 20%;
    }
  }
}

.footer {
  .fixed-bottom();
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px !important;
  background-color: transparent;

  .button {
    font-size: 18px;
    color: #fff;
    background-color: @theme-color;
    width: 90%;
    border-radius: 50px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>