<template>
  <div class="content">
    <div class="tabs">
      <van-tabs
        v-model:active="query.type"
        background="transparent"
        title-active-color="#FF89A0"
        color="#FF89A0"
        @change="reload"
      >
        <van-tab
          :title="`${item.name} ${item.num}`"
          :name="item.type"
          v-for="item in typeList"
          :key="item.type"
        >
        </van-tab>
      </van-tabs>
    </div>

    <div class="list">
      <div class="item" v-for="item in couponList" :key="item.id">
        <CouponItem
          :item="item"
          buttonText="使用"
          @clickButton="handleUseCoupon(item)"
        />
      </div>

      <div class="bottom">
        <van-loading v-show="loading" size="18px">加载中...</van-loading>
        <div class="none" v-show="nomore">没有更多数据了</div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuth } from "@/hooks/useAuth";
import { getUserCouponList, receive } from "@/api/coupon";
import { useScrollBottom } from "@/hooks/useScroll";
import CouponItem from "@/components/CouponItem";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { Toast } from "vant";
const router = useRouter();
const typeList = ref([
  {
    type: 0,
    name: "所有",
    num: 0,
  },
  {
    type: 1,
    name: "现金券",
    num: 0,
  },
  {
    type: 2,
    name: "赠送券",
    num: 0,
  },
  {
    type: 3,
    name: "折扣券",
    num: 0,
  },
  {
    id: 4,
    name: "VIP折扣券",
    num: 0,
  },
]);
const couponList = ref([]);
const nomore = ref(false);
const loading = ref(false);
const query = reactive({
  pageNum: 1,
  pageLimit: 10,
  type: 0,
  receiveStatus: 0, // 领取状态
});
const route = useRoute();

const store = useStore();
const { couponCode } = route.query;
function reload() {
  query.pageNum = 1;
  nomore.value = false;
  couponList.value = [];
  init();
}
// 优惠券使用
function handleUseCoupon({ id, type, targetInfos, forVip }) {
  const targetNum = targetInfos.length;
  switch (type) {
    case 1: // 现金抵扣券- vip
      if (forVip === 1) {
        // vip 现金抵扣券
        router.push({
          // VIP折扣券跳转会员开通
          path: "/vipOpened",
          query: { couponId: id },
        });
      } else {
        // 现金抵扣券- 测评
        if (targetNum == 1) {
          // 指定了一个, 跳转到指定测评页
          router.push({
            path: "/detail",
            query: {
              testPaperId: targetInfos[0].id,
              couponId: id,
            },
          });
        } else {
          // 指定多个测评，挑战到优惠券使用页面
          router.push({
            path: "/coupon/couponUse",
            query: { couponId: id },
          });
        }
      }
      break;
    case 2: // 测评赠送券
      if (targetNum == 1) {
        // 指定单个测评，跳转测评详情页
        router.push({
          path: "/detail",
          query: {
            testPaperId: targetInfos[0].id,
            couponId: id,
          },
        });
      } else {
        // 指定多个测评，挑战到优惠券使用页面
        router.push({
          path: "/coupon/couponUse",
          query: { couponId: id },
        });
      }
      break;
    case 3: // 测评折扣券
      if (targetNum == 1) {
        // 指定单个测评，跳转测评详情页
        router.push({
          path: "/detail",
          query: {
            testPaperId: targetInfos[0].id,
            couponId: id,
          },
        });
      } else {
        // 指定多个测评，挑战到优惠券使用页面
        router.push({
          path: "/coupon/couponUse",
          query: { couponId: id },
        });
      }
      break;
    case 4: // vip 折扣券
      // VIP折扣券跳转会员开通
      router.push({
        path: "/vipOpened",
        query: { couponId: id },
      });
      break;
    default:
      break;
  }
}
onMounted(async () => {
  if (store.getters.token) {
    receiveCoupon();
    store.dispatch("user/getUserInfo");
  } else {
    const { code } = route.query;
    if (code) {
      try {
        await store.dispatch("user/login", { code });
        // 登录完毕清除微信回调过来的code和state
        window.history.replaceState(
          null,
          null,
          `${window.location.origin}/user`
        );
      } catch (error) {
        // 登录失败 回退上一页
        Toast("登录失败，请重新登录user/login");
        // setTimeout(() => {
        //   router.go(-1);
        // }, 1000);
      }
      // 登录完成 没有用户信息  获取用户信息
      if (!store.getters.hasUserInfo && store.getters.token) {
        store.dispatch("user/getUserInfo");
      }
    }
  }
});
async function receiveCoupon() {
  if (couponCode && query.receiveStatus == 0) {
    const { receiveStatus } = await receive({ couponCode: couponCode });
    query.receiveStatus = receiveStatus;

    if (query.receiveStatus == 1) {
      // 领取成功
      Toast("领取成功");
      // 刷新页面
      window.location.reload();
    }
  }
}
async function init() {
  if (nomore.value) return;
  try {
    loading.value = true;
    const { list, typeNumList } = await getUserCouponList(query);
    typeNumList.map((typeItem) => {
      typeList.value.map((item) => {
        if (typeItem.type == item.type) {
          item.num = typeItem.num;
        }
      });
    });
    if (!list.length) {
      nomore.value = true;
    }
    couponList.value = [...couponList.value, ...list];
  } finally {
    loading.value = false;
  }
}
//滚动事件
useScrollBottom(() => {
  if (nomore.value) return;
  query.pageNum++;
  init();
}, 100);
// 授权钩子
useAuth(
  {
    authType: 2,
  },
  () => init()
);
</script>
  <style lang="less" scoped>
.content {
  padding-top: 44px;
  .tabs {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 44px;
    z-index: 99;
    background-color: #fafafa;
  }
  .list {
    padding: 20px;

    .bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: @padding-sm 0;

      .none {
        color: #969799;
        font-size: @font-size-base;
      }
    }

    .item {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>