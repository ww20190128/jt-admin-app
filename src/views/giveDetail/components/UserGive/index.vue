<template>
  <div class="give-wrap">
    <div v-if="isLoading" class="loading-mask">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在创建您的专属分享图片...</p>
    </div>
    <!-- <div class="top-img-wrap">
      <img src="@/assets/images/give-bg.png" class="cover" />
    </div> -->
    <div class="share-wrap" ref="shareImgRef" id="html-canvas">
      <div class="inner-wrap">
        <div class="test-info-warper">
          <img
            :src="info?.testPaperInfo?.mainImg"
            class="cover"
            @load="imageLoaded('cover')"
          />
          <div class="info">
            <p class="title">{{ info?.testPaperInfo?.name }}</p>
            <p class="subhead">{{ info?.testPaperInfo?.subhead }}</p>
          </div>
        </div>
        <div class="code-warper">
          <!-- 中间显示一张图片 -->
          <VueQr
            @load="imageLoaded('shareQr')"
            class="code-img"
            :text="url"
            :size="300"
            :logoSrc="userInfo?.headImgUrl"
            :color-dark="black"
          />
          <div class="desc">
            <!-- <p class="desc1">扫码二维码</p>
          <p class="desc2">了解详情</p> -->
          </div>
        </div>
        <div class="info-card">
          <div class="text-warper">
            美好的东西当与挚友分享，共享那份单纯的愉悦，感受彼此多样的情绪！
          </div>
          <div class="top">
            <img
              :src="userInfo?.headImgUrl"
              class="user-img"
              @load="staticImageLoaded('userImg')"
            />
            <div class="user-name">
              <p class="name">{{ userInfo?.userName }}</p>
              <p class="desc">
                赠送您一份《{{ info?.testPaperInfo?.name }}》测试，请扫码领取！
              </p>
            </div>
          </div>
          <div class="center">
            <!-- <p class="desc1">职业指导 | 恋爱指南 | 辅助减压 | 自我探索</p>
          <p class="desc2">100+专业心理测评，带你探索真实的自我</p> -->
          </div>
          <div class="bottom">
            <div class="left">
              <!-- wechatConf?.logo -->
              <img
                :src="wechatConf?.logo"
                class="icon-img"
                @load="staticImageLoaded('logo')"
              />
              <div class="app-name">{{ wechatConf?.name }}</div>
            </div>
            <div class="right">
              <div class="desc">
                <p>扫码关注</p>
                <p>领福利<i class="fa fa-gift"></i></p>
              </div>
              <img
                :src="wechatConf?.wechat_qrcode"
                class="code-img"
                @load="staticImageLoaded('codeImg')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图片 -->
    <div class="share-img-wrap" id="img-canvas" ref="shareImgRef"></div>
    <div class="way-wrap">
      <!-- 赠送方式 -->
      <div class="type-wrap" v-if="!info?.drawUserInfo?.userName">
        <div class="report-tag-blue">
          <span>赠送方式</span>
        </div>
        <div class="item">
          <span>●方式1： </span>
          长按上方图片，转发给朋友
        </div>
        <div class="item">
          <span>●方式2： </span>
          点击屏幕右上角“...”转发给朋友
        </div>
        <div class="item">
          <span>●方式3： </span>
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
  <div class="footer">
    <div class="button" @click="$router.go(-1)">点这里返回上一页</div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  ref,
  nextTick,
  watch,
} from "vue";
import clipboard from "@/utils/clipboard";
import { shareWx } from "@/hooks/shareWx";
import { useStore } from "@/store";
import html2canvas from "html2canvas";
import giveIcon from "@/assets/images/gift-01.png";
import VueQr from "vue-qr/src/packages/vue-qr";

