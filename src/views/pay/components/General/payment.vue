<template>
    <div>
        <div class="g-wxbg g-minh100vh choose3">
            <div class="wxbg_top">
                <div class="bt"> 你的专属MBTI报告已生成 </div>
                <div class="scsj"> 生成于：{{ timestampToTime(testOrderInfo?.testCompleteTime) }}</div>
                <div class="gd_mbti">
                    <div class="inter_h5_head ">
                        <div class="section-img-header ">
                            <img src="../../../../assets/images/section-header.png" class="taro-img__mode-aspectfit">
                        </div>
                        <div class="top-header">
                            <div class="type-desc">
                            </div># 你的MBTI类型 #
                        </div>
                        <!-- <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                            <van-swipe-item v-for="(item, index) in testTypeList" :key="index">
                                <div class="title-header "> {{ item.name1 }} </div>
                            </van-swipe-item>
                        </van-swipe> -->
                        <div class="title-header ">{{ testTypeList[counter].name1 }}</div>
                        <div class="title-subheader ">{{ testTypeList[counter].name2 }}</div>
                        <div class="img-mbti"><img src="../../../../assets/images/mbti.png"
                                class="taro-img__mode-aspectfit"></div>
                        <div class="img-quote "><img src="../../../../assets/images/quote.png"
                                class="taro-img__mode-aspectfit"></div>
                        <div class="img-char-bg "><img src="../../../../assets/images/char-bg.png"
                                class="taro-img__mode-aspectfit"></div>
                        <div class="article-char "><img :src="testTypeList[counter].img"
                                class="taro-img__mode-aspectfit"></div>
                    </div>
                    <!--  v-for="(item, index) in testTypeList[counter].list" :key="index" -->
                    <div class="mbti_bar">
                        <div class="content-area color_base person_bar_h5 hydrated ">
                            <div class="bar_left hydrated">
                                <div class="bar_item1 hydrated">
                                    <div class="bar_item_0 hydrated"><span style="color: rgb(221, 94, 243);">
                                            {{ testTypeList[counter].list[0].left.num }}%
                                        </span>
                                        外向(E)</div>

                                    <div class="bar_item_1 hydrated">
                                        <div class="bar_img2 hydrated zs"
                                            :style="{ background: 'rgb(221, 94, 243)', width: testTypeList[counter].list[0].left.num + '%' }">
                                        </div>
                                        <div class="bar_img3 hydrated"
                                            :style="{ width: testTypeList[counter].list[0].right.num + '%', background: 'rgb(97, 47, 198)' }">
                                        </div>
                                    </div>
                                    <div class="bar_item_3 hydrated"><span style="color: rgb(97, 47, 198);">{{
                                        testTypeList[counter].list[0].right.num }}%</span>
                                        内向(I) </div>
                                </div>
                            </div>
                            <div class="bar_left hydrated">
                                <div class="bar_item1 hydrated">
                                    <div class="bar_item_0 hydrated"><span style="color: rgb(244, 67, 54);">
                                            {{ testTypeList[counter].list[1].left.num }}%
                                        </span>
                                        实感(S) </div>
                                    <div class="bar_item_1 hydrated">
                                        <div class="bar_img2 hydrated zs"
                                            :style="{ background: 'rgb(244, 67, 54)', width: testTypeList[counter].list[1].left.num + '%' }">
                                        </div>
                                        <div class="bar_img3 hydrated"
                                            :style="{ width: testTypeList[counter].list[1].right.num + '%', background: 'rgb(255, 152, 0)' }">
                                        </div>
                                    </div>
                                    <div class="bar_item_3 hydrated"><span style="color: rgb(255, 152, 0);">
                                            {{ testTypeList[counter].list[1].right.num }}%
                                        </span>
                                        直觉(N) </div>
                                </div>
                            </div>
                            <div class="bar_left hydrated">
                                <div class="bar_item1 hydrated">
                                    <div class="bar_item_0 hydrated"><span style="color: rgb(33, 150, 243);">
                                            {{ testTypeList[counter].list[2].left.num }}%
                                        </span>
                                        理性(T) </div>
                                    <div class="bar_item_1 hydrated">
                                        <div class="bar_img2 hydrated zs"
                                            :style="{ background: 'rgb(33, 150, 243)', width: testTypeList[counter].list[2].left.num + '%' }">
                                        </div>
                                        <div class="bar_img3 hydrated"
                                            :style="{ width: testTypeList[counter].list[2].right.num + '%', background: 'rgb(0, 188, 212)' }">
                                        </div>
                                    </div>
                                    <div class="bar_item_3 hydrated"><span style="color: rgb(0, 188, 212);">
                                            {{ testTypeList[counter].list[2].right.num }}%
                                        </span>
                                        感性(F) </div>
                                </div>
                            </div>
                            <div class="bar_left hydrated">
                                <div class="bar_item1 hydrated">
                                    <div class="bar_item_0 hydrated"><span style="color: rgb(0, 150, 136);">
                                            {{ testTypeList[counter].list[3].left.num }}%
                                        </span>
                                        判断(J) </div>
                                    <div class="bar_item_1 hydrated">
                                        <div class="bar_img2 hydrated zs"
                                            :style="{ background: 'rgb(0, 150, 136)', width: testTypeList[counter].list[3].left.num + '%' }">
                                        </div>
                                        <div class="bar_img3 hydrated"
                                            :style="{ width: testTypeList[counter].list[3].right.num + '%', background: 'rgb(139, 195, 74)' }">
                                        </div>
                                    </div>
                                    <div class="bar_item_3 hydrated"><span style="color: rgb(139, 195, 74);">
                                            {{ testTypeList[counter].list[3].right.num }}%
                                        </span>
                                        知觉(P) </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="new-buy-btn" @click="confirm">
                        <div class="new-buy-btn-header "> 你的类型占比极低，仅占3.1% </div>
                        <div class="new-buy-btn-top "> 解锁我的专属报告 </div>
                        <div class="new-buy-btn-footer "> 已有{{ getPeople }}人解锁 </div>
                    </div>
                </div>
            </div>
            <div class="mbti_cont">
                <div class="block m-item" v-for="(item, index) in imgList" :key="index">
                    <img :src="require(`../../../../assets/images/mbti-pay/new/${item}`)" alt="">
                    <div class="new-buy-btn " @click="confirm">
                        <div class="new-buy-btn-header"> 你的类型占比极低，仅占3.1% </div>
                        <div class="new-buy-btn-top"> 解锁我的专属报告 </div>
                        <div class="new-buy-btn-footer"> 已有{{ getPeople }}人解锁 </div>
                    </div>
                </div>

                <div class="block"><img src="../../../../assets/images/wx.jpg" alt=""></div>
                <div scrolly="true" scrollwithanimation="true" class="checkout-mb-desc taro-scroll-view__scroll-y ">
                    Introduction to Type® and Careers by Allen L. Hammer.
                    Mountain View, CA: CPP, Inc., <b> 2007. </b><br>Introduction to Type®
                    and Change by Nancy J. Barger and Linda K. Kirby. Mountain View, CA: CPP, Inc., <b> 2004.
                    </b><br>Introduction to Type® and Coaching by Sandra Krebs Hirsh and Jane A. G. Kise.
                    Mountain View, CA: CPP, Inc., <b> 2000. </b><br>Introduction to Type®
                    in College by John K. DiTiberio and Allen L. Hammer. Mountain View, CA: CPP, Inc.,<b>
                        1993. </b><br>Introduction to Type® and Communication by Donna Dunning. Mountain
                    View, CA: CPP, Inc., <b> 2003. </b><br>Introduction to Type® and
                    Conflict by Damian Killen and Danica Murphy. Mountain View, CA: CPP, Inc., <b> 2003.
                    </b><br>Introduction to Type® and Decision Making by Katherine W. Hirsh and Elizabeth
                    Hirsh. Mountain View, CA: CPP, Inc., <b> 2008. </b><br>Introduction
                    to Type® and the 8 Jungian Functions by Margaret T. Hartzler, Robert W. McAlpine, and Leona Haas.
                    Mountain
                    View, CA: CPP, Inc.,<b> 2005. </b><br>Introduction to Type® and
                    Emotional Intelligence by Roger R. Pearman. Mountain View, CA: CPP, Inc.,<b> 2002.
                    </b><br>Introduction to Type® and Innovation by Damian Killen and Gareth Williams.
                    Mountain View, CA: CPP, Inc., <b> 2009. </b><br>Introduction to Type®
                    and Leadership by Sharon Lebovitz Richmond. Mountain View, CA: CPP, Inc., <b> 2008.
                    </b><br> Introduction to Type® and Learning by Donna Dunning. Mountain View, CA: CPP,
                    Inc., 2008. Introduction to Type® in Organizations, Third Edition, by Sandra Krebs Hirsh and Jean M.
                    Kummerow. Moun- tain View, CA: CPP, Inc.,<b> 1998. </b><br>Introduction to Type® and Project
                    Management by Jennifer Tucker. Mountain View, CA: CPP, Inc., <b> 2008.
                    </b><br>Introduction to Type® and Selling by Susan A.
                    Brock. Moun- tain View, CA: CPP, Inc., <b> 1994. </b><br>Introduction
                    to Type® and Teams, Second Edition, by Eliza- beth Hirsh, Katherine W. Hirsh, and Sandra Krebs
                    Hirsh.
                    Mountain View, CA: CPP, Inc.,<b> 2003. </b></div>
            </div>

            <PayModal2 @confirm="handlePay" @handlePay="handlePay" :payInfo="payInfo" :testPaperInfo="testPaperInfo"
                :testOrderInfo="testOrderInfo" :currentCoupon="currentCoupon" :showCoupon="showCoupon" :list="list"
                @ontab="ontab" :unlockIndex="unlockIndex" />
        </div>
        <!-- <van-popup v-model:show="visible" round closeable position="bottom" :close-on-click-overlay="false"
            class="pay-modal" @click-close-icon="emit('cancel')">
            <div>12435435</div>
        </van-popup> -->
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useAgent } from "@/hooks/useAgent";
import { functionDeclaration } from "@babel/types";
import PayModal2 from "../General/PayModa2";
const { isWeChat } = useAgent();

