<template>
  <div class="MBTI-PLZ-07">
    <!-- 固定在最上方 -->
    <div class="fixed-top-tab" :class="{ is_fixed: isFixed }" id="boxFixed">
      <div
        class="option"
        :class="titleActiveTabs == item.id ? 'active' : ''"
        v-for="(item, index) in options"
        :key="index"
        @click="handleOption(item)"
      >
        <div class="value">
          <div class="text" style="margin-right: 5px">{{ item.name }}</div>
          <i
            class="fa"
            :class="{ isActive: titleActiveTabs == item.id, [item.icon]: true }"
          ></i>
        </div>
      </div>
    </div>
    <!-- 您的测试类型 -->
    <div class="report-card" :class="[{ 'box-active': isFixed }]">
      <div class="content-warp">
        <!-- 背景图片 -->
        <img
          src="../../../../assets/images/section-header.png"
          style="width: 100%; padding-top: 30px"
        />
        <div class="content-item">
          <div class="left-warp">
            <div class="type-desc"># 你的MBTI类型 #</div>
            <div class="info-wrap">
              <img src="../../../../assets/images/mbti.png" class="img1" />
              <div class="info">
                <div class="type">{{ mbti_pl.extend.score }}</div>
                <p class="temperament">
                  {{ temperament[0] }}，{{ temperament[1] }}
                </p>
                <!-- <div class="adept">
                                    最擅长{{ mbti_pl.extend.adeptType }}的类型
                                </div> -->
              </div>
            </div>
          </div>

          <div class="right-warp">
            <img
              src="../../../../assets/images/quote.png"
              style="width: 20px"
              class="img1"
            />
            <img src="../../../../assets/images/char-bg.png" class="img2" />
            <img :src="mbti_pl.extend?.mainImg" class="img3" />
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div class="chart">
        <div class="mbti_bar">
          <div class="content-area color_base person_bar_h5 hydrated">
            <div class="bar_left hydrated">
              <div class="bar_item1 hydrated">
                <div class="bar_item_0 hydrated">
                  <span style="color: rgb(221, 94, 243)">
                    {{ tubiaoList[0][0].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[0][0].title
                  }}</span>
                </div>

                <div class="bar_item_1 hydrated">
                  <div
                    class="bar_img2 hydrated zs"
                    :style="{
                      background: 'rgb(221, 94, 243)',
                      width: tubiaoList[0][0].percent + '%',
                    }"
                  ></div>

                  <div
                    class="bar_img3 hydrated"
                    :style="{
                      width: tubiaoList[0][1].percent + '%',
                      background: 'rgb(97, 47, 198)',
                    }"
                  ></div>
                </div>

                <div class="bar_item_3 hydrated">
                  <span style="color: rgb(97, 47, 198)"
                    >{{ tubiaoList[0][1].percent }}%</span
                  >
                  <span class="bar_item_wrap">{{
                    tubiaoList[0][1].title
                  }}</span>
                </div>
              </div>
            </div>
            <div class="bar_left hydrated">
              <div class="bar_item1 hydrated">
                <div class="bar_item_0 hydrated">
                  <span style="color: rgb(244, 67, 54)">
                    {{ tubiaoList[1][0].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[1][0].title
                  }}</span>
                </div>
                <div class="bar_item_1 hydrated">
                  <div
                    class="bar_img2 hydrated zs"
                    :style="{
                      background: 'rgb(244, 67, 54)',
                      width: tubiaoList[1][0].percent + '%',
                    }"
                  ></div>
                  <div
                    class="bar_img3 hydrated"
                    :style="{
                      width: tubiaoList[1][1].percent + '%',
                      background: 'rgb(255, 152, 0)',
                    }"
                  ></div>
                </div>
                <div class="bar_item_3 hydrated">
                  <span style="color: rgb(255, 152, 0)">
                    {{ tubiaoList[1][1].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[1][1].title
                  }}</span>
                </div>
              </div>
            </div>
            <div class="bar_left hydrated">
              <div class="bar_item1 hydrated">
                <div class="bar_item_0 hydrated">
                  <span style="color: rgb(33, 150, 243)">
                    {{ tubiaoList[2][0].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[2][0].title
                  }}</span>
                </div>
                <div class="bar_item_1 hydrated">
                  <div
                    class="bar_img2 hydrated zs"
                    :style="{
                      background: 'rgb(33, 150, 243)',
                      width: tubiaoList[2][0].percent + '%',
                    }"
                  ></div>
                  <div
                    class="bar_img3 hydrated"
                    :style="{
                      width: tubiaoList[2][1].percent + '%',
                      background: 'rgb(0, 188, 212)',
                    }"
                  ></div>
                </div>
                <div class="bar_item_3 hydrated">
                  <span style="color: rgb(0, 188, 212)">
                    {{ tubiaoList[2][1].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[2][1].title
                  }}</span>
                </div>
              </div>
            </div>
            <div class="hydrated">
              <div class="bar_item1 hydrated">
                <div class="bar_item_0 hydrated">
                  <span style="color: rgb(0, 150, 136)">
                    {{ tubiaoList[3][0].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[3][0].title
                  }}</span>
                </div>
                <div class="bar_item_1 hydrated">
                  <div
                    class="bar_img2 hydrated zs"
                    :style="{
                      background: 'rgb(0, 150, 136)',
                      width: tubiaoList[3][0].percent + '%',
                    }"
                  ></div>
                  <div
                    class="bar_img3 hydrated"
                    :style="{
                      width: tubiaoList[3][1].percent + '%',
                      background: 'rgb(139, 195, 74)',
                    }"
                  ></div>
                </div>
                <div class="bar_item_3 hydrated">
                  <span style="color: rgb(139, 195, 74)">
                    {{ tubiaoList[3][1].percent }}%
                  </span>
                  <span class="bar_item_wrap">{{
                    tubiaoList[3][1].title
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="floor1" class="rich-text report-card" v-html="portrait"></div>

    <div id="floor2" class="rich-text report-card" v-html="development"></div>
    <!-- ww 注释，关闭该功能 -->
    <div v-if="false" class="report top-report">
      <img
        src="../../../../assets/images/eight-report-banner@2x.png"
        class="report_img"
        @click="handlebawei"
      />
    </div>
    <div
      id="floor3"
      class="rich-text report-card"
      v-html="mbti_pl.extend.zhichang"
    ></div>
    <!-- ww 注释，关闭该功能 -->
    <div class="report top-report" v-if="false">
      <img
        src="../../../../assets/images/work-report-banner@2x.png"
        class="report_img"
        @click="handleZhichang"
      />
    </div>

    <div
      id="floor4"
      class="report-card rich-text"
      v-html="mbti_pl.extend.love"
    ></div>

    <!-- ww 注释，关闭该功能 -->
    <div class="report" v-if="false">
      <div class="report_item">
        <div class="bawei">
          <div class="top">
            <div class="title">
              <span class="baweijiedu">职业深度解读报告</span>
              <div class="baweijiedu2">升职加薪的秘密武器</div>
              <div class="baweijiedu3">深度挖掘你的职场优势</div>
            </div>
            <img
              src="../../../../assets/images/pro-cover.png"
              class="baweijieduImg3"
            />
          </div>
          <div class="bottom" @click="handleZhichang">查看解读报告</div>
        </div>
      </div>
      <div class="report_item">
        <div class="bawei">
          <div class="top">
            <div class="title">
              <span
                class="baweijiedu"
                style="background-color: rgb(255, 142, 144)"
                >恋爱深度解读报告</span
              >
              <div class="baweijiedu2">谁是你命中注定的另一半？</div>
              <div class="baweijiedu3">所谓的“天生一对”，答案都在MBTI恋爱</div>
            </div>
            <img
              src="../../../../assets/images/love-cover.png"
              class="baweijieduImg2"
            />
          </div>
          <div class="bottom" @click="handllove">查看解读报告</div>
        </div>
      </div>
      <div class="report_item">
        <div class="bawei">
          <div class="top">
            <div class="title">
              <span class="baweijiedu">八维深度解读报告</span>
              <div class="baweijiedu2">没读过八维不算懂MBTI</div>
              <div class="baweijiedu3">最全最深度的八维解析，独家出品</div>
            </div>
            <img
              src="../../../../assets/images/eight-cover.png"
              class="baweijieduImg"
            />
          </div>
          <div class="bottom" @click="handlebawei">查看解读报告</div>
        </div>
      </div>
    </div>
    <!-- ww 注释，关闭该功能 -->
    <!-- <div class="float-right-menu">
            <div class="float-right career" @click="handleZhichang">
                <span>职场优势</span>
            </div>
            <div class="float-right love" @click="handllove">
                <span>恋爱报告</span>
            </div>
            <div class="float-right bawei" @click="handlebawei">
                <span>八维报告</span>
            </div>

            <div class="float-right giftPack" v-if="sendCouponList.length > 0" @click="handleGift">
                <span>大礼包</span>
            </div>
        </div> -->
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  onMounted,
  nextTick,
  useAttrs,
  defineEmits,
  ref,
  getCurrentInstance,
} from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import Progress from "../../components/Progress";
import LargeTitle from "../../components/LargeTitle";
import BarChart from "../../components/Charts/BarChart";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { isObject } from "lodash";
import qs from "qs";
export default {
  name: "07",
  emits: ["handleZhichang"],
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    Progress,
    LargeTitle,
    BarChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    testOrderInfo: {
      type: Object,
      default: () => ({}),
    },

    sendCouponList: {
      type: Array,
      default: () => [],
    },
  },
  //
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const attrs = useAttrs();
    const store = useStore();
    // 推荐使用proxy
    let { ctx: that, proxy } = getCurrentInstance();
    const { testOrderId, guid, puid } = route.query;
    const temperament = computed(() => {
      const obj = props.data?.temperament ?? {};
      return obj || {};
    });
    const mbti_pl = computed(() => {
      const obj = props.data?.mbti_pl ?? {};
      obj.male = `https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/report/MBTI/man/${mbti_pl.extend?.score}-01.png`;

      return obj || {};
    });
    const portrait = computed(() => {
      const html = props.data?.mbti_pl?.total_result_explain ?? "";
      return html || "";
    });
    const development = computed(() => {
      const html = props.data?.mbti_pl?.juti_result_explain ?? "";
      return html || "";
    });

    const titleActiveTabs = ref(1);

    const [goodsCoupon, vipCoupon] = props.sendCouponList;
    // const mbti_pl_id = computed(() => {
    //     return props.data?.mbti_pl?.mbti_pl?.id;
    // });
    // const version = computed(() => {
    //     const num=props.testOrderInfo?.version?? 1;
    //     return num || 1;
    // });

    const version = props.testOrderInfo?.version ?? 1;

    onMounted(() => {
      window.addEventListener("scroll", initHeight);

      nextTick(() => {
        // 获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
        state.offsetTop = document.querySelector("#boxFixed")?.offsetTop;
      });
      window.addEventListener("scroll", handleScroll);
    });

    const state = reactive({
      active: 0,
      isFixed: false,
      offsetTop: 0,
      tubiaoList: [
        [
          { title: "E", percent: 25.92 },
          { title: "I", percent: 74.07 },
        ],

        [
          { title: "S", percent: 55.17 },
          { title: "N", percent: 44.82 },
        ],

        [
          { title: "T", percent: 72 },
          { title: "F", percent: 28 },
        ],

        [
          { title: "J", percent: 36.84 },
          { title: "P", percent: 63.15 },
        ],
      ],
      options: [
        {
          name: "基本画像",
          icon: "fa-user-o",
          isAcive: true,
          id: 1,
        },
        {
          name: "个人成长",
          icon: "fa-rocket",
          isAcive: false,
          id: 2,
        },
        {
          name: "职场避坑",
          icon: "fa-close",
          isAcive: false,
          id: 3,
        },
        {
          icon: "fa-heartbeat",
          name: "恋爱指南",
          isAcive: false,
          id: 4,
        },
      ],
    });

    function handleScroll() {
      var scrollTop =
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop) + 75;
      // window.onload = function () {

      let elementbox = document.querySelector("#box");
      let floor2 = document.querySelector("#floor2");
      let floor3 = document.querySelector("#floor3");
      let floor4 = document.querySelector("#floor4");
      if (elementbox) {
        let boxoffsetTop = elementbox?.offsetTop;
        if (scrollTop > boxoffsetTop) {
          titleActiveTabs.value = 1;
        }
      }
      if (floor2) {
        let floor2offsetTop = floor2?.offsetTop;
        if (scrollTop > floor2offsetTop) {
          titleActiveTabs.value = 2;
        }
      }
      if (floor3) {
        let floor3offsetTop = floor3?.offsetTop;
        if (scrollTop > floor3offsetTop) {
          titleActiveTabs.value = 3;
        }
      }
      if (floor4) {
        let floor4offsetTop = floor4?.offsetTop;
        if (scrollTop > floor4offsetTop) {
          titleActiveTabs.value = 4;
        }
      }
      // }

      // 处理滚动事件的逻辑
    }
    function pushBaseUrl(data) {
      const url = store.getters.wechatInfo?.web_url;
      const baseUrl = url?.endsWith("/") ? url.slice(0, -1) : baseUrl;
      let path = isObject(data) ? data.path : data;
      if (url) {
        path = baseUrl + path;
        if (isObject(data) && data.query) {
          const search = qs.stringify(data.query);
          path = `${path}?${search}`;
        }

        window.location.href = path;
      } else {
        router.push(path);
      }
    }
    // 职场优势
    function handleZhichang() {
      // ww 注释20240420
      // router.push({
      //     path: "/mbi_career",
      //     query: {
      //         testOrderId,
      //         mbti_pl_id: props.data?.mbti_pl?.id,
      //     },
      // });
    }
    // 八维
    function handlebawei() {
      // ww 注释20240420
      // router.push({
      //     path: "/bawei_pay",
      //     query: {
      //         testOrderId,
      //         mbti_pl_id: props.data?.mbti_pl?.id,
      //     },
      // });
    }
    // 恋爱
    function handllove() {
      // ww 注释20240420
      // router.push({
      //     path: "/love_pay",
      //     query: {
      //         testOrderId,
      //         mbti_pl_id: props.data?.mbti_pl?.id,
      //     },
      // });
    }

    /********* start-目录吸顶********/
    function initHeight() {
      // 设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离 (被卷曲的高度)
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      //如果被卷曲的高度大于吸顶元素到顶端位置 的距离
      state.isFixed = scrollTop > state.offsetTop ? true : false;
    }

    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.pl_list[state.active] || {};
    });
    function scrollTo(offsetTop) {
      // const parent = document.querySelector('.JFPLT-07')
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }

    //监听滚动事件
    window.addEventListener("scroll", function () {
      initHeight();
    });

    function handleOption(item, index) {
      titleActiveTabs.value = item.id;

      let active = "#floor";
      if (item.id == 1) {
        active = "#floor1";
      }
      if (item.id == 2) {
        active = "#floor2";
      }
      if (item.id == 3) {
        active = "#floor3";
      }
      if (item.id == 4) {
        active = "#floor4";
      }

      const element = document.querySelector(active);
      let offsetTop = element?.offsetTop;
      const elementbox = document.querySelector("#box")?.offsetTop;
      if (item.id === 1) {
        offsetTop = elementbox + 30;
      } else {
        offsetTop = element.offsetTop - 60;
      }
      scrollTo(offsetTop);
    }
    function isAcive(index) {
      state.isAcive = index === state.active;
      return index === state.active;
    }
    // 孙组件的方法
    function clickgrandSon() {
      // console.log("孙组件的方法", emit);
    }

    function handleGift() {
      // // ww 注释20240420
      // pushBaseUrl({
      //     path: "/reportCoupon",
      //     query: {
      //         testOrderId,
      //         coupon_code: vipCoupon.code,
      //     },
      // });
    }

    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
      handleOption,
      isAcive,
      clickgrandSon,
      handleGift,
      temperament,
      mbti_pl,
      portrait,
      development,
      version,
      handleZhichang,
      handlebawei,
      handllove,
      titleActiveTabs,

      // male,
      // female
    };
  },

  // //回调中移除监听
  // destroyed() {
  //     window.removeEventListener('scroll', this.handleScroll)
  // },
};
</script>