export default {
  name: "giveDetail",

  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { VueQr, html2canvas },
  setup(props) {
    const store = useStore();
    const state = reactive({
      show: false,
      url: window.location.href,
      status: ["未领取", "已领取", "已测试"],
      isLoading: false,
      imageData: "",
      loadedImgMap: [], // 已加载的动态图片的容器
      loadedStaticImgMap: [], // 已加载的静态图片的容器
      imageLoaded: false, // 图片是否加载完成
    });
    const about = computed(() => store.getters.wechatInfo?.introduction);
    // 监听imageLoaded
    watch(
      () => state.imageLoaded,
      (val) => {
        if (val) {
          if (!props.info?.drawUserInfo?.userName) {
            // 生成海报
            setTimeout(() => {
              createShareImg();
            }, 500);
          }
        }
      },
      { immediate: true }
    );

    onMounted(async () => {
      shareWx({
        testPaperId: props.info?.testPaperInfo?.id,
        link: state.url,
        desc: "美好的东西当与挚友分享，共享那份单纯的愉悦，感受彼此多样的情绪！我购买了一份专业评测赠送给你，赶紧点击测试吧！",
      });
      if (!props.info?.drawUserInfo?.userName) {
        state.isLoading = true;
      }
    });
    const userInfo = computed(() => store.getters.userInfo);

    const wechatConf = computed(() => store.getters.wechatInfo || {});
    // 创建分享图片
    async function createShareImg() {
      const shareDivElement = document.getElementById("html-canvas");
      const shareImgElement = document.getElementById("img-canvas");
      await html2canvas(shareDivElement, {
        useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
        allowTaint: false, //确保画布不会被标记为“已污染”，从而允许导出图像数据
      })
        .then((canvas) => {
          shareImgElement.style.height = shareDivElement.clientHeight + "px";
          shareImgElement.style.pointerEvents = "auto";
          const img = new Image();
          img.style.pointerEvents = "auto";
          img.src = canvas.toDataURL("image/png");
          if (shareImgElement.firstChild) {
            shareImgElement.replaceChild(img, shareImgElement.firstChild);
          } else {
            shareImgElement.appendChild(img);
          }
          img.onload = function () {
            state.isLoading = false; // 加载完成
          };
        })
        .catch((error) => {
          state.isLoading = false; // 加载完成
        });
    }
    const shareImgRef = ref(null);
    // 加载动态图片完成
    function imageLoaded(imgTag) {
      if (
        !state.loadedImgMap.includes(
          props.info?.testPaperInfo?.id + "-" + imgTag
        )
      ) {
        state.loadedImgMap.push(props.info?.testPaperInfo?.id + "-" + imgTag);
      }
      const currentImages = state.loadedImgMap.filter((img) =>
        img.startsWith(props.info?.testPaperInfo?.id + "-")
      );

      // 2张动态图片加载完成,3张静态图片加载完成ss
      if (currentImages.length === 2 && state.loadedStaticImgMap.length == 3) {
        state.imageLoaded = true;
      }
    }
    // 加载静态图片
    function staticImageLoaded(imgTag) {
      if (!state.loadedStaticImgMap.includes(imgTag)) {
        state.loadedStaticImgMap.push(imgTag);
      }
      const currentImages = state.loadedImgMap.filter((img) =>
        img.startsWith(props.info?.testPaperInfo?.id + "-")
      );
      // 2张动态图片加载完成,3张静态图片加载完成
      if (currentImages.length === 2 && state.loadedStaticImgMap.length == 3) {
        state.imageLoaded = true;
      }
    }
 
    return {
      ...toRefs(state),
      userInfo,
      shareImgRef,
      wechatConf,
      clipboard,
      about,
      giveIcon,
      createShareImg,
      imageLoaded,
      staticImageLoaded,
    };
  },
};
</script>

