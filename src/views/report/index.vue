<template>
  <template v-if="!error">
    <div v-if="!loading">
      <div
        class="report"
        :class="{
          gallup: reportInfo.duoweidu?.setting?.duo_weidu_type == 2,
        }"
      >
        <!-- 报告头   -->
        <ReportHead
          v-if="buttonVisible"
          :goods_sale_price_type="goods_sale_price_type"
          :testPaperInfo="testPaperInfo"
          :userInfo="userInfo"
          :testOrderInfo="testOrderInfo"
          :reportInfo="reportInfo"
          @handleReset="handleReset"
          @exportPtf="exportPtf"
          @handleGoErrorRecord="handleGoErrorRecord"
          @pushBaseUrl="pushBaseUrl"
          @handleGive="handleGive"
        >
        </ReportHead>

        <van-sticky v-if="!isWeChat && $route.query.from === 'vipOpened'">
          <div class="warning-bar">
            尊敬的vip用户，请关注公众号使用会员权益
            <span @click="handleFocusOn">关注</span>
          </div>
        </van-sticky>
        <div class="result-wrapper" ref="posterRef1">
          <div
            class="result"
            v-if="
              reportInfo.duoweidu &&
              reportInfo.duoweidu?.length !== 0 &&
              reportInfo.duoweidu?.setting?.duo_weidu_type == 2
            "
          >
            <!-- 盖洛普 -->
            <GLP :data="reportInfo" />
          </div>
          <!-- 结果内容区域 -->
          <div class="result" v-else>
            <!-- 总结果计分 -->
            <ZJGJF
              class="report-card"
              :data="reportInfo.total_result_scoring"
              v-if="
                reportInfo.total_result_scoring &&
                reportInfo.total_result_scoring?.length !== 0
              "
            />
            <!-- 总结果计分2 -->
            <ZJGJF
              class="report-card"
              :data="reportInfo.total_result_scoring2"
              v-if="
                reportInfo.total_result_scoring2 &&
                reportInfo?.total_result_scoring2?.length !== 0
              "
            />

            <!-- 无规则说明 -->
            <WGZSM
              class="report-card"
              :data="reportInfo.wuguize"
              v-if="reportInfo.wuguize && reportInfo.wuguize?.length !== 0"
            />

            <!-- 多维度网状 -->
            <DWDWZ
              class="report-card"
              :data="reportInfo.duoweidu_mesh"
              v-if="
                reportInfo.duoweidu_mesh &&
                reportInfo.duoweidu_mesh?.length !== 0
              "
            />
            <!-- 瑞文 -->

            <RW
              class="report-card"
              :data="reportInfo"
              v-if="
                (reportInfo?.ruiwen_ord &&
                  reportInfo.ruiwen_ord?.length !== 0) ||
                (reportInfo?.ruiwen_adv && reportInfo.ruiwen_adv?.length !== 0)
              "
            />

            <!-- 单维度 -->
            <WDS
              class="report-card"
              :data="reportInfo.danweidu"
              v-if="reportInfo.danweidu && reportInfo.danweidu?.length !== 0"
            />
            <!-- 多维度 -->
            <WDM
              class="report-card"
              :data="reportInfo.duoweidu"
              v-if="
                reportInfo.duoweidu &&
                reportInfo.duoweidu?.length !== 0 &&
                reportInfo.duoweidu?.setting?.duo_weidu_type == 1
              "
            />
            <!-- MBTI排列状 -->
            <!-- v-if="reportInfo.mbti_pl && reportInfo.mbti_pl?.length !== 0" -->
            <!--  -->
            <MBTIPLZ
              :data="reportInfo.mbti_pl"
              v-if="reportInfo.mbti_pl && reportInfo.mbti_pl?.length !== 0"
              :testOrderInfo="testOrderInfo"
              :sendCouponList="sendCouponList"
            />

            <!-- MBTI网状 -->
            <MBTIWZ
              class="report-card"
              :data="reportInfo.mbti_wz"
              v-if="reportInfo?.mbti_wz && reportInfo.mbti_wz?.length !== 0"
            />
            <!-- 计分排列题 -->
            <JFPLT
              class="report-card"
              :data="reportInfo.jifen_pl"
              v-if="reportInfo.jifen_pl && reportInfo.jifen_pl?.length !== 0"
            />

            <!-- 番外结果 -->
            <FWJG
              class="report-card"
              :data="reportInfo.fanone"
              v-if="reportInfo.fanone && reportInfo.fanone?.length !== 0"
            />
            <!-- 番外网状 -->
            <FWWZ
              class="report-card"
              :data="reportInfo.fantwo"
              v-if="reportInfo.fantwo && reportInfo.fantwo?.length !== 0"
            />
            <div
              class="bottom-rw report-card"
              v-if="
                reportInfo?.ruiwen_ord && reportInfo.ruiwen_ord?.length !== 0
              "
            >
              <LargeTitle
                :label="reportInfo.ruiwen_ord?.setting?.title2"
                :icon="reportInfo.ruiwen_ord?.setting?.title_icon_tag2"
              />

              <RichTextBody
                :data="reportInfo.ruiwen_ord?.ruiwenOrdInfo?.zhiye_tuijian"
              />

              <div class="list-box">
                <span
                  v-for="(item, index) in reportInfo.ruiwen_ord?.professionInfo
                    ?.job"
                  :key="index"
                >
                  {{ item }}</span
                >
              </div>

              <Warning
                :data="reportInfo.ruiwen_ord?.setting?.zhuyi2"
                title="注意事项"
                icon="fa vaaeq fa-bullhorn"
              />
            </div>
            <!-- 番外维度 -->
            <FWWD
              class="report-card"
              :data="reportInfo.fanthree"
              v-if="reportInfo.fanthree && reportInfo.fanthree?.length !== 0"
            />

            <!-- 多层分页建议 -->
            <DCFYJY
              :data="reportInfo.duocheng_page"
              v-if="
                reportInfo.duocheng_page &&
                reportInfo.duocheng_page?.length !== 0
              "
            />

            <div
              class="rw_report report-card"
              v-if="
                (reportInfo.ruiwen_ord?.length !== 0 ||
                  reportInfo.ruiwen_adv?.length !== 0) &&
                payStyleType3SendGoods.length !== 0 &&
                buttonVisible
              "
            >
              <div class="report_title">
                <div class="report_title_span1">
                  <i
                    class="fa fa-gift"
                    style="margin-right: 5px"
                  />您的测评套餐包含
                </div>
              </div>
              <div
                class="report_item wrongQuestion"
                v-if="
                  errorRecordShow && payStyleType3SendGoods.isShowCuoti == 1
                "
                @click="handleGoErrorRecord"
              >
                <div class="top_conter">
                  <div class="title">
                    <div class="baweijiedu2 wrongQuestion_title">
                      智商测试错题解析
                    </div>
                    <div class="baweijiedu3 wrongQuestion_center">
                      包含错题列表，正确选项和答题详解
                    </div>
                  </div>

                  <div class="bottom_conter bottom_jx">查看解析</div>
                </div>
              </div>
              <div
                class="report_item"
                v-for="(item, index) in payStyleType3SendGoods?.goodsList"
                key="index"
                :class="index == 0 ? 'advancedIntelligence' : 'qingshang'"
                @click="evaluation(item)"
              >
                <div class="top_conter">
                  <div class="title">
                    <div
                      class="baweijiedu2"
                      :class="
                        index == 0
                          ? 'advancedIntelligence_title'
                          : 'qingshang_title'
                      "
                    >
                      {{ item.goods_name }}
                    </div>
                    <div
                      class="baweijiedu3"
                      :class="
                        index == 0
                          ? 'advancedIntelligence_center'
                          : 'qingshang_center'
                      "
                    >
                      {{ item.goods_subtitle }}
                    </div>
                  </div>
                  <div
                    class="bottom_conter"
                    :class="index == 0 ? 'bottom_zs' : 'bottom_qs'"
                  >
                    开始测试
                  </div>
                </div>
              </div>
              <div class="report_title">
                <div class="report_title_span2">
                  <i class="fa fa-exclamation-circle"></i>
                  请先关注微信公众号，在公众号里可免费测试，公众号：{{
                    wechatConf?.name
                  }}
                </div>
              </div>
            </div>
            <!-- 扩展阅读 -->
            <KZYD
              class="report-card"
              :data="reportInfo.extend_read"
              v-if="
                reportInfo.extend_read && reportInfo.extend_read?.length !== 0
              "
              ref="posterRef6"
            />
          </div>

          <!-- 推荐区域 -->
          <div class="recommend" v-if="buttonVisible">
            <HeaderTitle plain title="猜你喜欢">
              <template #right>
                <span @click="$router.push('/classify')">
                  查看全部内容
                  <i class="fa fa-angle-double-right"></i>
                </span>
              </template>
            </HeaderTitle>
            <CellCardList
              :data="recommendList"
              :clickItem="handleClickGoodsItem"
            />
            <div class="button" @click="pushBaseUrl('/classify')">
              查看更多测评
              <van-icon name="arrow" />
            </div>
          </div>
          <!-- 评价 -->
          <!-- 暂时关闭 -->
          <div
            class="evaluation-content"
            v-show="false"
            v-if="(!hasComment || isWarning) && buttonVisible"
            ref="posterRef2"
          >
            <div class="has-comment" v-if="isWarning">
              谢谢您的反馈，您的建议我们已经收下
            </div>

            <template v-if="!hasComment">
              <div class="comment">
                <img class="icon" src="../../assets/images/comment.png" />
                <div class="title">您本次评测使用感受如何？</div>
                <div class="evaluation">
                  <div class="item">
                    <span>A 答题体验感：</span>
                    <van-rate v-model="form.experience" color="#FFD21E" />
                  </div>
                  <div class="item">
                    <span>B 结果准确度：</span>
                    <van-rate v-model="form.accuracy" color="#FFD21E" />
                  </div>
                  <div class="item">
                    <span>C 报告满意度：</span>
                    <van-rate v-model="form.satisfaction" color="#FFD21E" />
                  </div>
                  <div class="textarea">
                    <van-field
                      v-model="form.content"
                      rows="2"
                      autosize
                      type="textarea"
                      placeholder="其他建议反馈，可以写在这里"
                    />
                  </div>
                  <div class="button" @click="handleSubmitComment">提交</div>
                </div>
              </div>
            </template>
          </div>

          <!-- 公众号二维码 -->
          <!-- 暂时关闭 -->
          <div class="qr-content" v-show="false">
            <img :src="wechatConf?.wechat_qrcode" />
            <p>{{ wechatConf?.wechat_qrcode_desc }}</p>
          </div>
        </div>
      </div>

      <WeChatQr v-model:show="wechatQrVisible" :title="qrModalTexts.title">
        <template #subhead>
          <p
            class="subhead"
            :class="{
              'subhead-mini': qrModalTexts.subheadMini,
              'subhead-text': qrModalTexts.subheadText,
            }"
          >
            {{ qrModalTexts.subhead }}
          </p>
          <p
            class="subhead2"
            :class="{ 'subhead-mini': qrModalTexts.subheadMini }"
          >
            {{ qrModalTexts.subhead2 }}
          </p>
        </template>
        <span>{{ qrModalTexts.content }}</span>
        <template #button>
          <!-- <div class="popupButton"
            v-if="(reportInfo.ruiwen_ord?.length !== 0 || reportInfo.ruiwen_adv?.length !== 0) && goods_sale_price_type == 3"
            @click="close">点这里关注公众号去测试</div> -->
          <div
            class="popupButton"
            v-if="
              (reportInfo.ruiwen_ord?.length !== 0 ||
                reportInfo.ruiwen_adv?.length !== 0) &&
              goods_sale_price_type == 3
            "
            @click="close"
          >
            {{ qrModalTexts.buttonText }}
          </div>
          <div class="popupButton" v-else @click="close">我知道了</div>
        </template>
      </WeChatQr>

      <BaseDialog v-model:show="resetShow" :showConfirmButton="false">
        <div class="dialog-content">
          <div class="title">重测说明</div>
          <div class="text-content">
            重测后将生成一份新的报告，不会覆盖您当前的报告。当前订单显示最新报告，下面是重测记录。每个用户可以免费重测三次。
          </div>
          <div class="title">重测记录</div>

          <div
            class="report-item"
            v-for="(item, index) in resetOrderList"
            :key="index"
          >
            <div class="left">
              {{ $filters.formatDate(item.createTime)
              }}{{ index === 0 ? "初测" : "重测" }}
            </div>
            <div
              v-if="item.status === 2"
              class="right"
              @click="handleCheckReport(item)"
            >
              查看报告
            </div>
            <div v-else class="right continue" @click="handleContinue(item)">
              继续测试
            </div>
          </div>

          <div class="button" @click="handleResetConfirm">知道了，我要重测</div>
          <div class="button plain" @click="resetShow = false">不用了</div>
        </div>
      </BaseDialog>

      <!-- 赠送好友弹窗 -->
      <GiveFriendDialog v-model:show="giveVisible" @confirm="handleGiveConfirm">
        <div class="give-content">
          <div class="title">{{ testPaperInfo?.name }}</div>
          <div class="text">
            温馨提示：您是({{ vipInfo?.name }})，当前您享有{{
              vipInfo?.vipGiveLimit
            }}次免费赠送的权益，现在还剩{{
              vipInfo?.vipGiveLimit - vipInfo?.vipGiveNum
            }}次。
          </div>
        </div>
        <template #button>
          <span v-if="vipInfo?.vipGiveLimit > vipInfo?.vipGiveNum"
            >立即免费赠送</span
          >
          <span v-else>我知道了</span>
        </template>
      </GiveFriendDialog>

      <!-- 提示开通VIP -->
      <VipDialog v-model:show="vipOpenVisible">
        <template #title>
          <p class="dialog-title">赠送好友</p>
          <p class="goods-name">《{{ testPaperInfo?.name }}》</p>
        </template>
        <template #text>
          温馨提示：
          <span class="give-warning">您目前不是VIP会员，无法享受赠送权益</span>
        </template>
        <template #bottom>
          <div class="bottom-button">
            <div class="left button" @click="vipOpenVisible = false">关闭</div>
            <div class="right button" @click="$router.push('/vipOpened')">
              加入VIP
            </div>
          </div>
        </template>
      </VipDialog>

      <!-- <ToCustomer v-if="testPaperInfo?.customerUrl" :link="testPaperInfo?.customerUrl" /> -->

      <div
        class="float-right record"
        v-if="errorRecordShow && errorNum > 0 && buttonVisible"
        @click="handleGoErrorRecord"
      >
        <van-icon name="records" class="icon" />
        错题集
      </div>

      <div
        class="float-right gift"
        @click="handleGift"
        v-if="
          sendCouponList.length &&
          (reportInfo.mbti_pl?.length == 0 ||
            reportInfo.mbti_pl.setting.pl_type != 7) &&
          buttonVisible
        "
      >
        <van-icon name="point-gift-o" class="icon" />
        领取现金礼包
      </div>

      <div
        class="footer-bar"
        v-if="
          sendCouponList.length &&
          buttonVisible &&
          (reportInfo.ruiwen_ord?.length == 0 ||
            reportInfo.ruiwen_adv?.length == 0) &&
          payStyleType3SendGoods.length == 0
        "
      >
        <footer class="bar">
          <div class="item left" @click="handleGoodsCoupon">
            {{ goodsCoupon.coupon_title }}
          </div>
          <div class="item right" @click="handlVipCoupon">
            开通会员全程免费测
          </div>
        </footer>
        <div class="placeholder"></div>
      </div>

      <!-- 瑞文中档 -->
      <div
        class="bottomMenu"
        v-if="
          (reportInfo.ruiwen_ord?.length !== 0 ||
            reportInfo.ruiwen_adv?.length !== 0) &&
          goods_sale_price_type == 2 &&
          buttonVisible
        "
      >
        <div class="menu">
          <div
            class="menu-item1"
            v-if="payStyleType3SendGoods?.goodsList[0]"
            @click="evaluation(payStyleType3SendGoods?.goodsList[0])"
          >
            <img src="../../assets/images/zhishang.png" class="icon" />
            <span class="gaiji">瑞文高级智力测试</span>
          </div>
        </div>
        <div class="menu">
          <div class="menu-item4" @click="handleGoodsCoupon">
            <img src="../../assets/images/qinshang.png" class="icon" />
            <span class="qianshang">国际标准情商测试</span>
          </div>
        </div>
        <div class="menu">
          <div class="menu-item5" @click="handlVipCoupon">
            <img src="../../assets/images/jrvip.png" class="icon" />
            <span class="vipText">加入VIP免费测</span>
          </div>
        </div>
      </div>
      <!-- 瑞文高档 -->
      <div
        class="bottomMenu"
        v-if="
          (reportInfo.ruiwen_ord?.length !== 0 ||
            reportInfo.ruiwen_adv?.length !== 0) &&
          goods_sale_price_type == 3 &&
          buttonVisible
        "
      >
        <div class="menu">
          <div class="menu-item3" @click="handleGoErrorRecord">
            <img src="../../assets/images/cuoti.png" class="icon" />
            <span class="vipText">错题解析</span>
          </div>
        </div>
        <div class="menu">
          <div
            class="menu-item1"
            v-if="payStyleType3SendGoods?.goodsList[0]"
            @click="evaluation(payStyleType3SendGoods?.goodsList[0])"
          >
            <img src="../../assets/images/zhishang.png" class="icon" />
            <span class="gaiji">瑞文高级智力测试</span>
          </div>
        </div>
        <div class="menu">
          <div
            class="menu-item2"
            v-if="payStyleType3SendGoods?.goodsList[1]"
            @click="evaluation(payStyleType3SendGoods?.goodsList[1])"
          >
            <img src="../../assets/images/qinshang.png" class="icon" />
            <span class="qianshang">国际标准情商测试</span>
          </div>
        </div>
      </div>
      <!-- 版本选择 -->
      <OptionsSelect
        v-model:show="optionVisible"
        v-model:current="optionCurrent"
        :versionConfig="testPaperInfo?.versionConfig"
        @confirm="handleOptionConfirm"
      />
    </div>
  </template>

  <Error v-else>
    <template #footer>
      提示：如果多次刷新仍无法显示，可以关注公众号：{{
        wechatConf?.name
      }}，点击底部菜单我的测评，查看结果。
    </template>
  </Error>