<style lang="less" scoped>
.title-wireframe {
  span {
    font-size: 16px !important;
  }
}
.report-card {
  margin: 0px 10px 20px 10px !important;
  padding: 10px 10px !important;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #e8e8e8;
  overflow: hidden;
  background: #fff;

  &:first-child {
    margin: 10px 10px 20px 10px;
  }

  &:last-child {
    margin: 20px 10px 10px 10px;
  }
}

.MBTI-PLZ-07 {
  padding: none;
  border-radius: none;
  margin: none;
  box-shadow: none;
  background: none;
  position: relative !important;
  width: 100% !important;
  .fixed-top-tab {
    position: relative;
    padding: 0 10px;
    height: 50px;
    width: 100%;
    background-color: #e0f0ff;
    display: flex;
    justify-content: space-around;
    &.is_fixed {
      position: fixed;
      padding: 0 10px;
      top: 0;
      right: 0;
      left: 0;
      z-index: 999;
  

    }
  }
}

.name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: @theme-color;
}

.box-active {
  padding-top: 60px;
}

.option {
  flex-shrink: 0;
  font-size: 13px;

  // background-color: #e1daed;
  // border: 0.01rem solid #e5e5e5;
  cursor: pointer;

  // &:not(:last-child) {
  //   border-right: 1px solid #fff;
  // }

  &:nth-child(-n + 2) {
    .letter {
      color: #5f5f5f;
    }
  }

  &:nth-last-child(-n + 2) {
    .letter {
      color: #5f5f5f;
    }
  }

  img {
    width: 17px;
  }

  &.active {
    color: #265ad6;
  }

  &.active1 {
    color: #e06432;
  }

  &.active2 {
    color: #265ad6;
  }

  &.active3 {
    color: #da2651;
  }

  .value {
    height: 54px;
    // border-bottom: 1px solid #fff;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    text-align: center;
  }
}

