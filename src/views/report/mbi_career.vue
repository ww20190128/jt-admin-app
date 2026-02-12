<template>
    <div class="content">
        <div class="bottom-content">
            <!-- 商品详情 -->
            <div class="item rich-text">
                <div class="rich-text-content" v-html="workplace" @click="handleOption"></div>
            </div>
        </div>
        <!--  v-if="payment_type == 0" -->
        <button id="after-pay" class="  btn-round1 "
            style="background-color: rgb(255, 57, 43); font-weight: bold; font-size: 19px;" @click="handlePay"
            v-if="payment_type == 0">
            <img src="../../assets/images/js.png" alt="" style="width: 19px; position: relative; top: 4px;">
            立即解锁职业报告
        </button>
        <button id="after-pay" tabindex="-1" class="btn btn-primary  btn-round2 call-action"
            style="background-color: rgb(255, 57, 43); font-weight: bold; font-size: 19px;" @click="onback"
            v-if="payment_type == 1">
            返回上一页
        </button>
        <!-- <div class="fixed">
            <div class="left" @click="payHook.handlePay">
                <img src="https://adm56.51lihaoedu.top/img/js.png" />
                立即解锁职业报告
            </div>
        </div> -->
        <div class="back" @click.stop="onback" v-if="payment_type == 0">

            <i class="icon fa fa-reply"></i>
        </div>
        <!-- PC微信扫码支付 -->
        <WeChatPayQr v-model:show="qrPayShow" :url="qrUrl" @confirm="qrConfirm" @cancel="qrConfirm" />
        <AgainPayDialog v-model:show="show" confirmText="已完成支付" cancelText="重新支付" content="正在获取支付状态，请确认是否已完成支付"
            @confirm="confirm" @cancel="cancel" />
    </div>
</template>

<script >