</template>

<script>
import {
  computed,
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  nextTick,
  ref,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import ReportHead from "./components/ReportHead";

import CellCardList from "@/components/CellCardList";
import WeChatQr from "@/components/WeChatQr";
import VipDialog from "@/components/VipDialog";
import HeaderTitle from "@/components/HeaderTitle";
import GiveFriendDialog from "@/components/GiveFriendDialog";
import BaseDialog from "@/components/BaseDialog";
import { useAgent } from "@/hooks/useAgent";
import ZJGJF from "./typesComponents/ZJGJF";
import WDS from "./typesComponents/WD-S";
import WDM from "./typesComponents/WD-M";
import DWDWZ from "./typesComponents/DWDWZ";
import DCFYJY from "./typesComponents/DCFYJY";
import KZYD from "./typesComponents/KZYD"; // 扩展阅读
import JFPLT from "./typesComponents/JFPLT";
import WGZSM from "./typesComponents/WGZSM";
import FWJG from "./typesComponents/FWJG";
import FWWZ from "./typesComponents/FWWZ";
import FWWD from "./typesComponents/FWWD";
import RW from "./typesComponents/RW";
import MBTIPLZ from "./typesComponents/MBTIPLZ";
import MBTIWZ from "./typesComponents/MBTIWZ";

import { Toast } from "vant";
import { useStore } from "@/store";
import { debounce } from "lodash";
import { useEventListener } from "@/hooks/useEventListener";
import { useParams } from "@/hooks/useParams";
import { parseQueryString } from "@/utils/tools";
import ToCustomer from "@/views/detail/components/customer";
import CouponItem from "@/components/CouponItem";
import Error from "@/components/Error";
import { loadingToast } from "@/plugins/vant";
import qs from "qs";
import { isObject } from "lodash";

import GLP from "./template/gallup";
import OptionsSelect from "@/components/OptionsSelect";
import LargeTitle from "./components/LargeTitle";
import RichTextBody from "./components/RichTextBody";
import html2Canvas from "html2canvas";
import jsPDF from "jspdf";
// import { getPdf } from '@/utils/html2pdf.js'
import Canvas2Image from "@/utils/canvas2image.js";
import domtoimage from "dom-to-image";
import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";

import { queryPay, uploadResultImg } from "@/api/reportbak";
// api 接口
import { getRecommendList } from "@/api/app";
import {
  getReportInfo,
  reportCollect,
  reportComment,
  getAnswerQuestionInfo,
  updateReport,
} from "@/api/report";
import { give } from "@/api/give";
import { createResetTestOrder, getResetTestOrderList } from "@/api/testPaper";
import { checkTestOrderPay } from "@/api/order";

export default {
  name: "report",
  components: {
    ReportHead,
    CellCardList,
    HeaderTitle,
    WeChatQr,
    GiveFriendDialog,
    VipDialog,
    ZJGJF,
    WDS,
    WDM,
    DWDWZ,
    DCFYJY,
    KZYD,
    JFPLT,
    WGZSM,
    FWJG,
    FWWZ,
    FWWD,
    RW,
    MBTIPLZ,
    MBTIWZ,
    ToCustomer,
    CouponItem,
    Error,
    BaseDialog,
    GLP,
    OptionsSelect,
    LargeTitle,
    RichTextBody,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { isWeChat, isMobile, ua, network, os, md } = useAgent();
    const wechatConf = computed(() => store.getters.wechatInfo || {});
    const isAdmin = computed(() => route.path === "/report-admin");
    const posterRef1 = ref(null);
    const posterRef2 = ref(null);
    const posterRef3 = ref(null);
    const posterRef4 = ref(null);
    const posterRef5 = ref(null);
    const posterRef6 = ref(null);
    const state = reactive({
      form: {
        experience: 0,
        accuracy: 0,
        satisfaction: 0,
        content: "",
      },
      testPaperInfo: {}, // 测评详情数据
      testOrderInfo: {}, // 测评订单信息
      promotionInfo: {},
      recommendList: [], // 推荐测评
      customerServiceLink: "", // 客服链接

      buttonVisible: true,
      vipOpenVisible: false, // 开通VIP
      resetOrderList: [], // 重测订单列表
      show: false,

      wechatQrVisible: false, // 收藏弹窗
      qrModalTexts: {
        title: "",
        content: "",
      },
      exprotImg: "",
      // 智商三档
      goods_sale_price_type: 0,
      // 数据是否加载中
      loading: false,
      error: false, // 是否加载失败

      resetShow: false, // 重测弹窗
      giveVisible: false, // 赠送弹窗
      testOrderId: "",
      paper_order_sn2: "",
      hasComment: null, // 是否已经评论
      errorRecordShow: false, //是否展示错题解析跳转按钮
      errorNum: 0, // 错题数量
      vipCoupon: {}, // 会员开通优惠券信息
      goodsCoupon: {}, //商品优惠券信息
      sendCouponList: [],
      payStyleType3SendGoods: [], //
      isWarning: false, //提示关注公众号 显示隐藏
      // 当前版本选择的id
      optionCurrent: undefined,
      reportInfo: {
        // 结果数据
        danweidu: [],
        duocheng_page: [],
        duoweidu: [],
        duoweidu_mesh: [],
        extend_read: [],
        fanone: [],
        fanthree: [],
        fantwo: [],
        jifen_pl: [],
        mbti_pl: [],
        mbti_wz: [],
        ruiwen_adv: [],
        ruiwen_ord: [],
        total_result_scoring: {}, // 总积分结果
        wuguize: [],
        mbti_pl_id: 0,
      },
      // 版本选择显示隐藏
      optionVisible: false,
      optionVisible2: false,
      pnHeight: 0,
      vipInfo: {},
    });

    const userInfo = computed(() => store.getters.userInfo);
    const { testOrderId, testPaperId, promotionId, shareCode } = route.query;

    state.testOrderId = testOrderId;
    if (testOrderId) {
      window.localStorage.setItem(`testPaperId_${testPaperId}`, testOrderId);
    }
    const { sendParams } = useParams();
    // 获取错题记录
    async function initErrorRecord() {
      if (state.errorRecordShow) {
        // 获取错题数量
        const { questionList } = await getAnswerQuestionInfo({
          testOrderId: state.testOrderId,
          onlyError: 1,
        });
        state.errorNum = questionList.length;
      }
    }
    onMounted(async () => {
      window.createOrderLoading?.clear();
      window.createOrderLoading = null;
      loadRecommendList(); // 加载热门推荐
      await init(testOrderId);
      initErrorRecord(); // 获取错题数量
      onReadReport(); // 阅读当前结果
      nextTick(() => {
        // 操作js
        onOperationDom();
      });
    });
    // const baseUrl1 = url1?.endsWith("/") ? url1.slice(0, -1) : baseUrl;
    function pushBaseUrl(data) {
      // 获取当前页面域名
      const url = window.location.origin + "/";
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

    // 操作dom元素
    function onOperationDom() {
      nextTick(() => {
        const tabItemList = document.querySelectorAll(".xl-b15 span");
        const tabContentList = document.querySelectorAll(".xl-b15m .xl-b15box");

        [...tabItemList].map((item, index) => {
          item.addEventListener("click", () => {
            // 设置tab样式
            [...tabItemList].map((el) => el.classList.remove("on"));
            item.classList.add("on");
            // 设置tab内容样式
            [...tabContentList].map(() => {
              [...tabContentList].map((el) => el?.classList?.remove("on"));
              tabContentList[index]?.classList?.add("on");
            });
          });
        });
      });
    }

    // 获取推荐测评
    async function loadRecommendList() {
      const { list } = await getRecommendList({ testOrderId });
      state.recommendList = list;
    }

    // 获取报告详情
    async function init(testOrderId) {
      state.loading = true;
      const loading = loadingToast("加载中...");
      // const api = isAdmin.value ? reportInfo : reportInfo;
      try {
        const {
          promotionInfo,
          testPaperInfo,
          testOrderInfo,
          reportInfo,
          customerServiceLink,
          sendCouponList,
          payStyleType3SendGoods,
          goods_sale_price_type,
          hasComment,
          vipInfo,
        } = await getReportInfo({ testOrderId });

        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", testPaperInfo.name);
        state.errorRecordShow = Number(reportInfo?.cuoti_jiexi?.is_show) === 1;
        state.vipInfo = vipInfo;
        state.testPaperInfo = testPaperInfo;
        state.reportInfo = reportInfo;
        state.testOrderInfo = testOrderInfo;
        state.promotionInfo = promotionInfo;
        state.hasComment = hasComment; // 是否评论
        state.payStyleType3SendGoods = payStyleType3SendGoods;
        state.goods_sale_price_type = goods_sale_price_type;
        state.customerServiceLink = customerServiceLink;
        document.title = testPaperInfo.name;

        // ww 注释
        // state.exprotImg = paper_order_common?.paper_result_img;

        // 优惠券内容
        if (sendCouponList?.length) {
          state.sendCouponList = sendCouponList;
          const [goodsCoupon, vipCoupon] = sendCouponList;
          if (goodsCoupon) {
            state.goodsCoupon = { ...goodsCoupon, ...goodsCoupon.coupon };
          }
          if (vipCoupon) {
            state.vipCoupon = { ...vipCoupon, ...vipCoupon.coupon };
          }
        }

        onSendparams({
          testOrderInfo,
          promotionInfo,
        });
      } catch (error) {
        window.__bl?.api(
          "结果页加载失败",
          false,
          0,
          "error",
          `加载失败:${error}`
        );
        state.error = true;
        goDetail();
      } finally {
        state.loading = false;
        loading.clear();
      }
    }
    // 修改报告状态，设置为已读
    async function onReadReport() {
      if (!state.reportInfo.is_read_result) {
        await updateReport({ testOrderId });
        state.reportInfo.is_read_result = 1;
      }
    }

    // 发送参数的处理
    async function onSendparams({ testOrderInfo, promotionInfo }) {
      try {
        await sendParams(4, {
          testOrderId,
        });
      } catch (error) {
        console.log("参数发送失败：", error);
      }
    }

    // 跳转商品详情页
    function goDetail() {
      if (testPaperId || promotionId) {
        router.replace({
          path: "/detail",
          query: {
            testPaperId,
            promotionId,
          },
        });
      } else {
        router.replace("/");
      }
    }

    // 收藏
    async function handleCollect() {
      if (!isWeChat) {
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "微信扫码关注公众号",
          subhead: "可收藏本次测评，永久查看",
          content: `公众号名称：${wechatConf.value.name}`,
        };
        return;
      }
      try {
        await reportCollect({ testOrderId });
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "测试结果已收藏",
          subhead: null,
          content: "扫码关注公众号查看收藏记录",
        };
      } catch (error) {}
    }

    // 版本选择确定按钮
    function handleOptionConfirm() {
      createNewTestOrder();
    }
    // 创建新订单
    async function createNewTestOrder() {
      const { width, height } = window.screen;
      const deviceInfo = {
        phoneModel: "",
        browserVersion: ua,
        screenResolution: `${width}*${height}`,
        network,
        useEnv: isWeChat ? 1 : 2,
      };
      if (os == "iOS") {
        //ios系统的处理
        deviceInfo.phoneModel = md.os() + md.version("iPhone");
      } else if (os == "AndroidOS") {
        // Android系统的处理
        deviceInfo.phoneModel = md.os() + md.version("Android");
      }
      try {
        // 创建测试
        const { testOrderId } = await createTestOrder({
          testPaperId: state.versionData?.guid,
          ...deviceInfo,
          version: state.optionCurrent,
          shareCode: shareCode,
        });
        state.paper_order_sn2 = testOrderId;
        setTimeout(() => {
          // 延时3秒后跳转
          goExam2(state.versionData);
        }, 500);
      } catch (error) {
        console.log(error);
      }
    }
    // 测评
    async function evaluation(item) {
      if (isWeChat) {
        goExam2(item);
        return;
      }
      // window.location.href = state.customerServiceLink
      try {
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "温馨提示",
          subhead: "您享有免费测试该专业测评的权益",
          subhead2: "为保障您的权益，需关注公众号后免费测试。",
          content: `公众号名称：${wechatConf.value.name}`,
          buttonText: "点这里关注公众号去测试",
          subheadText: true,
        };
      } catch (error) {}
    }
    // 评论
    async function handleSubmitComment() {
      const { experience, accuracy, satisfaction, content } = state.form;
      if (!experience) return Toast("请选择答题体验感");
      if (!accuracy) return Toast("请选择结果准确度");
      if (!satisfaction) return Toast("请选择报告满意度");
      if (!content) return Toast("请输入意见或建议");
      try {
        await reportComment({ ...state.form, testOrderId });
        state.hasComment = 1;
        state.isWarning = true;
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "感谢你的反馈",
          subhead:
            "我们认真考虑您的建议并持续改进产品，请您务必扫码关注公众号，以便接受我们给您的消息回复。",
          content: null,
          subheadMini: true,
        };
      } catch (error) {}
    }
    function close() {
      if (
        (state.reportInfo.ruiwen_ord?.length !== 0 ||
          state.reportInfo.ruiwen_adv?.length !== 0) &&
        state.goods_sale_price_type == 3
      ) {
        window.location.href = state.customerServiceLink;
      } else {
        state.wechatQrVisible = false;
      }
    }
    // 重测
    async function handleReset() {
      if (!isWeChat) {
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "微信扫码关注公众号",
          subhead: "可免费重测三次，并随时查看你的报告",
          content: `公众号名称：${wechatConf.value.name}`,
          buttonText: "点这里关注公众号享受权益",
        };
        return;
      }
      const { list } = await getResetTestOrderList({ testOrderId });
      state.resetOrderList = list;
      state.resetShow = true;
    }
    async function handleReset2() {
      if (!isWeChat) {
        if (
          state.reportInfo.ruiwen_ord?.length !== 0 &&
          state.goods_sale_price_type == 3
        ) {
          window.location.href = state.customerServiceLink;
        } else {
          handleReset();
        }
        return;
      }
      const { data } = await resetOrderList({ testOrderId });
      state.resetOrderList = data;
      state.resetShow = true;
    }
    // 确认重测
    async function handleResetConfirm() {
      if (state.resetOrderList.length >= 4) {
        return Toast("重测次数已用完");
      }
      try {
        const { testOrderId } = await createResetTestOrder({
          testOrderId: route.query.testOrderId,
        });
        state.testOrderId = testOrderId;
        goExam();
      } catch (error) {
        const message = error.message ?? error;
        Toast(message);
      }
    }

    // 继续测试
    function handleContinue(item) {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: item.id,
            testPaperId,
            promotionId,
            type: "reset",
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: item.id,
            testPaperId,
            promotionId,
            type: "reset",
          },
        });
      }
    }
    // 跳转做题页
    function goExam2(item) {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        if (item.testOrderId) {
          router.push({
            path: "/report",
            query: {
              testOrderId: item.testOrderId,
              testPaperId: item.id,
            },
          });
        } else {
          router.push({
            path: "/exam2",
            query: {
              testPaperId: item.id,
              // testOrderId: state.paper_order_sn2,
            },
          });
        }
      } else {
        if (item.testOrderId) {
          router.push({
            path: "/report",
            query: {
              testOrderId: item.testOrderId,
              testPaperId: item.id,
            },
          });
        } else {
          router.push({
            path: "/exam",
            query: {
              testPaperId: item.id,
              // testOrderId: state.testOrderId,
            },
          });
        }
      }
    }

    // 导出PDF
    function downloadPDF2() {
      const loading = loadingToast("文件下载中...");
      state.buttonVisible = false;
      let name = state.testPaperInfo.name + "报告";
      setTimeout(function () {
        let content_html = document.getElementById("pia");
        let scale = 2;
        let opts = {
          scrollY: 0,
          scrollX: 0,
          scale: 2,
          background: "#fff",
          dpi: 192, //导出pdf清晰度
          useCORS: true,
        };
        html2Canvas(content_html, opts).then((canvas) => {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;
          // 一页pdf显示html页面生成的canvas高度;
          var pageHeight = (contentWidth / 592.28) * 841.89;
          // 未生成pdf的html页面高度
          var leftHeight = contentHeight;
          // pdf页面偏移
          var position = 0;
          // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
          var imgWidth = 595.28;
          var imgHeight = (592.28 / contentWidth) * contentHeight;
          var pageData = canvas.toDataURL("image/jpeg", 1.0);
          var pdf = new jsPDF("", "pt", "a4");
          // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          // 当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                // 避免添加空白页
                pdf.addPage();
              }
            }
          }
          pdf.save(`${name}.pdf`);
          loading.close();
          state.buttonVisible = true;
        });
      }, 500);
    }

    function exportPtf() {
      if (isWeChat) {
        // downloadPDF();
        // shotPic();
        captureScreenshot();
        // downloadImg('pia','报告')
        return;
      }
      try {
        state.wechatQrVisible = true;
        state.qrModalTexts = {
          title: "下载报告",
          subhead: "请先关注微信公众号，在公众号内进入结果页面，可免费下载报告",
          content: `公众号名称：${wechatConf.value.name}`,
          buttonText: "点这里关注公众号去下载",
          subheadText: true,
        };
      } catch (error) {}
    }
    function downloadPDF() {}

    function downloadImg(params, name) {
      let cntElem = document.getElementById("pia");
      let shareContent = cntElem;
      let width = shareContent.offsetWidth;
      let height = shareContent.offsetHeight;
      let canvas = document.createElement("canvas");
      var scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.getContext("2d").scale(scale, scale);
      const ops = {
        scale: scale,
        width: width,
        height: height,
        // 跨域配置
        useCORS: true, // 使用跨域
        allowTaint: true, // 允许使用跨域资源
        tainTest: false,
        backgroundColor: null,
      };
      html2Canvas(shareContent, ops).then((canvas) => {
        let context = canvas.getContext("2d");
        console.log(
          "%c [ context ]-1361",
          "font-size:13px; background:pink; color:#bf2c9f;",
          context
        );
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.ImgSmoothingEnabled = false;
        // 保存图片，可以保存PNG，JPEG等，调用对应api即可
        Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height, name);
      });
    }

    // 将base64字符串转换为Blob对象
    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    function captureScreenshot() {
      state.buttonVisible = false;
      // const element = document.getElementById("pia"); // 替换为你要截屏的页面元素的选择器
      const element1 = posterRef1.value; // 替换为你要截屏的页面元素的选择器
      const element2 = posterRef2.value; // 替换为你要截屏的页面元素的选择器
      const h = parseInt(window.getComputedStyle(element2).height);
      // state.pnHeight = h
      // console.log('%c [ h ]-1381', 'font-size:13px; background:pink; color:#bf2c9f;', h)
      if (state.exprotImg) {
        // ww 注释20240220
        // router.push({
        //   path: "/downloadImage",
        //   query: {
        //     testOrderId: state.testOrderId,
        //     img: state.exprotImg,
        //     name: state.goodsInfo.goods_name + '报告'
        //   },
        // });
      } else {
        getElementContent(element1, "报告");
      }
      // getElementContent(element1, '报告')
    }

    function getElementContent(elementId, imgName) {
      // const loading = loadingToast("文件下载中...");
      window.loading = loadingToast("文件下载中...");
      let h =
        parseInt(window.getComputedStyle(elementId).height) - state.pnHeight;
      let w = parseInt(window.getComputedStyle(elementId).width);

      // console.log('%c [  ]-1512', 'font-size:13px; background:pink; color:#bf2c9f;', h, parseInt(window.getComputedStyle(elementId).height))
      elementId.style.height = h + "px";
      elementId.style.width = w + "px";
      let name = state.testPaperInfo.name + "报告";
      setTimeout(function () {
        new html2Canvas(elementId, {
          //关键在于new
          useCORS: true,
          removeContainer: true,
          allowTaint: false,
          // imageTimeout: 5000, //默认0没有限制
          scale: 1,
          dpi: 30,
          width: 428,
          x: (w - 428) / 2, // 设置内容的水平偏移量
          y: 0, // 设置内容的垂直偏移量
          // windowWidth: document.body.scrollWidth,
          scrollX: 0,
          scrollY: 0,
        })
          .then((canvas) => {
            // console.log('截图中')
            let dataURL = canvas.toDataURL("image/png");
            dataURL = dataURL.replace(/[\r\n]/g, "");
            downloadImage(dataURL, imgName);
            // loading.close()
            elementId.style.width = w + "px";
            // state.exprotImg = dataURL
            // state.show = true
          })
          .catch(function (error) {
            // console.log('%c [ error ]-1661', 'font-size:13px; background:pink; color:#bf2c9f;', error)
            // 处理错误
            window.loading?.close?.();
            Toast("网络中断请重新下载");
            state.buttonVisible = true;
          });
      }, 500);
    }
    function shotPic() {
      window.loading = loadingToast("文件下载中...");
      const node = posterRef1.value; // 通过id获取dom
      // let w = parseInt(window.getComputedStyle(node).width)
      // node.style.width = w + 'px'
      console.log(node, "node");
      domtoimage
        .toPng(node, {})
        .then((dataUrl) => {
          console.log(
            "%c [ dataUrl ]-1598",
            "font-size:13px; background:pink; color:#bf2c9f;",
            dataUrl
          );
          //输出图片的Base64,dataUrl
          // 下载到PC
          const a = document.createElement("a"); // 生成一个a元素
          const event = new MouseEvent("click"); // 创建一个单击事件
          a.download = state.testPaperInfo.name + "报告"; // 设置图片名称没有设置则为默认
          a.href = dataUrl; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
          window.loading?.close?.();
        })
        .catch(function (error) {
          Toast("网络中断请重新下载");
          state.buttonVisible = true;
          console.error("oops, something went wrong!", error);
        });
    }
    async function downloadImage(url, name) {
      // state.exprotImg = image
      // const blob = dataURLtoBlob(image);
      // const url = URL.createObjectURL(blob);
      try {
        const { data } = await uploadResultImg({
          base64Img: url,
          testOrderId: state.testOrderId,
        });
        state.exprotImg = data?.paper_result_img;
        window.loading?.close?.();
        // ww注释20240420
        // router.push({
        //   path: "/downloadImage",
        //   query: {
        //     testOrderId: state.testOrderId,
        //     img: state.exprotImg,
        //     name: state.goodsInfo.goods_name + '报告'
        //   },
        // });
      } catch (error) {
        window.loading?.close?.();
        Toast("网络中断请重新下载");
        state.buttonVisible = true;
      }
    }
    // 跳转做题页
    function goExam() {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: state.testOrderId,
            testPaperId,
            promotionId,
            type: "reset",
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: state.testOrderId,
            testPaperId,
            promotionId,
            type: "reset",
          },
        });
      }
    }

    // 查看报告
    async function handleCheckReport(item) {
      state.resetShow = false;
      state.testOrderId = item.id;
      await init(item.id);
      initErrorRecord();
    }
    // 免费赠送
    async function handleGive() {
      if (!isWeChat) {
        state.wechatQrVisible = true;
        // console.log('%c [ userInfo ]-584', 'font-size:13px; background:pink; color:#bf2c9f;', userInfo.value)
        state.qrModalTexts = {
          title: "微信扫码关注公众号",
          subhead: "开通VIP可赠送好友免费测",
          content: `公众号名称：${wechatConf.value.name}`,
        };
      } else {
        if (!state.vipInfo?.name) {
          state.vipOpenVisible = true;
        } else {
          state.giveVisible = true;
        }
      }
    }
    // 赠送确认
    async function handleGiveConfirm() {
      if (state.vipInfo?.vipGiveLimit - state.vipInfo?.vipGiveNum <= 0) {
        state.giveVisible = false;
        return;
      }
      try {
        const { giveId } = await give({
          testPaperId,
        });
        state.giveVisible = false;
        router.push({
          path: "/giveDetail",
          query: {
            giveId,
          },
        });
        await store.dispatch("user/getUserInfo");
      } catch (error) {}
    }

    // 关注按钮
    function handleFocusOn() {
      state.wechatQrVisible = true;
      state.qrModalTexts = {
        title: "请扫描关注公众号",
        content: "关注公众号后使用VIP权益",
      };
    }

    async function handleGoErrorRecord() {
      if (state.vipInfo?.id) {
        return pushBaseUrl({
          path: "/errorRecord",
          query: { testOrderId: state.testOrderId },
        });
      }

      const loading = loadingToast("加载中...");
      try {
        const { needPay } = await checkTestOrderPay({
          testOrderId: state.testOrderId,
        });
        loading.clear();
        if (needPay === 0) {
          pushBaseUrl({
            path: "/errorRecord",
            query: { testOrderId: state.testOrderId, testPaperId, promotionId },
          });
        } else if (needPay === 2) {
          Toast("当前订单已退款");
        } else {
          // ww 注释20240420
          // pushBaseUrl({
          //   path: "/errorRecordPay",
          //   query: {
          //     testOrderId: state.testOrderId,
          //     coupon_code: state.vipCoupon.code,
          //   },
          // });
        }
      } catch (error) {
        loading.clear();
      }
    }
    function handleGift() {
      // ww 注释20240420
      // pushBaseUrl({
      //   path: "/reportCoupon",
      //   query: {
      //     testOrderId: state.testOrderId,
      //     coupon_code: state.vipCoupon.code,
      //   },
      // });
    }

    function handleGoodsCoupon() {
      const [goods] = state.goodsCoupon.goods_ids;
      if (!goods) {
        return Toast("获取商品信息失败");
      }
      pushBaseUrl({
        path: "/detail",
        query: {
          testPaperId: testPaperInfo.id,
          couponId: state.goodsCoupon.code,
        },
      });
    }
    function handlVipCoupon() {
      pushBaseUrl({
        path: "/vipOpened",
        query: {
          couponId: state.vipCoupon.code,
        },
      });
    }

    function handleClickGoodsItem({ id }) {
      pushBaseUrl({
        path: "/detail",
        query: {
          testPaperId: id,
        },
      });
    }

    return {
      ...toRefs(state),
      handleCollect,
      handleSubmitComment,
      handleReset,
      handleReset2,
      handleGive,
      handleGiveConfirm,
      handleResetConfirm,
      handleCheckReport,
      handleContinue,
      handleFocusOn,
      userInfo,
      wechatConf,
      isWeChat,
      isMobile,
      // handleScrollTo,
      handleGoErrorRecord,
      handleGift,
      handleGoodsCoupon,
      handlVipCoupon,
      onReadReport,
      handleClickGoodsItem,
      pushBaseUrl,
      evaluation,
      handleOptionConfirm,
      downloadPDF,
      exportPtf,
      posterRef1,
      posterRef2,
      close,
      // posterRef3,
      // posterRef4,
      // posterRef5,
      // posterRef6,
    };
  },
};
//选项卡原生js
</script>
<style lang="less">
@import "./styles/report.less";
</style>
<style lang="less" scoped>
#pia {
  // width: 375px;
  // height: 1531px;
}