const emit = defineEmits(["update:show", "cancel", "onCoupon", "handlePay", 'ontab']);

const props = defineProps({
    show: {
        type: Boolean,
        default: true,
    },
    showCoupon: {
        type: Boolean,
        default: false,
    },
    payInfo: {
        type: Object,
        default: () => ({}),
    },
    testPaperInfo: {
        type: Object,
        default: () => ({}),
    },
    testOrderInfo: {
        type: Object,
        default: () => ({}),
    },
    currentCoupon: {
        type: Object,
        default: () => ({}),
    },
    list: {
        type: Array,
        default: () => ([]),
    },
    unlockIndex: {
        type: Number,
        default: () => ({}),
    },
    testTypeList: {
        type: Array,
        default: () => ([]),
    },
});

const visible = computed({
    get: () => props.show,
    set: (val) => emit("update:show", val),
});
const setPrice = computed(() => {
    return props.list
})
const testTypeList = computed(() => {
    return props.testTypeList
})
// 人数  获取秒的时间戳后5位
const getPeople = computed(() => {
	var date = new Date();
	var timestamp = date.getTime();
	var timestamp_str = timestamp.toString();
	var timestamp_str_last6 = timestamp_str.substring(5, 10);
	return '1' + timestamp_str_last6 ;
})
const counter = ref(0)
const imgList = computed(() => {
    return (
        [
            'm1.jpg',
            'm2.jpg',
            'm3.jpg',
            'm4.jpg',
            'm5.jpg',
            'm6.jpg',
            'm7.jpg',
            'm8.jpg',
            'm9.jpg',
            'm10.jpg',
            'm11.jpg',
        ]
    );
});

