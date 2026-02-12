<template>
  <div class="app-container">
    <!-- 顶部标题 -->
    <div class="head">
      <!-- <img src="https://oss.1cece.top/goods/mbti/banner1.png" /> -->
      <img :src="goodsInfo.top_image" />
    </div>
    <!-- 轮播 -->
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in 8" :key="item">
          <img :src="`https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/report/MBTI/png/m${item + 1}.png`" />
        </div>
      </div>
    </div>
    <!-- 底部轮播 -->
    <div class="bottom-swiper">
      <div class="left">
        <van-swipe
          class="vertical-swiper"
          :autoplay="2000"
          vertical
          indicator-color="white"
          :show-indicators="false"
        >
          <van-swipe-item
            v-for="(item, index) in verticalSwiperList"
            :key="index"
          >
            <div class="swipe-item-content">
              <div class="avatar">
                <img :src="item.avatar" />
              </div>
              <div class="text">
                <p>{{ item.name }}</p>
                <p>{{ item.text }}</p>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="right">
        <div class="num">
          已有 <span class="value">{{ num }}</span> 人
        </div>
        <div class="text">完成职业性格测试</div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      ref="buttonRef"
      class="footer-button"
      @click="handleConfirm"
      :style="{ backgroundColor: promotionInfo.ui_btnColor }"
    >
      {{ promotionInfo.ui_testBtnText || "立即测试" }}
    </div>

      <div
        class="footer-button fixed"
        @click="handleConfirm"
        :style="{ backgroundColor: promotionInfo.ui_btnColor }"
        v-show="buttonShow"
      >
        {{ promotionInfo.ui_testBtnText || "立即测试" }}
      </div>


    <!-- 富文本内容 -->
    <div class="desc" v-html="promotionInfo.copyright"></div>
    <!-- ① 测评基于瑞士心理学家荣格(Carl Jung)的《人格分类》理论，及美国心理
      学家迈尔斯(Isabel Briggs Myers)与其母亲凯瑟琳·库克·布里格斯(Katharine Cook
      Briggs)的实证研究，是国际十分流行的性格测试模型。
      <br />② 测评时间预计8-16分钟，请在心态平和及时间充足的情况下开始答题。
      <br />③ 选项间无对错好坏之分，请选择与你实际做法相符的，而不是你认为怎样
      做是对的。 -->
    <!-- 底部图 -->
    <div class="footer-img">
      <img src="@/assets/images/footer1.png" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Swiper, Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import { debounce } from "lodash";
const emits = defineEmits(["confirm"]);
const props = defineProps({
  promotionInfo: {
    type: Object,
    default: () => ({}),
  },
});

function handleConfirm() {
  emits("confirm");
}
const num = ref(212242);
const buttonRef = ref(null);
const buttonShow = ref(false);

const ifShowButton = debounce(
  () => {
    buttonShow.value = isElementUnVisible(buttonRef.value);
  },
  50,
  { maxWait: 1000 }
);
onMounted(() => {
  num.value = props.goodsInfo.goods?.goods_vr_sale_count;
  createSwiper();
  createSetTimeout();

  window.addEventListener("scroll", ifShowButton);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", ifShowButton);
});

function createSwiper() {
  Swiper.use([Autoplay]);
  new Swiper(".swiper", {
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  });
}

function createSetTimeout() {
  const time = getRandom(1500, 5000);
  const value = getRandom(1, 10);
  setTimeout(() => {
    num.value += value;
    createSetTimeout();
  }, time);
}
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isElementUnVisible(el) {
  const rect = el.getBoundingClientRect();
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  return (rect.top >= clientHeight && rect.bottom < clientHeight) || rect.bottom <= 0;
}
const verticalSwiperList = [
  {
    name: "走走停停",
    text: "22秒前的结果为科学家型（专家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t1.jpg",
  },
  {
    name: "时光路人",
    text: "22秒前的结果为科学家型",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t2.jpg",
  },
  {
    name: "生如夏花i",
    text: "49秒前的结果为善人型（供应者型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t3.jpg",
  },
  {
    name: "愿得一人心",
    text: "13分钟前的结果为作家型（咨询师型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t4.jpg",
  },
  {
    name: "绿色森林",
    text: "10分钟前的结果为作家型（咨询师型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t5.jpg",
  },
  {
    name: "小透明",
    text: "26分钟前的结果为教师型（教育家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t6.jpg",
  },
  {
    name: "江野",
    text: "37秒前的结果为哲学家型",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t7.jpg",
  },
  {
    name: "幸福美满",
    text: "9秒前的结果为表演家型",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t8.jpg",
  },
  {
    name: "煮熟的鸭子",
    text: "14秒前的结果为艺人型（艺术家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t9.jpg",
  },
  {
    name: "简单乂情",
    text: "15秒前的结果为作家型（咨询师型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t10.jpg",
  },
  {
    name: "野驴叔叔",
    text: "27分钟前的结果为教师型（教育家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t11.jpg",
  },
  {
    name: "网瘾少女KYO",
    text: "9分钟前的结果为表演家型",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t12.jpg",
  },
  {
    name: "飘逸飞雪",
    text: "27秒前的结果为善人型（供应者型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t13.jpg",
  },
  {
    name: "秀美山河",
    text: "29秒前的结果为学者型（思想家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t14.jpg",
  },
  {
    name: "murli",
    text: "18分钟前的结果为使者型（记者型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t15.jpg",
  },
  {
    name: "阿贝",
    text: "52秒前的结果为护理型（照顾者）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t16.jpg",
  },
  {
    name: "来杯冰美式",
    text: "7分钟前的结果为科学家型（专家型）",
    avatar:
      "https://xlcs-oss.oss-cn-shenzhen.aliyuncs.com/goods/touxiang/t17.jpg",
  },
];
</script>
<style lang="less" scoped>
.app-container {
  background-size: cover;
  min-height: 100vh;
  .head {
    width: 270px;
    padding: 40px 0;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }

  .bottom-swiper {
    display: flex;
    padding: 30px 10px;
    justify-content: space-between;
    align-items: center;
    .left {
      flex: 1;
      .vertical-swiper {
        width: 210px;
        height: 60px;
        .swipe-item-content {
          font-size: 13px;
          color: #fff;
          display: flex;
          align-items: center;
          .avatar {
            padding-right: 10px;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .text {
            width: 150px;
            padding-right: 5px;
            p {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .right {
      padding-left: 20px;
      border-left: 1px solid hsla(0, 0%, 100%, 0.3);
      height: 34px;
      width: 140px;
      font-size: 13px;
      color: #fff;
      .num {
        .value {
          color: #ffda2d;
        }
      }
    }
  }
  .footer-button {
    width: 320px;
    height: 44px;
    border-radius: 100px;
    margin: 0 auto;
    animation: scale 3s infinite;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    background-color: #ffda2d;
    color: #fff;
    &.fixed {
      position: fixed;
      bottom: 20px;
      left: 50%;
      margin-left: -160px;
      z-index: 99;
    }
  }
  .desc {
    padding: 30px @padding-base;
    text-align: left;
    color: #fff;
    font-size: 12px;
    line-height: 28px;
    :deep(img) {
      display: block;
    }
  }
  .footer-img {
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
  }
}
@keyframes scale {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.1);
  }
}

.swiper {
  position: relative;
  width: 100%;
  height: 260px;
}
.swiper-slide {
  transition: 300ms;
  transform: scale(0.9) !important;
  img {
    height: 100%;
  }
}
.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1) !important;
}
</style>