.record-top-fixed {
  height: 36px;
  position: fixed;
  width: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  line-height: 36px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media screen and (min-width: @max-device-width) {
    width: @max-device-width;
  }

  .icon {
    font-size: 16px;
  }
}

.float-right {
  margin-right: -10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px 0 0 4px;
  position: fixed;
  right: calc((100vw - 375px) / 2);
  width: 20px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  padding: 6px 3px;
  box-sizing: content-box;
  box-shadow: 0px 0px 4px #e8e8e8;

  &.record {
    top: 36vh;
  }

  &.gift {
    top: 65vh;
  }

  .icon {
    font-size: 16px;
    margin-bottom: 3px;
  }
}

.footer-bar {
  z-index: 9;

  .placeholder {
    height: 78px;
    padding-bottom: constant(safe-area-inset-bottom);
    /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);
    /* 兼容 iOS >= 11.2 */
    box-sizing: content-box;
  }

  .bar {
    .fixed-bottom();
    z-index: 999999;
    height: 78px;
    font-size: 12px;
    display: flex;
    color: rgba(122, 122, 122, 1);
    // background-color: #fff;
    // border-top: 1px solid rgba(224, 224, 224, 1);
    background: transparent;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .item {
      width: 164px;
      height: 36px;
      font-size: 12px;
      color: #fff;
      line-height: 36px;
      text-align: center;

      &.left {
        background-color: #25b26d;
        margin-right: 12px;
      }

      &.right {
        background-color: #d43030;
      }
    }
  }
}