import { useAuth } from "@/hooks/useAuth";
import { reactive, toRefs, computed, onBeforeUnmount, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import WeChatPayQr from "@/components/WeChatPayQr";
import AgainPayDialog from "@/components/AgainPayDialog";
import { useAgent } from "@/hooks/useAgent";
// import { checkGoodsOrder, buyVipCallback } from "@/api/pay";
import { useStore } from "@/store";
import { Toast } from "vant";
import { shareWx } from "@/hooks/shareWx";

import qs from "qs";
import { parseQueryString } from "@/utils/tools";
import { loadingToast } from "@/plugins/vant";
export default {
    name: "vipOpened",
    components: {
        AgainPayDialog,
        WeChatPayQr,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        document.title = '您的MBTI职业报告'
        const state = reactive({
            show: false,
            time: 0,
            currentIndexuseAgent: 0,

            vipTypeList: [],
            qrPayShow: false,
            qrUrl: "",
            timer: null,
            currentIndex: 0,
            couponInfo: {},
            workplace: '',
            payment_type: -1,
        });
        const { md, isWeChat, ua, network, os } = useAgent();
        const { paper_order_sn, mbti_pl_id } = route.query;
        onMounted(() => {
            const { from_type } = route.query;
            if (from_type === "pay") {
                poll(10);
            }
        })
        useAuth(
            {
                auth_type: 1,
            },
            () => {
                shareWx({ type: 1 });
                init();
            }
        );
        // coupon_code
        async function init() {
            // ww 注释
            // try {
            //     const { data, code } = await getPl07Contentl({
            //         paper_order_sn,
            //         mbti_pl_id,
            //         content_type: 1
            //     });
            //     if (code == 0) {
            //         Toast('该订单已退款，即将返回结果页')
            //         //延时5秒执行
            //         setTimeout(() => {
            //             onback()
            //         }, 3000)
            //     }
            //     state.payment_type = data.pay_status
            //     state.workplace = data.content
            //     if (data.pay_status == 2) {
            //         Toast('该订单已退款，即将返回结果页')
            //         //延时5秒执行
            //         setTimeout(() => {
            //             onback()
            //         }, 3000)
            //         // return onback()
            //     } else if (data.pay_status == 1) {
            //         state.show = false;
            //     }
            // } catch (error) {
            //     state.payment_type = 1
            //     console.log(error);
            // }
        }
        // 当前选择的tab
        const current = computed(() => state.vipTypeList[state.currentIndex]);

        // 开通VIP
        async function handlePay() {
            // if (current.value.newPrice <= 0) {
            //   return Toast("支付金额错误");
            // }

            const loading = loadingToast("创建订单中...");
            clearTimeout(state.timer);
            state.timer = null;
            state.time = 0;
            const { paper_order_sn } = route.query;
            try {
                const { width, height } = window.screen;
                const params = {
                    phone_model: "",
                    browser_version: ua,
                    screen_resolution: `${width}*${height}`,
                    network,
                    use_env: isWeChat ? 1 : 2,
                    ...route.query,
                };
                if (os == "iOS") {
                    //ios系统的处理
                    params.phone_model = md.os() + md.version("iPhone");
                } else if (os == "AndroidOS") {
                    //Android系统的处理
                    params.phone_model = md.os() + md.version("Android");
                }

                // const { id } = state.vipTypeList[state.currentIndex];

                // const {
                //     data: { out_trade_no },
                // } = await putOrder({ id, paper_order_sn, ...params });
                // state.out_trade_no = out_trade_no;
                // 支付类型
                const { env } = useAgent();

                const payType = {
                    "wechat-mobile": "JSAPI",
                    "wechat-pc": "NATIVE",
                    "browser-mobile": "MWEB",
                    "browser-pc": "NATIVE",
                };

                const tradeType = payType[env];

                const query = parseQueryString(window.location.href);
                const search = qs.stringify({
                    ...query,
                    fromType: "pay",
                    // t:new Date().getTime(),
                    paper_order_sn,
                });
                const redirect_url = `${window.location.origin}/mbi_career?${search}`;
                // ww 注释
                // const { data } = await mbtipay({
                //     paper_order_sn,
                //     payment_type: 1, //微信支付
                //     redirect_url,
                //     tradeType, //支付类型
                //     mbti_pl_id,
                //     content_type: 1,
                //     ...params
                // });
               
                // if (data.pay_status === 1) {
                //     return goErrorRecord()
                // } else if (data.pay_status === 2) {
                //     return Toast('该订单已退款')
                // }
                // loading?.clear();
                // switch (env) {
                //     // H5支付
                //     case "browser-mobile":
                //         window.location.replace(data.wechatPayParam.mweb_url);
                //         break;
                //     // 微信浏览器内支付
                //     case "wechat-mobile":
                //         wechatPay(data.wechatPayParam);
                //         break;
                //     // 微信浏览器内支付
                //     case "wechat-pc":
                //         qrPay(data.wechatPayParam);
                //         break;
                //     // 微信浏览器内支付
                //     case "browser-pc":

                //         qrPay(data.wechatPayParam);
                // }
            } catch (error) {
                loading?.clear();
                console.log(error);
            }
        }
        function qrPay({ code_url }) {
            state.qrUrl = code_url;
            state.qrPayShow = true;
            qrPoll(180);
        }
        function onback() {
            router.replace({
                path: "/report",
                query: {
                    paper_order_sn,
                    // mbti_pl_id,
                    hasParams: 1
                },
            });
        }
        function goErrorRecord() {
            // init();
            // const { from_type } = route.query;
            // if (from_type === "pay") {
            //     init();

            // } else {
            //     window.location.reload()
            // }
            // init();
            router.replace({
                path: "/mbi_career2",
                query: {
                    paper_order_sn,
                    from_type: "pay",
                    mbti_pl_id,
                },
            });
        }
        // 微信浏览器内支付
        function wechatPay(data) {
            WeixinJSBridge?.invoke("getBrandWCPayRequest", data, (res) => {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    goErrorRecord()
                } else {
                    state.show = true;
                }
            });
        }
        // PC二维码轮询
        async function qrPoll(count) {
            try {
                const { data } = await checKmbti({
                    paper_order_sn,
                    mbti_pl_id,
                    content_type: 1,
                });
                state.payment_type = data.pay_status
                if (data.pay_status === 1) {

                    // 跳转支付引导页
                    goErrorRecord()
                } else {
                    state.timer = window.setTimeout(() => {
                        state.time++;
                        if (state.time > count) {
                            Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
                            return;
                        }
                        qrPoll(count);
                    }, 1000);
                }
            } catch (error) { }
        }
        // 组件卸载前清除定时器
        onBeforeUnmount(() => {
            clearTimeout(state.timer);
            state.timer = null;
        });
        function qrConfirm() {
            state.qrPayShow = false;
            clearTimeout(state.timer);
            state.timer = null;
            state.time = 0;

        }
        // 轮询查询支付状态
        async function poll(count, isConfirm) {
            const time = isConfirm ? count : 3
            if (!window.checkOrderLoading && state.time < time) {
                window.checkOrderLoading = loadingToast("查询订单中...");
            }
            try {
                const { data } = await checKmbti({
                    paper_order_sn,
                    mbti_pl_id,
                    content_type: 1
                });

                if (data.pay_status === 1) {
                    nextTick(() => {
                        window.checkOrderLoading?.clear();
                        goErrorRecord();
                    })
                } else {
                    // state.timer = window.setTimeout(() => {
                    //     state.time++;

                    //     // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
                    //     if (isConfirm) {
                    //         if (state.time === count) {
                    //             window.checkOrderLoading?.clear();
                    //             window.checkOrderLoading = null;
                    //             nextTick(() => {
                    //                 Toast(`该订单暂未支付，如有疑问可联系公众号【${wechat.value.wechat_name}】客服。`);
                    //             })
                    //         }
                    //     } else {
                    //         if (state.time === 3) {
                    //             window.checkOrderLoading?.clear();
                    //             window.checkOrderLoading = null;
                    //             state.show = true;
                    //         }
                    //     }

                    //     if (state.time > count) {
                    //         return;
                    //     }
                    //     poll(count, isConfirm);
                    // }, 1000);

                    state.timer = window.setTimeout(() => {
                        state.time++;
                        // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
                        if (state.time === 5) {
                            window.checkOrderLoading?.clear();
                            window.checkOrderLoading = null;

                            if (isConfirm) {
                                Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
                            } else {
                                window.checkOrderLoading?.clear();
                                window.checkOrderLoading = null;
                                state.show = true;
                            }
                        }
                        if (state.time > count) {
                            return;
                        }
                        poll(count, isConfirm);
                    }, 1000);


                }
            } catch (error) {
                window.checkOrderLoading?.clear();
            }
        }
        // // 轮询查询支付状态
        // async function poll(count, isConfirm) {
        //     if (!state.toast && state.time < 5) {
        //         state.toast = loadingToast("查询订单中...");
        //     }
        //     try {
        //         const { data } = await checKmbti({
        //             paper_order_sn,
        //             mbti_pl_id,
        //             content_type: 1
        //         });

        //         state.payment_type = data.pay_status

        //         if (data.pay_status === 1) {
        //             // 跳转
        //             // goErrorRecord()
        //             nextTick(() => {
        //             window.checkOrderLoading?.clear();
        //             goErrorRecord();
        //         })

        //         } else {
        //             state.timer = window.setTimeout(() => {
        //                 state.time++;

        //                 // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
        //                 if (state.time === 5) {
        //                     state.toast?.clear();
        //                     state.toast = null;

        //                     if (isConfirm) {
        //                         Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
        //                     } else {
        //                         state.show = true;
        //                     }
        //                 }
        //                 if (state.time > count) {
        //                     return;
        //                 }
        //                 poll(count, isConfirm);
        //             }, 1000);
        //         }
        //     } catch (error) {
        //         state.toast?.clear();
        //     }
        // }
        function handleOption() {
            if (state.payment_type != 1) {
                handlePay()
            }
        }
        // 已完成支付
        async function confirm() {
            clearTimeout(state.timer);
            state.timer = null;
            state.time = 0;
            poll(5, true);
        }
        // 重新支付
        async function cancel() {
            state.show = false;
            const { data } = await checKmbti({
                paper_order_sn,
                mbti_pl_id,
                content_type: 2
            });
            state.payment_type = data.pay_status
            if (data.pay_status === 1) {
                // 跳转
                window.checkOrderLoading?.clear();
                goErrorRecord();
                return
            }
            handlePay()
        }

        return {
            qrConfirm,
            confirm,
            cancel,
            handlePay,
            ...toRefs(state),
            onback,
            current,
            handleOption
        };
    },
};