// 轮播效果
const time = ref(0)
onMounted(() => {
    time.value = setInterval(() => {
        counter.value++
        if (counter.value >= 5) {
            counter.value = 0
        }
    }, 1000)
})

onBeforeUnmount(() => {
    counter.value = 0
    clearTimeout(time.value);
});

const unlockIndex = computed(() => {
    return props.unlockIndex
})


function confirm() {
    emit("confirm");
}
function cancel() {
    visible.value = false;
    emit("cancel");
}
function handleCoupon() {
    if (!isWeChat) return;
    emit("onCoupon");
}

function ontab(index) {
    emit("ontab", index);
}
function handlePay() {
    emit("handlePay");
}

// 时间戳转时间格式 年月日 时分秒

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + '';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds() + '';
    return Y + M + D;
    // return Y + M + D +'' + h + m + s;
}
</script>

<style lang="less">
@media screen and (min-width: @max-device-width) {
    .pay-modal {
        top: 18%;
        left: 50%;
        transform: scale(0.75) translate3d(-50%, -50%, 0);
        transform-origin: 0 0;
        max-height: none;
    }
}
</style>
<style lang="less" scoped>
.choose3 {
    background: #fff;
}

.g-minh100vh {
    min-height: 100vh;
}

.bt {
    text-align: center;
    padding-top: 32px;
    font-size: 24px;
    color: #333;
}