.footer-bar2 {
  z-index: 9;

  .placeholder {
    height: 78px;
    padding-bottom: constant(safe-area-inset-bottom);
    /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);
    /* 兼容 iOS >= 11.2 */
    box-sizing: content-box;
  }

  .bar {
    .fixed-bottom();
    z-index: 999999;
    height: 78px;
    font-size: 12px;
    display: flex;
    color: rgba(122, 122, 122, 1);
    // background-color: #fff;
    // border-top: 1px solid rgba(224, 224, 224, 1);
    background: transparent;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .item {
      width: 164px;
      height: 36px;
      font-size: 12px;
      color: #fff;
      line-height: 36px;
      text-align: center;
      border-radius: 30px;

      &.left {
        background-color: #4caf50;
        margin-right: 12px;
      }

      &.right {
        background-color: #f44336;
      }
    }
  }
}

.subhead {
  font-size: 16px;
  color: @theme-color;

  &.subhead-mini {
    font-size: 15px;
    line-height: 25px;
    color: @light-black;
    text-align: center;
  }

  &.subhead-text {
    font-size: 18px;
    text-align: center;
    margin: 10px 0 5px;
  }
}

.subhead2 {
  font-size: 16px;
  color: #000;

  &.subhead-mini {
    font-size: 15px;
    line-height: 25px;
    color: @light-black;
    text-align: center;
  }

  &.subhead-text {
    font-size: 18px;
    text-align: center;
    margin: 10px 0 5px;
  }
}

