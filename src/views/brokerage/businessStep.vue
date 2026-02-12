<template>
  <div class="business-step-wrap">
    <div class="title-wrap">分享收益操作流程</div>
    <div class="item" v-for="(item, index) in stepList">
      <div class="title">
        <div class="left">第{{ index + 1 }}步</div>
        <div class="right" v-html="item.title"></div>
      </div>
      <div class="content"><img :src="item.desc" /></div>
      <div class="title" v-if="index == 2">
        <div class="left">或</div>
        <div class="right">点击右上角“...”，通过链接分享的方式，将测评分享给好友或发到朋友圈</div>
      </div>
      <div class="content" v-if="index == 2"><img :src="step4" /></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { Toast } from "vant";

import step1 from "@/assets/images/step-picture-1.jpg";
import step2 from "@/assets/images/step-picture-2.jpg";
import step3 from "@/assets/images/step-picture-3.jpg";
import step4 from "@/assets/images/step-picture-4.jpg";
import step5 from "@/assets/images/step-picture-5.jpg";
export default {
  name: "businessStep",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      stepList: [
        {
          title: "在『个人中心』点击“分享得佣金”按钮，进入分享页面",
          desc: step1,
        },

        {
          title: "选择要分享的测评，点“分享得佣金”按钮，生成专属于您的分享海报",
          desc: step2,
        },
        {
          title: "长按海报保存到手机相册，将图片分享给好友或发到朋友圈",
          desc: step3,
        },
        {
          title: "好友测试完成，并付款成功后，在【收益明细】中查看收益到账，点击【提现】按钮申请提现",
          desc: step5,
        },
      ],
    });
    return {
      ...toRefs(state),
      step1,
      step2,
      step3,
      step4,
      step5,
    };
  },
};
</script>
<style lang="less" scoped>
.business-step-wrap {
  padding: 10px 30px 50px 30px;
  
  .title-wrap {
    text-align: center;
    font-size: 18px;
    color: rgb(243, 45, 88);
  }
  .item {
    .title {
      margin-top: 20px;
      margin-bottom: 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: flex-start;
      .left {
        line-height: 25px;
        font-size: 16px;
        color: rgb(243, 45, 88);
        font-weight: bold;
        margin-right: 10px;
      }
      .right {
        flex: 1;
        color: @light-black;
        line-height: 25px;
      }
    }
    .content {
      width: 100%;
      height: auto;
    }
  }
}
</style>
