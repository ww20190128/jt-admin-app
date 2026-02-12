<template>
  <div class="business-wrap">
    <div
      class="header-wrap"
      :style="{ backgroundImage: `url(${topBgImg})` }"
    ></div>
    <div class="introduce-wrap">
      <p class="desc">无论您是想边带娃边赚钱的<span class="tag">宝妈</span></p>
      <p class="desc">还是缺生活费 想找兼职的<span class="tag">大学生</span></p>
      <p class="desc">或者想边上班 边赚外快的<span class="tag">上班族</span></p>
      <p class="desc">...</p>
      <p class="desc">只要您有手机就可以参与我们的分享活动</p>
      <p
        class="skip attention-button animation-button"
        @click="handleBrokerage"
      >
        点击进入分享中心，开始分享
      </p>
      <p class="desc">无需注册，不需要押金，直接分享即可获得现金收益</p>
    </div>
    <div class="customer-wrap" v-if="appConfig?.customerServiceQR">
      <p class="desc">请先长按二维码 扫描添加客服，了解活动详情</p>
      <div class="qr">
        <!-- <img :src="appConfig?.customerServiceQR" />       :logoSrc="customerServiceImg"-->
        <VueQr
          class="code-img"
          :text="appConfig?.customerServiceLink"
          :size="500"
          :logoSrc="customerServiceImg"
          :color-dark="black"
        />
      </div>
      <!-- 跳转到一个链接 -->

      <p class="customer-service" v-if="appConfig?.customerServiceLink">
        <a :href="appConfig?.customerServiceLink" target="_blank" class="link">
          找客服聊一聊
        </a>
      </p>
    </div>
    <!-- 操作步骤 -->
    <div class="title-wrap">操作步骤</div>
    <div class="content-wrap">
      <div class="operation-wrap">
        <div class="operation-item">
          <div class="left">
            <span>1</span>
          </div>
          <!-- <van-image class="func-icon" :src="serveBrokerage"></van-image
            > -->
          <div class="right">
            在『个人中心』点击
            <van-image class="func-icon" :src="serveBrokerage"></van-image>
            “分享得佣金”按钮，进入分享页面。
          </div>
        </div>

        <div class="operation-item">
          <div class="left">
            <span>2</span>
          </div>
          <div class="right">
            选择需要分享的测评，点“分享得佣金”按钮，分享给好友或发朋友圈。
          </div>
        </div>
        <div class="operation-item">
          <div class="left">
            <span>3</span>
          </div>
          <div class="right">
            朋友通过您的分享链接进入测试页面，完成测试，您即可获得现金收益。
          </div>
        </div>
      </div>
      <div class="report-tag-red share"><span>链接分享方法</span></div>
      <div class="share-desc">点击右上角“...” 转发分享给好友或发到朋友圈</div>

      <div class="report-tag-blue"><span>海报分享方法</span></div>
      <div class="share-desc">
        长按保存海报到手机相册，将图片分享给好友或发到朋友圈
      </div>

      <div class="report-tag-gray"><span>二维码分享法</span></div>
      <div class="share-desc line">
        申请成为合作商（参考下面【商务合作】介绍）
      </div>
      <div class="share-desc line">
        使用分销合作后台，生成专属于您的推广二维码
      </div>
      <div class="share-desc line">将推广二维码放入您的公众号文章</div>
      <div class="operation-button-wrap" @click="handleStep">
        点击查看分享步骤图解
      </div>
    </div>

    <div class="title-wrap">收益提现</div>
    <div class="content-wrap">
      <div class="desc-line">
        <img class="icon" src="@/assets/images/index-blue.png" />
        好友测试完成，并付款成功后，可在【收益明细】中查看收益到账信息。
      </div>
      <div class="desc-line">
        <img class="icon" src="@/assets/images/index-red.png" />
        点击【提现】按钮，系统在24小时内完成审核，审核完成后自动转账到您的微信-零钱。
      </div>
    </div>
    <div class="title-wrap">商务合作</div>

    <div class="content-wrap">
      <div class="desc-line">
        <img
          class="icon"
          src="@/assets/images/remind.png"
        />拥有自媒体或自有流量，需要商业合作，请填写
      </div>
      <div class="apply-wrap">
        <div class="head">合作登记</div>
        <!-- 手机号栏 只允许输入手机号 -->
        <div class="from-wrap">
          <div class="input-item">
            <van-field
              v-model="applyFrom.phone"
              rows="1"
              autosize
              type="tel"
              placeholder="手机号"
              maxlength="11"
              :rules="[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.weChat"
              rows="1"
              autosize
              type="textarea"
              placeholder="微信（选填）"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.nickname"
              rows="1"
              autosize
              type="textarea"
              placeholder="姓名（选填）"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.accounts"
              rows="1"
              autosize
              type="textarea"
              placeholder="公众号/抖音号/微博号等（选填）"
            />
          </div>
        </div>
        <div
          class="button"
          :class="{ 'show-submit': applyFrom.phone || applyFrom.weChat }"
          @click="handleSubmit"
        >
          提交
        </div>
      </div>
      <div class="desc-line">
        <!-- ：{{
          appConfig?.customerServiceWechat
        }} -->
        <img
          class="icon"
          src="@/assets/images/remind.png"
        />请添加客服微信，沟通详情。
      </div>
      <div class="qr">
        <VueQr
          class="code-img"
          :text="appConfig?.customerServiceLink"
          :size="500"
          :logoSrc="customerServiceImg"
          :color-dark="black"
        />
      </div>
      <p class="customer-service" v-if="appConfig?.customerServiceLink">
        <a :href="appConfig?.customerServiceLink" target="_blank" class="link">
          立即聊一聊
        </a>
      </p>
    </div>
    <div class="title-wrap">常见问题</div>
    <div class="content-wrap query-list-wrap">
      <div
        class="item"
        v-for="(item, index) in queryList"
        @click="item.show = !item.show"
      >
        <div class="title">
          <div class="left">
            {{ index + 1 }}、<span v-html="item.title"></span>
          </div>
          <div class="right">
            <slot>
              <van-icon name="arrow" />
            </slot>
          </div>
        </div>
        <div
          class="content"
          v-html="format(item.desc)"
          v-show="item.show"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { Toast } from "vant";
