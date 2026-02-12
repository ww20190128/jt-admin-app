<template>
  <BaseDialog v-bind="$attrs" :showConfirmButton="false">
    <div class="share-dialog">
      <div v-if="isLoading" class="loading-mask">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在创建您的专属分享图片...</p>
      </div>
      <!-- 内容 -->

      <div class="share-wrap">
        <div class="content" ref="shareDivRef" id="html-canvas">
          <div class="test-info-warper">
            <img
              :src="testPaperInfo?.mainImg"
              class="cover"
              ref="imgRef1"
              @load="imageLoaded('cover')"
            />
            <div class="info-name">
              <p class="title">{{ testPaperInfo?.name }}</p>
              <p class="subhead">{{ testPaperInfo?.subhead }}</p>
            </div>
          </div>
          <div class="code-warper">
            <!-- 中间显示一张图片 -->
            <VueQr
              class="code-img"
              :text="shareUrl"
              :size="300"
              :logoSrc="userInfo?.headImgUrl"
              :color-dark="black"
              @load="imageLoaded('shareQr')"
            />
            <div class="desc">
              <p class="desc1">扫码二维码</p>
              <p class="desc2">了解详情</p>
            </div>
          </div>
          <div class="info-card">
            <div class="top">
              <img
                :src="userInfo?.headImgUrl"
                class="user-img"
                @load="staticImageLoaded('userImg')"
              />
              <div class="user-name">
                <p class="name">{{ userInfo?.userName }}</p>
                <p class="desc">邀请你参与《{{ testPaperInfo?.name }}》测试</p>
              </div>
            </div>
            <div class="center">
              <p class="desc1">职业指导 | 恋爱指南 | 辅助减压 | 自我探索</p>
              <p class="desc2">100+专业心理测评，带你探索真实的自我</p>
            </div>
            <div class="bottom">
              <div class="left">
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

      <div class="close-button" @click="close">
        <van-icon name="close" />
      </div>
      <div class="desc-wrap">
        <p class="desc1 desc">
          <span v-if="isLoading"> 正在加载中...</span>
          <span v-else>
            长按上方<i class="fa fa-hand-o-up"></i>图片保存或者分享给好友</span
          >
        </p>
        <p class="desc2 desc">
          (点击右上角<span class="tag">···</span>分享给好友/朋友圈)
        </p>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import { reactive, toRefs, computed, onMounted, ref, watch } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import BaseDialog from "@/components/BaseDialog";
import VueQr from "vue-qr/src/packages/vue-qr";
import html2canvas from "html2canvas";

import logoImg from "@/assets/images/logo.png";
import { shareWx } from "@/hooks/shareWx";
import { Toast } from "vant";

export default {
  name: "Share",
  props: {
    testPaperInfo: {
      type: Object,
      default: () => {},
    },
    shareUrl: {
      type: String,
      default: () => "",
    },
    shareCode: {
      type: String,
      default: () => "",
    },
    clickItem: {
      type: Function,
    },
  },
  components: { BaseDialog, VueQr, html2canvas },
  setup(props, cxt) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      imageData: "",
      isLoading: false, // 是否正在加载
      loadedImgMap: [], // 已加载的动态图片的容器
      loadedStaticImgMap: [], // 已加载的静态图片的容器
      imageLoaded: false, // 图片是否加载完成
    });
    // 监听imageLoaded
    watch(
      () => state.imageLoaded,
      (val) => {
        if (val) {
          // 生成海报
          setTimeout(() => {
            createShareImg();
          }, 500);
        }
      },
      { immediate: true }
    );
    watch(
      () => props.testPaperInfo,
      (val) => {
        shareWx({
          testPaperId: props.testPaperInfo?.id,
        });
        state.imageLoaded = false;
        state.isLoading = true; // 开始加载图片
      }
    );
    onMounted(async () => {
      shareWx({
        testPaperId: props.testPaperInfo?.id,
      });
      state.imageLoaded = false;
      state.isLoading = true; // 开始加载图片
    });
    const userInfo = computed(() => store.getters.userInfo);

    const wechatConf = computed(() => store.getters.wechatInfo || {});

    function close() {
      cxt.emit("update:show", false);
    }

    const shareImgRef = ref(null);
    // 生成海报
    async function createShareImg() {
      // state.isLoading = false; // 加载完成
      // return
      const shareDivElement = document.getElementById("html-canvas");
      const shareImgElement = document.getElementById("img-canvas");
      await html2canvas(shareDivElement, {
        useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
        allowTaint: false, //确保画布不会被标记为“已污染”，从而允许导出图像数据
      })
        .then((canvas) => {
          shareImgElement.style.height =
            shareDivElement.clientHeight + 30 + "px";
          shareImgElement.style.pointerEvents = "auto";
          shareImgElement.style.padding = "0px 20px 0px 20px";
          const img = new Image();
          img.style.pointerEvents = "auto";
          img.style.borderRadius = "5px";
          img.style.boxShadow = "0px 0px 6px rgba(0, 0, 0, 0.5)";
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
          state.isLoading = false;
        });
    }

    // 加载动态图片完成
    function imageLoaded(imgTag) {
      if (!state.loadedImgMap.includes(props.testPaperInfo.id + "-" + imgTag)) {
        state.loadedImgMap.push(props.testPaperInfo.id + "-" + imgTag);
      }
      const currentImages = state.loadedImgMap.filter((img) =>
        img.startsWith(props.testPaperInfo.id + "-")
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
        img.startsWith(props.testPaperInfo.id + "-")
      );
      // 2张动态图片加载完成,3张静态图片加载完成
      if (currentImages.length === 2 && state.loadedStaticImgMap.length == 3) {
        state.imageLoaded = true;
      }
    }
    return {
      createShareImg,
      ...toRefs(state),
      userInfo,
      shareImgRef,
      close,
      wechatConf,
      logoImg,
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
.close-button {
  font-weight: bold;
  font-size: 22px;
  position: absolute;
  top: 5px;
  right: 8px;
  color: @gray-color;
  z-index: 999;
}
.desc-wrap {
  margin-top: 0px;
  width: 100%;
  padding: 2px;
  background-color: #fff;
  .desc {
    text-align: center;
    color: @theme-color;

    line-height: 20px;
    text-align: center;
    font-weight: 300;
    .tag {
      color: black !important;
      font-weight: bold;
    }
  }
  .desc1 {
    font-size: 12px;
    i {
      font-size: 16px !important;
      color: rgb(247, 65, 65) !important;
    }
  }
  .desc2 {
    font-size: 11px !important;
  }
}

// 设置弹框的高度为屏幕高度的50%
.share-dialog {
  position: relative;
  padding-top: 29px;
  // background-color: transparent;
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );
  .share-img-wrap {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  .share-wrap {
    width: 100%;
    min-height: 480px;
    background-color: #e3eeff;
    padding: 10px 20px 20px 20px;
    height: auto;
    position: relative;
    .content {
      border: 12px solid #afcbf7; /* 添加白色边框 */
      box-shadow: 0px 0px 2px #afcbf7;
      border-radius: 5px; /* 圆角边框 */
      .test-info-warper {
        border-radius: 5px; /* 圆角边框 */
        position: relative;
        width: 100%;
        .cover {
          width: 100%;
          height: auto;
          min-height: 50px;
        }

        .info-name {
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
            text-align: center;
          }

          .subhead {
            font-size: @font-size-sm;
            color: @gray-color;
            overflow: hidden;
            text-align: center;
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
</style>