.content-warp {
  background: #fff url("../../../../assets/images/bg_base.png") repeat;
  background-size: 1.6rem;
  padding: 0 10px;
  position: relative;
  padding-bottom: 80px;

  .content-item {
    position: relative;
    margin-bottom: 30px;

    .left-warp {
      color: #874cff;
      margin-top: 10px;

      .type-desc {
        font-size: 22px;
        font-weight: 500;
        padding-top: 5px;
        white-space: nowrap;
      }

      .info-wrap {
        display: flex;
        padding-top: 5px;

        .img1 {
          width: 28px;
          height: 104px;
        }

        .info {
          text-align: left;
          z-index: 99;
          margin-left: 10px;
          margin-bottom: 62px;

          .type {
            font-size: 60px;
          }

          .temperament {
            font-weight: 500;
            font-size: 20px;
          }
        }
      }
    }

    .right-warp {
      position: absolute;
      top: -15px;
      right: -40px;

      .img1 {
        position: absolute;
        top: 30px;
        left: 20px;
        z-index: 44;
      }

      .img2 {
        width: 186px;
        height: 190px;
        z-index: 77;
      }

      .img3 {
        width: 120px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 88;
      }
    }
  }
}

.chart {
  width: 100%;

  border-radius: 6px;
  background: #fff url("../../../../assets/images/bg_base.png") repeat;
  background-size: 1.6rem;
  position: sticky;
  left: 0;
  top: 80%;
  z-index: 99;

  .row-bar {
    padding: 20px 20px;
    margin-top: 20px;

    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }

      .letter {
        width: 60px;
        height: 12px;
        display: flex;
        align-items: center;
        justify-content: left;
        border-radius: 50%;
        font-size: 16px;
        color: #2e1f4a;
      }

      .bar {
        height: 13px;
        background-color: #e9e6e6;
        flex: 1;
        margin: 0 15px;
        display: flex;
        font-size: 11px;
        color: #fff;
        line-height: 13px;

        .left,
        .right {
          width: 50%;
          position: relative;

          .value {
            position: absolute;
            top: 0;
            height: 13px;
            display: flex;
            justify-content: center;
          }
        }

        .left {
          .value {
            right: 0;
            text-align: left;
          }
        }

        .right {
          .value {
            left: 0;
            text-align: left;
          }
        }
      }
    }
  }
}

