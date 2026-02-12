<template>
    <div class="content">
      <CellList
        :data="testPaperList"
        :couponInfo = "couponInfo"
      />
      <div
          class="none"
          v-if="!testPaperList.length"
      >
          暂无测评
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useScrollBottom } from "@/hooks/useScroll";
  import CellList from "./components/CellList";
  import { getListByCouponId } from "@/api/coupon";
  export default {
    name: "couponUse",
    components: {
      CellList,
    },
    setup() {
      const router = useRoute();
      const state = reactive({
        testPaperList: [],
        loading: false,
        noneText: "",
        couponInfo:{},
        query: {
          pageLimit: 20,
          pageNum: 1,
        },
      });
      onMounted(() => {
        const { couponId } = router.query;
        if (couponId) {
          init(couponId);
        }
      });
      async function init(couponId) {
        state.loading = true;
        const { couponInfo, list } = await getListByCouponId({couponId});
        state.couponInfo = couponInfo;
        state.loading = false;
        if (!list.length) {
          state.nomore = true;
          return;
        }
        state.testPaperList = [...state.testPaperList, ...list];
      }
      //滚动事件
      useScrollBottom(() => {
        if (state.nomore) return;
        state.query.pageNum++;
        init();
      }, 100);
      return {
        init,
        ...toRefs(state)
      };
    },
  };
  </script>
  
  <style lang="less" scoped>
  .content {
    padding: 0 @padding-base @padding-base @padding-base;
  }
  .none-result {
    text-align: center;
    padding: @padding-base;
    color: @gray-color;
    font-size: @font-size-base;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: @padding-sm;
    .none {
      color: #969799;
      font-size: @font-size-base;
    }
  }
  </style>