import { businessApply } from "@/api/brokerage";
import { getHomeData } from "@/api/app";
import topBgImg from "@/assets/images/business-bg.jpg";
import serveBrokerage from "@/assets/images/icon/icon-serve-brokerage1.png";
import { shareWx } from "@/hooks/shareWx";
import VueQr from "vue-qr/src/packages/vue-qr";
import customerServiceImg from "@/assets/images/customerService.png";
export default {
  name: "business",
  components: { VueQr },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      queryList: [
        {
          title: "如何分享赚钱？操作指南",
          desc: "在【个人中心】中点击【分享得佣金】按钮，可查看详情的操作步骤和结算规则。",
        },

        {
          title: "收益多久可到账？",
          desc: "好友测试完付款成功后，到【收益明细】中查看收益信息，申请提现后，系统24小时内完成审核，并转账到您的微信-零钱，在【提现记录】中可查看审核状态。",
        },
        {
          title: "收益如何提现？",
          desc: "到账后的收益，可以在【分享得佣金】页面中点击【提现】按钮，提现金额默认到微信钱包，提现金额1-3个工作日到账。",
        },
        {
          title: "提现会收取手续费吗？",
          desc: "提现收益，平台不会收取任何手续费。【温馨提示】微信号未实名认证，需要完成实名认证后，才能提现。",
        },
        {
          title: "如何参与分享赚钱活动？",
          desc: "拥有自媒体或其他自有流量来源，需要商业合作，请添加客服微信", //：#wechat#
        },
        {
          title: "如何联系客服？",
          desc: "如遇问题，可联系客服解决。客服微信：#wechat#（客服在线时间：工作日9:00-18:00）",
        },
      ],
      applyFrom: {
        phone: "",
        nickname: "",
        weChat: "",
        accounts: "",
      },
      appConfig: {},
    });
    const wechatInfo = computed(() => store.getters.wechatInfo || {});

    async function handleSubmit() {
      try {
        await businessApply({
          phone: state.applyFrom.phone,
          nickname: state.applyFrom.nickname,
          weChat: state.applyFrom.weChat,
          accounts: state.applyFrom.accounts,
        });
        Toast("登记成功！");
      } catch (error) {}
    }
    function handleBrokerage() {
      router.push("/brokerage");
    }
    function handleStep() {
      router.push("/businessStep");
    }
    onMounted(() => {
      init();
      shareWx({}, "business");
    });
    // 初始化首页数据
    async function init() {
      try {
        const { appConfig } = await getHomeData();
        state.appConfig = appConfig; // app 配置
      } catch (error) {}
    }
    // 格式化函数
    function format(desc) {
      return desc.replace(
        /#wechat#/g,
        state.appConfig?.customerServiceWechat || "客服微信"
      );
    }
    return {
      ...toRefs(state),
      topBgImg,
      wechatInfo,
      serveBrokerage,
      handleSubmit,
      handleBrokerage,
      handleStep,
      format,
      customerServiceImg
    };
  },
};
</script>
<style lang="less" scoped>
.qr {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  padding-bottom: @padding-sm;
  box-sizing: content-box;

  img {
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }
}
.business-wrap {
  padding-bottom: 20px;
  .header-wrap {
    position: relative;
    height: 140px;
    // background-color: #ff99ae;
    padding: @padding-base;
    font-size: @font-size-base;
    color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    .align-center();
  }
  .introduce-wrap {
    margin-top: 20px;
    padding: @padding-base;
    font-size: @font-size-base;
    .desc {
      text-align: center;
      margin-bottom: 10px;
      .tag {
        color: #ff99ae;
        font-size: @font-size-lg;
      }
    }
    .skip {
      margin-bottom: 20px !important;
      margin: 0px auto;
      font-size: @font-size-lg;
      text-align: center;
      color: #f0f0f0;
      background: #ff99ae;
      height: 30px;
      width: 70%;
      border-radius: 20px;
      line-height: 30px;
    }
  }
  .customer-wrap {
    text-align: center;
    margin-top: 20px;
    .desc {
      text-align: center;
      color: @light-black;
    }
  }
  .customer-service {
    text-align: center;
    color: #68b0f3;
    .link {
      padding-bottom: 2px;
      border-bottom: 1px solid #ff99ae;
    }
  }
  .title-wrap {
    margin-top: 30px;
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    font-size: @font-size-lg;
    color: @light-black;
    font-weight: bold;
    background-color: #f0f0f0;
    position: relative;
    &:before {
      content: "";
      display: block;
      height: 10px;
      width: 10px;
      border-radius: 50px;
      background-color: #ffd427;
      border: 3px solid #fff;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .content-wrap {
    padding: 10px;
    margin-top: 10px;
    .desc {
      margin-bottom: 10px;
    }
    .operation-wrap {
      .operation-item {
        margin-bottom: 15px;
        // 确定
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: flex-start;
        .left {
          margin-top: 5px;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #68b0f3;
          text-align: center;
          line-height: 22px;
          margin-right: 10px;
          color: #fff;
        }
        .right {
          flex: 1;
          line-height: 30px;
          .func-icon {
            line-height: 40px;
            width: 20px;
            height: 20px;
            transform: translateY(22%);
          }
        }
      }
    }
  }
  .query-list-wrap {
    .item {
      border-bottom: 1px solid #ebe6e6;
      padding-bottom: 5px;
      .title {
        font-size: @font-size-lg;
        font-weight: bold;
        color: @light-black;
        line-height: 50px;
        .space-between();
        .left {
        }
        .right {
          float: right;
        }
      }
      .content {
        padding: 0px 10px 10px 15px;
        font-size: 13px;
        color: @gray-color;
        line-height: 30px;
      }
    }
  }
  .apply-wrap {
    width: calc(100% - 40px);
    margin: 10px auto;
    .head {
      width: 100%;
      height: 30px;
      background: linear-gradient(135deg, #4158d0, #c850c0);
      border-radius: 10px 10px 0 0;
      position: relative;
      font-size: 15px;
      text-align: center;
      color: #ebe6e6;
      line-height: 30px;
      font-weight: 400;
      &:before {
        content: "";
        display: block;
        height: 10px;
        width: 10px;
        border-radius: 50px;
        background-color: #68b0f3;
        border: 1px solid #fff;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
      }
      &::after {
        content: "";
        display: block;
        height: 10px;
        width: 10px;
        border-radius: 50px;
        background-color: #c850c0;
        border: 1px solid #fff;
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .from-wrap {
      border-left: 1px solid #ebe6e6;
      border-right: 1px solid #ebe6e6;
      padding: 0 10px;
      .input-item {
        font-size: 11px;
        border-bottom: 1px solid #ebe6e6;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .button {
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
      color: #fff;
      border-radius: 0 0 10px 5px;
      &.show-submit {
        background: linear-gradient(135deg, #317cf5, #317cf5);
      }
    }
  }
  .operation-button-wrap {
    margin-top: 20px !important;
    margin: 0 auto;
    width: 50%;
    height: 30px;
    background-color: #68b0f3;
    border-radius: 20px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1);
  }
  .desc-line {
    font-size: 14px;
    // padding-left: 10px;
    line-height: 30px;
    position: relative;
    // &:before {
    //   content: "";
    //   display: block;
    //   height: 6px;
    //   width: 6px;
    //   border-radius: 50px;
    //   background-color: #fff;
    //   border: 2px solid #68b0f3;
    //   position: absolute;
    //   left: 0px;
    //   top: 50%;
    //   transform: translateY(-50%);
    // }
    .icon {
      margin-right: 5px;
      width: 15px;
      height: 15px;
      transform: translateY(20%);
    }
  }

  .report-tag-red,
  .report-tag-purple,
  .report-tag-gray,
  .report-tag-orange,
  .report-tag-blue {
    margin-left: -10px !important;
    width: 38% !important;
  }
  .share-desc {
    line-height: 20px;
    margin-bottom: 10px;
    padding-left: 10px;
    position: relative;
    &.line {
      &:before {
        content: "";
        display: block;
        height: 5px;
        width: 5px;
        border-radius: 50px;
        background-color: #b490ca;
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}

// 关注按钮
.attention-button {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -o-user-select: none;
  user-select: none;
  padding: 0 5px;
  background-image: linear-gradient(270deg, #e0c3fc 0%, #8ec5fc 100%);
  cursor: pointer;
  color: #fff;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50px;
  margin-left: 2px;

  &.animation-button {
    animation: scale 8s infinite;
  }

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1);

  span {
    font-size: @font-size-sm;
    font-weight: 500;
  }
}
</style>
