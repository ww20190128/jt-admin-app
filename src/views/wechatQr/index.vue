<template>
  <div class="app-container">
    <h1 class="title">
      <i class="icon fa fa-volume-up"></i> 关注公众号
    </h1>

    <div class="content">
      <div class="top">
        <div class="desc">
          关注公众号后，可<span>免费</span>测试多款专业测评产品及学习心理课程。
        </div>
        <div class="desc1">
          若您已购买报告，请务必关注公众号，随时查看您的结果。
        </div>
        <div class="name">公众号名称：{{ wechatInfo?.name }}</div>
        <div class="copy" @click="clipboard(wechatInfo?.name, $event)">
          点击复制公众号名称
        </div>

        <div class="qrcode-warper">
          <img :src="wechatInfo?.wechat_qrcode" />
        </div>
        <p class="info">截图保存二维码，进入微信扫一扫</p>
      </div>
      <!-- <van-button
        color="#ff5d7d"
        round
        block
        @click="handleBack"
        class="back-button"
        >返回继续支付</van-button
      > -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "@/store";
import clipboard from "@/utils/clipboard";
import { checkTestOrderPay } from "@/api/order";
import { loadingToast } from "@/plugins/vant";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useStore();
const wechatInfo = computed(() => store.getters.wechatInfo || {});

const { testOrderId, testPaperId, promotionId } = route.query;

const isStop = ref(true);
// 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
//  window.addEventListener('hashchange', () => {
//     let currentPath = window.location.hash.slice(1)
//     console.log('%c [ currentPath ]-55', 'font-size:13px; background:pink; color:#bf2c9f;', currentPath)
//     // if (route.path !== currentPath) {
//     //   router.push(currentPath)
//     // }
//   }, false)
onBeforeRouteLeave((to, from, next) => {
  if (isStop.value && (testPaperId || promotionId)) {
    isStop.value = false;
    // 获取当前历史记录栈中的上一级历史记录  
    window.history.go(-1);

    // const history = window.history.length
    // window.history.go(-history)

    // router.push({
    //   path: "/detail", query: { testPaperId, promotionId } 
    // })
  } else {
    next();
  }
});

async function handleBack() {
  const loading = loadingToast("返回中...");
  isStop.value = false;
  try {
    const { needPay } = await checkTestOrderPay({
      testOrderId: testOrderId,
    });
    if (needPay !== 1) {
      router.replace({
        path: "/report",
        query: {
          testOrderId,
          testPaperId,
          promotionId,
        },
      });
    } else {
      router.replace({
        path: "/pay",
        query: { ...route.query, animation: "0" },
      });
    }
  } catch (err) {
    router.back();
  } finally {
    loading.clear();
  }
}

</script>

<style lang="less">
.app-container {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .title {
    color: @theme-color;
    font-size: 20px;
    height: 70px;
    line-height: 60px;
    text-align: center;
    padding-top: 10px;
  }

  .content {
    background-color: #edeaed;
    height: calc(100vh - 90px);
    margin: 0 15px 15px 15px;
    text-align: center;
    padding: 50px 10px 0 10px;
    box-shadow: 0px 6px 6px 0 rgba(0, 0, 0, 0.2);
    border-radius: 10px;

    .top {
      padding-bottom: 16px;
    }

    .back-button {
      width: 200px;
      margin: 0 auto;
    }

    .desc {
      color: @light-black;
      font-size: 16px;
      padding-bottom: 20px;
      line-height: 28px;
      text-align: left;
      margin: 0 20px;

      span {
        color: red;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .desc1 {
      color: red;
      font-size: 16px;
      padding-bottom: 20px;
      line-height: 28px;
      text-align: left;
      margin: 0 20px;
    }

    .name {
      font-weight: 600;
      font-size: 18px;
      color: @light-black;
      padding: 10px 0;
    }

    .copy {
      width: 140px;
      color: #fff;
      background-color: @theme-color;
      border-radius: 5px;
      text-align: center;
      font-size: 12px;
      margin: 0 auto;
      line-height: 21px;
      padding: 5px;
    }

    .info {
      text-align: center;
      font-size: 14px;
    }

    .qrcode-warper {
      width: 150px;
      margin: 10px auto 5px;
      img {
        width: 100%;
        pointer-events: auto;
      }
    }
  }
}
</style>
