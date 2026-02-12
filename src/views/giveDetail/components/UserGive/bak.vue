<template>
    <div class="content">
      <div class="card-warper">
        <div class="text-warper">
          美好的东西当与挚友分享，共享那份单纯的愉悦，感受彼此多样的情绪！
        </div>
        <!-- 测评详情 -->
        <div
          class="test-warper"
          v-show="info?.testPaperInfo && info?.testPaperInfo?.mainImg"
        >
          <div class="give-icon">
            <img :src="giveIcon" />
          </div>
          <img :src="info?.testPaperInfo?.mainImg" />
          <div class="info">
            <div class="title">{{ info?.testPaperInfo?.name }}</div>
            <div class="subhead" v-if="info?.testPaperInfo?.subhead">
              {{ info?.testPaperInfo?.subhead }}
            </div>
            <div class="bottom">
              <div class="item" v-if="info?.testPaperInfo?.questionNum > 0">
                ● {{ info?.testPaperInfo?.questionNum }}道精选问题
              </div>
              <div class="item">
                ● {{ info?.testPaperInfo?.reportNum }}页专业报告
              </div>
              <div class="item">● {{ info?.testPaperInfo?.saleNum }}人测过</div>
            </div>
          </div>
        </div>
  
        <div class="way-warper">
          <!-- 赠送方式 -->
          <div class="give-wrap" v-if="!info?.drawUserInfo?.userName">
            <div class="report-tag-blue">
              <span>赠送方式</span>
            </div>
            <div class="item">
              <span>●方式1： </span>
              点击屏幕右上角“...”转发给朋友
            </div>
  
            <div class="item">
              <span>●方式2： </span>
              复制下面链接发送给朋友
            </div>
            <div class="link">
              <div class="left">
                {{ url }}
              </div>
              <div class="button" @click="clipboard(url, $event)">复制</div>
            </div>
          </div>
          <!-- 领取信息   -->
          <div class="status-content" v-if="info?.drawUserInfo?.userName">
            <div class="report-tag-red">
              <span>领取状态</span>
            </div>
  
            <div class="draw-info">
              <div class="left">
                <img :src="info?.drawUserInfo?.headImgUrl" />
              </div>
              <div class="right">
                <div class="title">{{ info?.drawUserInfo?.userName }}</div>
                <div class="status">
                  {{ info?.testOrderInfo ? "已使用" : "未使用" }}
                </div>
              </div>
            </div>
            <div class="info">
              <div v-if="info?.drawTime > 0">
                领取时间：{{ $filters.formatDate(info?.drawTime) }}
              </div>
              <div v-else>暂未领取</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="button" @click="$router.go(-1)">点这里返回上一页</div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, onMounted, computed } from "vue";
  import clipboard from "@/utils/clipboard";
  import { shareWx } from "@/hooks/shareWx";
  import { useStore } from "@/store";
  
  import giveIcon from "@/assets/images/gift-01.png";
  export default {
    name: "giveDetail",
  
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const store = useStore();
      const state = reactive({
        show: false,
        url: window.location.href,
        status: ["未领取", "已领取", "已测试"],
      });
      const about = computed(() => store.getters.wechatInfo?.introduction);
      onMounted(async () => {
        shareWx({
          testPaperId: props.info?.testPaperInfo?.id,
          link: state.url,
          desc: "美好的东西当与挚友分享，共享那份单纯的愉悦，感受彼此多样的情绪！我购买了一份专业评测赠送给你，赶紧点击测试吧！",
        });
      });
  
      return {
        ...toRefs(state),
        clipboard,
        about,
        giveIcon,
      };
    },
  };
  </script>
  
  <style lang="less" scoped>
  .content {
    background: #fff url("@/assets/images/give-bg.png") no-repeat;
    background-size: 100% auto;
    background-position: top center;
  
    .card-warper {
      background: #fff;
      transform: translateY(70px) translateX(0%);
      background: #fff url("@/assets/images/bg_base.png") repeat !important;
      background-size: 1.6rem !important;
      margin: auto 10px;
      border-radius: 10px;
      border: 1px solid #a1c4fd;
      box-shadow: 0px 0px 6px #d6d6d6;
      padding: 20px 30px 0 30px;
  
      img {
        width: 100px;
        height: 100px;
      }
  
      .text-warper {
        font-style: italic;
        color: @light-black !important;
        line-height: 30px;
        font-weight: 300;
        font-size: @font-size-lg !important;
      }
  
      .test-warper {
        margin-top: 25px;
        position: relative;
        z-index: 1;
  
        .give-icon {
          z-index: 10;
          position: absolute;
          transform: translateY(-50%) translateX(-50%);
          top: 0;
          left: 50%;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #a1c4fd;
          background-color: #fff;
  
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
  
        img {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          width: 100%;
          height: auto;
        }
  
        .info {
          z-index: 10;
          box-shadow: 0px 0px 6px #d6d6d6;
          // margin-top: -50px;
          transform: translateY(-40px) translateX(0%);
          background: #fff;
          text-align: center;
          padding: 10px 0 0 0;
  
          .title {
            font-size: @font-size-lg;
            line-height: 25px;
            font-weight: bold;
            font-size: @font-size-lg;
          }
  
          .subhead {
            color: @gray-color;
            font-size: @font-size-base;
          }
  
          .bottom {
            height: 22px;
            background-color: #c1eec9;
            margin-top: 10px;
            .space-between();
  
            .item {
              line-height: 22px;
              color: #fff;
              flex: 1;
              // color: @gray-color;
              text-align: center;
              font-size: @font-size-sm;
            }
          }
        }
      }
  
      position: relative;
  
      .way-warper {
        transform: translateY(-30px) translateX(0%);
        margin-bottom: -10px !important;
        .give-wrap {
          .report-tag-blue {
            margin-left: -31px !important;
          }
  
          .item {
            font-size: @font-size-base;
            line-height: 30px;
  
            span {
              color: @theme-color;
            }
          }
  
          .link {
            .space-between();
            font-size: @font-size-base;
            margin: @padding-sm 0;
            height: 38px;
            line-height: 38px;
  
            .left {
              border-radius: 3px;
              flex: 1;
              border: 1px solid #cfcfcf;
              overflow: hidden;
              padding: 0 @padding-sm;
            }
  
            .button {
              margin-left: 5px;
              width: 75px;
              border-radius: 3px;
              color: #fff;
              background-color: @theme-color;
              text-align: center;
            }
          }
        }
      }
    }
  
    .status-content {
      .report-tag-red {
        margin-left: -31px !important;
      }
  
      .draw-info {
        .space-between();
  
        .left {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffd427;
  
          img {
            width: 100%;
            height: 100%;
          }
        }
  
        .right {
          flex: 1;
          padding-left: @padding-base;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
  
          .title {
            font-size: @font-size-base;
          }
  
          .status {
            font-size: @font-size-base;
            font-weight: bold;
            color: @theme-color;
          }
        }
      }
  
      .info {
        color: @gray-color;
        font-size: @font-size-sm;
        line-height: 25px;
      }
    }
  }
  
  .footer {
    .fixed-bottom();
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px !important;
  
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