#floor2,
#floor3,
#floor4 {
  font-size: 14px;
  color: #5f5f5f;
}

#floor1 {
  padding: 20px 20px 0 20px;
  background: #fff;
}

.top-report {
  margin-top: -30px !important;
}

.report {
  padding: 20px;
  margin-top: 20px;
  background: #fff;

  .report_item {
    .bawei {
      width: 100%;
      background-color: #f1f0f5;
      border-radius: 0.256rem;
      margin-bottom: 0.42667rem;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-left: 10px;

        .baweijiedu {
          padding: 3px 10px;
          color: #fff;
          background-color: rgb(234, 143, 107);
          text-align: center;
          border-radius: 50px;
        }

        .title {
          font-size: 13px;
        }

        .baweijiedu2 {
          font-size: 17px;
          padding-top: 10px;
        }

        .baweijiedu3 {
          padding-top: 5px;
          color: #666;
        }

        .baweijieduImg {
          width: auto;
          height: 80px;
          padding-right: 10px;
        }

        .baweijieduImg2 {
          width: auto;
          height: 80px;
          padding-right: 10px;
        }

        .baweijieduImg3 {
          width: auto;
          height: 80px;
          padding-right: 10px;
        }
      }

      .bottom {
        margin: 0 10px;
        border-top: solid #d6d6d6 1px;
        text-align: center;
        height: 41px;
        line-height: 41px;
        font-size: 14.5px;
        font-weight: 400;
        text-align: center;
        color: #8965cf;
      }
    }
  }
}