.dialog-title {
  text-align: center;
  font-size: 20px;
}

.goods-name {
  text-align: center;
  font-size: 18px;
  padding-top: @padding-base;
  color: @light-black;
}

.give-warning {
  color: #ff485d;
}

.bottom-button {
  display: flex;

  .button {
    height: 30px !important;
    line-height: 30px !important;
    width: 120px !important;

    &.left {
      color: #fff;
      background-color: @theme-color;
    }

    &.right {
      color: #fff;
      background-color: #ff485d;
      border-color: #ffd427;
    }
  }
}

.warning-bar {
  background-color: #fff9d0;
  font-size: @font-size-base;
  height: 35px;
  padding: 0 @padding-sm;
  color: @light-black;
  .space-between();
  .align-center();

  span {
    border-radius: 3px;
    border: 1px solid @gray-color;
    font-size: 10px;
    padding: 3px 10px;
  }
}

.report {
  // 报告背景颜色! 不要修改
  background: #e4f0ff;
  // font-family: Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', STXihei, 'Microsoft YaHei', SimHei;

  .gradient-header {
    background: linear-gradient(
      90deg,
      rgba(255, 236, 210, 1) 0%,
      rgba(249, 225, 189, 1) 100%
    );
    padding: 16px 16px 30px 16px;

    .title {
      font-weight: bold;
      font-size: 18px;
    }

    .time {
      color: #787a7b;
      font-size: 14px;
      padding: 10px 0;
      line-height: 22px;
    }

    .button-list {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .button-item {
        border-radius: 4px;
        background-color: #f28b74;
        padding: 0 12px;

        height: 30px;
        color: #fff;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }

      .button-wight {
        padding: 0 30px;
      }
    }
  }

  .header {
    height: 70px;
    padding: @padding-sm 0;
    text-align: center;
    font-size: @font-size-sm;
    .column-space-between();

    .time {
      font-weight: bold;
    }

    .options {
      padding: 0 50px;
      .space-between();
      font-size: @font-size-base;

      .icon {
        color: @theme-color;
        font-size: @font-size-lg;
      }
    }
  }

  .recommend {
    padding: @padding-base;
    background-color: #fff;

    .button {
      font-size: @font-size-base;
      height: 45px;
      line-height: 45px;
      color: @theme-color;
      border-radius: 6px;
      border: 1px solid #f2f2f2;
      width: 100%;
      text-align: center;
      //
    }
  }

  .evaluation-content {
    // margin-top: @padding-base;
    border-top: 15px solid #ebebeb;
    background-color: #fff;
    padding: 20px @padding-base;
    font-size: 13px;

    .comment {
      margin-top: 20px;
      background-color: #f5f5f5;
      border-radius: 10px;
      border: 1px solid #f9d7e8;
      position: relative;
      padding-top: 20px;

      .icon {
        position: absolute;
        width: 54px;
        height: 54px;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 0;
      }

      .title {
        font-size: 16px;
        padding: @padding-base 0;
        text-align: center;
      }

      .evaluation {
        padding: 0 40px;
      }

      .item {
        line-height: 30px;
        font-size: 14px;

        span {
          padding: 0 8px;
        }

        :deep(.van-rate__icon) {
          font-size: 17px;
        }
      }

      .textarea {
        font-size: @font-size-sm;
        border: 1px solid #e2e2e2;
        border-radius: 5px;
        padding: 5px;
        margin-top: 10px;
        background-color: #ededed;

        :deep(.van-field__control) {
          background-color: #ededed;
          height: 54px !important;
        }
      }

      .button {
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        background-color: @theme-color;
        color: #fff;
        text-align: center;
        font-size: 12px;
        margin: 20px 0;
      }
    }

    .has-comment {
      text-align: center;
      color: @light-black;
    }
  }

  .qr-content {
    padding: 40px 0;
    text-align: center;
    background-color: #fff;
    border-top: 15px solid #ebebeb;
    margin-bottom: 50px;

    img {
      width: 136px;
      pointer-events: auto;
    }

    p {
      font-size: @font-size-sm;
      padding-top: @padding-base;
    }
  }
}

.dialog-content {
  padding: @padding-base 20px;
  font-size: @font-size-base;
  position: relative;

  .text-content {
    line-height: 25px;
  }

  .button {
    width: 100%;
    height: 40px;
    border-radius: 40px;
    background-color: #fff;
    color: @theme-color;
    border: 1px solid @theme-color;
    line-height: 40px;
    text-align: center;
    margin: 10px auto;
  }

  .plain {
    border: none;
    color: #000;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    padding: @padding-base 0;
  }

  .report-item {
    .space-between();
    padding: 5px 0;

    .right {
      color: @theme-color;

      &.continue {
        color: #5353f4;
      }
    }
  }
}

.rw_report {
  padding: 20px 17px;
  margin: 0 0 20px 0;
  background: #fff;

  .report_title {
    text-align: center;

    .report_title_span1 {
      color: #000;
      font-size: 22px;
      font-weight: 700;
      padding-bottom: 15px;
    }

    .report_title_span2 {
      color: rgba(110, 110, 110, 1);
      font-size: 14px;
      margin: 11px 0 28px 0;
      line-height: 22px;
      text-align: left;
    }
  }

  .wrongQuestion {
    background: url("../../assets/images/wrongQuestion.png") no-repeat;
    background-size: 100% 100%;
  }

  .wrongQuestion_title {
    color: #008540;
  }

  .wrongQuestion_center {
    color: #008540c7;
  }

  .advancedIntelligence {
    background: url("../../assets/images/advancedIntelligence.png") no-repeat;
    background-size: 100% 100%;
  }

  .advancedIntelligence_title {
    color: #1882d6;
  }

  .advancedIntelligence_center {
    color: #1882d6cf;
  }

  .qingshang {
    background: url("../../assets/images/qingshang.png") no-repeat;
    background-size: 100% 100%;
  }

  .qingshang_title {
    color: #da3aa3;
  }

  .qingshang_center {
    color: #da3aa3cc;
  }

  .report_item {
    width: 100%;
    // background-color: #f1f0f5;
    border-radius: 0.256rem;
    margin-bottom: 0.42667rem;
    height: 120px;

    .top_conter {
      // padding-top: 15px;
      // padding-bottom: 15px;
      margin-left: 20px;

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
        font-size: 12px;
        width: 65%;
        height: 30px;
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
        // width: 60%;
        // height: 60px;
      }
    }

    .bottom_conter {
      // margin: 0 10px;
      // border-top: 1px solid #d6d6d6;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      height: 35px;
      line-height: 35px;
      font-size: 14.5px;
      font-weight: 400;
      text-align: center;
      width: 130px;
      border-radius: 35px;
      color: #fff;
    }

    .bottom_jx {
      //渐变背景色
      background: linear-gradient(90deg, #089f4e 0%, #33b281 100%);
    }

    .bottom_zs {
      //渐变背景色
      background: linear-gradient(90deg, #2a8ddb 0%, #54a6e6 100%);
    }

    .bottom_qs {
      //渐变背景色
      background: linear-gradient(90deg, #dc63c7 0%, #dd7fc9 100%);
    }
  }
}

.poster-text {
  position: absolute;
  left: 50%;
  top: 190px;
  transform: translateX(-50%);
  width: 100%;
  color: #fff;
  font-size: @font-size-base;
  text-align: center;

  .num {
    font-size: 50px;
  }

  .title {
    font-size: 25px;
  }

  .title-text {
    padding-top: @padding-base;
    color: #d3d3d4;
  }
}

// .top,
// .bottom {
//   padding: 0 @padding-base;
// }

.top {
  margin-bottom: @padding-base;
  border-bottom: 15px solid #ebebeb;
}

.text {
  color: #df757f;
  text-align: center;
  font-size: @font-size-lg;
}

@media (min-width: 750px) {
  .bottomMenu {
    width: 375px !important;
    margin: 0 auto;
  }
}

.bottomMenu {
  width: 100%;
  background: #fff;
  height: 55px;
  //头部阴影
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
  //定位底部
  position: fixed;
  transform: translateZ(0);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  font-size: 14px;
  justify-content: space-around;
  align-items: center;

  .menu {
    width: 33%;
    display: flex;
    justify-content: center;
    // border-right:1px solid #ccc;
  }

  .icon {
    width: 35px;
    margin-right: 2px;
  }

  .menu-item1 {
    display: flex;
    align-items: center;
    width: 100px;
    margin-bottom: 3px;
  }

  .menu-item2 {
    display: flex;
    align-items: center;
    width: 100px;
    margin-bottom: 3px;
  }

  .menu-item4 {
    display: flex;
    align-items: center;
    width: 100px;
    margin-bottom: 3px;
  }

  .menu-item3 {
    display: flex;
    align-items: center;
    width: 70px;
    margin-bottom: 3px;
  }

  .menu-item5 {
    display: flex;
    align-items: center;
    width: 100px;
    margin-bottom: 3px;
  }
}

.popupButton {
  height: 40px;
  border-radius: 40px;
  background-color: @theme-color;
  color: #fff;
  margin-top: @padding-base;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.popupButton1 {
  height: 40px;
  border-radius: 40px;
  background-color: @theme-color;
  color: #fff;
  margin-top: @padding-base;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
</style>