</script>

<style lang="less">
@import "./styles/report_son.less";
</style>

<style lang="less" scoped>
:deep(.rich-text) {
    padding-bottom: @padding-base;
    font-size: @font-size-base;
    color: #3f3f3f;
    line-height: 24px;

    .rich-text-content {
        padding-bottom: 25px;
    }

    img {
        display: block;
        width: 100%;
    }
}



.content {
    .gray-page();
    height: 100vh;
    ;
    background-color: #5587dd;
}

.fixed {
    position: fixed;
    bottom: 30px;
    width: 100%;
    z-index: 99;
    background-color: transparent;
    height: 64px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    .full-fixed();

    .left {
        flex: 1;
        height: 50px;
        background-color: rgb(255, 57, 43);
        border-radius: 8px 8px 0 0;
        font-size: 16px;
        padding: 0 16px;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;

        img {
            width: 24px;
            margin-right: 4px;
        }
    }

    .right {
        width: 214px;
        height: 100%;
        background-color: #ff7792;
        border-radius: 8px 8px 0 0;
        padding: 0 12px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        // .vip {
        //   font-size: 14px;
        //   color: #ffd754;
        //   position: absolute;
        //   right: 4px;
        //   top: 4px;
        // }
        .text {
            margin-top: 4px;
            font-size: 12px;
            color: #fff;

            strong {
                font-size: 14px;
                color: #ffeb3b;
            }
        }

        .button {
            background-color: #ffc300;
            width: 160px;
            height: 28px;
            border-radius: 28px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.btn-round1 {
    position: fixed;
    bottom: 30px;
    left: calc((100vw - 305px) / 2);
    ;
    width: ceil(375px * 0.8);

    z-index: 99;
    display: inline-block;
    padding: 10px;
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    border-radius: 25px;
    padding-left: 25px;
    padding-right: 25px;
    color: #fff;

    box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -webkit-box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -moz-box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -webkit-animation: gotest-data1-data-v-4b3342be 1.5s infinite;
    animation: scale 3s infinite;
}

.btn-round2 {
    position: fixed;
    bottom: 30px;
    left: calc((100vw - 345px) / 2);
    ;
    width: ceil(375px * 0.9);

    z-index: 99;
    display: inline-block;
    padding: 10px;
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    border-radius: 25px;
    padding-left: 25px;
    padding-right: 25px;
    color: #fff;

    box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -webkit-box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -moz-box-shadow: 0 2px 5px 2px hsla(0, 0%, 68.6%, .46);
    -webkit-animation: gotest-data1-data-v-4b3342be 1.5s infinite;

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

.bottom-content {
    background-color: #5587dd;

    .item {
        // padding: 0 @padding-base;
        // background-color: #fff;
        margin-bottom: @padding-base;
        line-height: 28px;
        color: @light-black;
    }
}

.back {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 6px #0000001f;
    cursor: pointer;
    border-radius: 50%;
    position: fixed;
    left: calc((100vw - 375px) / 2 + 20px);
      bottom: calc(100px + constant(safe-area-inset-bottom));
      bottom: calc(100px + env(safe-area-inset-bottom));
    // bottom: 14%;
    z-index: 5;
    background-color: #fff;
}
</style>