.float-right-menu {
  position: fixed;
  right: calc(((100vw - 381px) / 2));
  top: 25vh;
  z-index: 100;
}

.float-right {
  background: rgba(47, 48, 44, 0.6);
  border-radius: 5px 0 0 5px;

  width: 26px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  padding: 6px 3px 6px 1px;
  box-sizing: content-box;
  margin-right: 1px;

  &.career {
    margin-bottom: 20px;
  }

  &.bawei {
    margin-bottom: 20px;
  }

  &.love {
    margin-bottom: 20px;
  }

  &.giftPack {
    margin-bottom: 20px;
  }
}

.right-float-menu {
  position: fixed;
  right: calc(((100vw - 381px) / 2));
  bottom: 4.5rem !important;
  width: 26px;
  line-height: 18px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  z-index: 100;

  .menu-item {
    padding-top: 10px;
    padding-bottom: 10px;
    // padding-right: 3px;;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    margin-top: 20px;
    background: rgba(47, 48, 44, 0.6);
  }
}

.mbti_bar {
  padding: 20px 10px 20px 10px;
  color: #333;
  font-weight: 400;
  font-size: 12px;
  overflow-y: hidden;
  overflow-x: hidden;

  margin-top: -140px;
  width: 100%;

  span {
    font-size: 14px;
  }
}