<style lang="less" scoped>
// 加载遮罩层样式
.loading-text {
  color: white;
  font-size: 14px;
  padding-left: 10px;
}
.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.give-wrap {
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );
  position: relative;
  width: 100%;
  min-height: 100vh;
  .top-img-wrap {
    position: absolute;
    top: 0px;
    left: 0;
    img {
      width: 100%;
      height: auto;
    }
  }
  // padding-top: 70px;
  padding-bottom: 50px;
  .way-wrap {
    position: relative;
    width: 100%;
    padding: 0 20px;
    background-color: #f3e7e9;
    .type-wrap {
      .report-tag-blue {
        margin-left: -20px !important;
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
  .status-content {
    .report-tag-red {
      margin-left: -20px !important;
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
  .share-img-wrap {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  .share-wrap {
    width: 100%;
    height: auto;
    position: relative;
    padding: 20px 20px;
    background: transparent;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );
    .inner-wrap {
      position: relative;
      width: 100%;
      height: auto;
      border: 10px solid #afcbf7; /* 添加白色边框 */
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
      border-radius: 5px; /* 圆角边框 */
      .test-info-warper {
        position: relative;
        width: 100%;
        .cover {
          width: 100%;
          height: auto;
        }
        .info {
          box-shadow: 0px 0px 2px #fff;
          width: 100%;
          position: absolute;
          bottom: 0;
          height: auto;
          background-color: #fff;
          border-radius: 5px 5px 5px 5px;

          padding: 0px 5px 5px 5px;

          .title {
            margin-top: 5px;
            font-size: @font-size-lg;
            font-weight: bold;
          }

          .subhead {
            font-size: @font-size-sm;
            color: @gray-color;
            overflow: hidden;
          }
        }
      }

      .code-warper {
        width: 40%;
        margin: 10px auto;

        .desc {
          margin-top: 2px;

          p {
            text-align: center;
            color: @gray-color;
            font-size: @font-size-sm;
          }
        }
      }

      .info-card {
        background-color: #fff;
        height: auto;
        width: 100%;
        padding: 5px 10px;
        border-radius: 5px;
        .text-warper {
          font-style: italic;
          // color: @light-black !important;
          color: #a1c4fd !important;
          line-height: 25px;
          font-weight: 300;
          font-size: @font-size-lg !important;
          // border-bottom: 1px dashed gainsboro;
          position: relative;
          padding-bottom: 5px;

          text-indent: 1.5em;
          // &:before,
          // &::after {
          //   content: "";
          //   display: block;
          //   width: 10px;
          //   height: 10px;
          //   border-radius: 50%;
          //   background-color: #f3e7e9;
          //   position: absolute;
          //   bottom: -5px;
          // }

          // &:before {
          //   left: -15px;
          // }

          // &::after {
          //   right: -15px;
          // }
        }

        .top {
          width: 100%;
          display: flex;
          align-items: center;

          .user-img {
            display: inline-block;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            border: 1px solid #fff;
            box-shadow: 0px 0px 3px #c2c1c1;
          }

          .user-name {
            padding-left: 5px;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;

            .name {
              font-size: @font-size-sm;
            }

            .desc {
              margin-top: 2px;
              color: @gray-color;
              font-size: @font-size-sm;
            }
          }
        }

        .center {
          margin-top: 8px;
          font-size: @font-size-sm;
          line-height: 18px;
          color: @gray-color;
          border-bottom: 1px dashed gainsboro;
          padding-bottom: 5px;
          position: relative;

          p {
            font-size: @font-size-sm;
          }

          &:before,
          &::after {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #f3e7e9;
            position: absolute;
            bottom: -5px;
          }

          &:before {
            left: -15px;
          }

          &::after {
            right: -15px;
          }
        }

        .bottom {
          width: 100%;
          margin-top: 5px;
          .space-between();

          .left {
            width: 40%;
            display: flex;
            align-items: center;

            .icon-img {
              height: 25px;
              width: 25px;
              border-radius: 50%;
              border: 1px solid #fff;
              box-shadow: 0px 0px 3px #c2c1c1;
            }

            .app-name {
              color: @gray-color;
              font-size: @font-size-base;
              padding-left: 5px;
            }
          }

          .right {
            height: 40px;
            display: flex;
            align-items: center;

            .desc {
              p {
                line-height: 15px;
                color: @gray-color;
                font-size: @font-size-sm;

                .icon {
                  width: 15px;
                  height: 15px;
                }

                i {
                  font-size: @font-size-base;
                  color: rgb(233, 68, 68);
                }
              }

              padding-right: 5px;
            }

            .code-img {
              height: 40px;
              width: 40px;
            }
          }
        }
      }
    }
  }
}

.footer {
  .fixed-bottom();
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px !important;
  background: transparent;
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