.scsj {
    color: #ccc;
    text-align: center;
    margin-top: 6px;
    font-size: 12px;
}

.gd_mbti {
    background: url('../../../../assets/images/section-bg.png');
    background-size: cover;
    color: #523787;
    font-weight: 700;
    position: relative;
    height: 15rem;
    width: 100%;
}

.section-header,
.section-img-header .taro-img__mode-aspectfit {
    width: 90%;
    margin-left: 5%;
    margin-top: 15px;
}

.top-header {
    text-align: left;

    margin-left: 19px;
    // left: 0.2rem;
    // top: 0.6rem;
    font-size: 18px;
    margin-top: 10px;
}

.top-header .sj {
    color: #523787;
    font-weight: 400;


}

.title-header {
    top: 120px;
    font-size: 60px;
    left: 55px;
    font-weight: 400;
}

.img-mbti {
    width: 25px;
    top: 120px;
    left: 18px;
}

.img-mbti img {
    width: 100%;
}

.img-quote {
    top: 50px;
    right: 60px;
    width: 33px;
}

.img-char-bg {
    width: 152px;
    top: 70px;
    right: 0;
}

.article-char {
    width: 150px;
    right: 0;
    top: 67px;
}

.title-subheader {
    top: 188px;
    font-size: 20px;
    left: 60px;
}

.article-char,
.img-char-bg,
.img-mbti,
.img-quote,
.title-header,
.title-subheader,
.top-header {
    position: absolute;
}

.mbti_bar {
    margin-top: 200px;
    padding: 16px 30px;
    color: #333;
    font-weight: 400;
    font-size: 12px;
    height: 250px;
    overflow-y: hidden;

    span {
        font-size: 15px;

    }

    // padding: 20px 10px 20px 10px;
    // color: #333;
    // font-weight: 400;
    // font-size: 12px;
    // overflow-y: hidden;
    // overflow-x: hidden;

    // margin-top: -140px;
    // width: 100%;

    // span {
    //     font-size: 14px;
    // }
}

.bar_left {
    margin-bottom: 15px;
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

.bar_item_1 {
    width: 68%;
    display: flex;

    border-radius: 13px;
    overflow: hidden;
    height: 5px;
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
        &.m-item {
            margin-bottom: -5px;
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
    background-color: rgba(0, 0, 0, .7);
}
</style>