.bar_left {
  padding-bottom: 14px;
}

.bar_item1 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.bar_item_0,
.bar_item_3 {
  width: 15%;
  text-align: center;
}

.bar_item_wrap {
  white-space: nowrap;
}

.bar_item_1 {
  width: 60%;
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  height: 6px;
  margin: 12px 15px 0 15px;
}

.new-buy-btn {
  position: absolute;
  left: 7%;
  background-color: #e03a2e;
  box-shadow: 3px 3px 13px #ac8b8a;
  color: #fff;
  font-weight: 700;
  flex-direction: column;
  border-radius: 5px;
  padding: 7px 2px;
  cursor: pointer;
  box-sizing: border-box;

  width: 86%;
  z-index: 1;
  font-style: italic;
  text-align: center;
  animation: area_bounce-data-v-4fb41cfa 2s ease-in infinite reverse;
  margin: 0 auto;
  bottom: 35px;
}

.new-buy-btn .new-buy-btn-footer,
.new-buy-btn .new-buy-btn-header {
  font-size: 13px;
}

.new-buy-btn .new-buy-btn-top {
  font-size: 24px;
  letter-spacing: 2px;
  padding-bottom: 3px;
  padding-top: 3px;
}

@keyframes area_bounce-data-v-4fb41cfa {
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.mbti_cont {
  padding-bottom: 0;

  .block {
    width: 100%;
    position: relative;

    img {
      width: 100%;
    }
  }

  .taro-scroll-view__scroll-y {
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .checkout-mb-desc {
    background: #f4f4f4;
    border-radius: 10px;
    border: 12px solid #f4f4f4;
    white-space: pre-wrap;
    font-size: 12px;
    line-height: 24px;
    color: #666;
    height: 200px;
    width: 96%;
    box-sizing: border-box;
    margin-left: 2%;
  }
}

.mbti_pay {
  margin-top: 0;
  padding: 15px;
  box-sizing: border-box;
  padding-bottom: 30px;
}

.mbti_pay .price_top {
  text-align: center;
}

.mbti_pay .price_top .p1,
.mbti_pay .price_top .p2 {
  color: #555;
  font-size: 12px;
  margin-bottom: 7px;
}

.block2 {
  color: #555 !important;
  font-size: 14px !important;
}

.mbti_pay .price_top .p1 span,
.mbti_pay .price_top .p2 span {
  color: red;
  font-size: 22px;
  font-weight: 300;
}

.mbti_pay .price_top {
  text-align: center;
}

.mbti_pay .price_top .p1 .yjzf,
.mbti_pay .price_top .p2 .yjzf {
  font-size: 13px;
}

.price_mid {
  margin-top: 15px;
}

.js_choose {
  display: flex;
  justify-content: space-around;
}

.wxzf {
  background-color: #07c160;
  width: 98%;
  margin: auto;
  border-radius: 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  .wxzf-img {
    width: 25px;
    height: 25px;
  }
}

.price_zf .p4 {
  text-align: center;
  color: #999;
  font-size: 11px;
  margin-top: 11px;
}

.new-price-rights-title {
  text-align: center;
  margin-top: 11px;
  margin-bottom: 11px;
  color: #c58c34;
}

.new-price-right-box {
  display: flex;
  flex-wrap: wrap;
}

.new-price-safe {
  text-align: center;
  margin-top: 20px;
}

.js_choose {
  display: flex;
  justify-content: space-around;
}

.js_choose .tab {
  width: 31%;
  border: 1px solid #ddd;
  border-radius: 6px;
  position: relative;
  padding: 6px;
  box-sizing: border-box;
  text-align: center;
  padding-top: 15px;
}

.js_choose .tab .p1 {
  font-size: 15px;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.js_choose .tab .p2 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.js_choose .tab .p3 {
  height: 80px;
  color: #999;
  font-size: 13px;
}

.js_choose .cur {
  border: 1px solid #edbf79;
  background: #fef6f0;
}

.new-discounts-tag {
  position: absolute;
  height: 20px;
  background: linear-gradient(180deg, #b66af0, #7c32cb 98%);
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  line-height: 20px;
  white-space: nowrap;
  padding-left: 5px;
  padding-right: 5px;
  top: -10px;
  right: 0;
}

.js_choose .tab .p2 span {
  font-size: 12px;
  text-decoration: line-through;
  font-weight: 400;
}

.new-price-rights-title {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #c58c34;
  font-size: 14px;
}

.new-price-right-box {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}

.new-price-safe {
  text-align: center;
  margin-top: 20px;
}

.ew-price-rights {
  font-size: 14px;
}

.new-price-safe .safe-top {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.new-price-right-box .new-price-right-item {
  width: 50%;
  display: flex;
  padding-left: 20px;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.new-price-right-box .new-price-right-item .right-icon {
  margin-right: 10px;
}

.new-price-safe .safe-txt {
  color: #5ec455;
  font-size: 12px;
  margin-top: 6px;
}

.through {
  color: #ccc;
  text-decoration: line-through;
}

.new-price-right-box .one-line {
  width: 100%;
}

.van-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
