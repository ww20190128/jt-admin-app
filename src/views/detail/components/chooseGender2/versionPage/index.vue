<template>
    <div class="contenter">
        <div class="mbti-warper" v-if="versionConfig">
            <div class="mbit-title">MBTI 16型人格测试</div>
            <div class="header-button-warper">
                <div class="left">16 Personalities</div>
                <div class="right" @click="handleLookResult">
                    <img src="../../../../../assets/images/collect-bg.png" alt="">
                    <span>我的报告</span>
                    <div class="dot" v-if="lastTestOrderInfo?.id && Object.keys(lastTestOrderInfo).length > 0 && lastTestOrderInfo?.status === 1"></div>
                </div>
            </div>
            <div class="top-desc-warper" v-html="versionConfig?.topDesc"></div>
            <div class="selection-title">
                {{ versionConfig?.text }}
            </div>
            <!-- 选项 -->
            <div class="selection-warper">
                <div class="selection-item" :class="{ 'current': optionCurrent === 1 }"
                    @click="handleSelectItem(versionConfig?.options[0])">
                    <div class="checked-img checked" v-if="optionCurrent === 1">
                        <img src="../../../../../assets/images/duihao.png" alt="">
                    </div>
                    <img v-if="versionConfig?.options[0]?.img" :src="versionConfig?.options[0]?.img" alt="" class="img">
                    <img v-else src="../../../../../assets/images/left2.png" alt="" class="img">
                    <div class="selection-name"> {{ versionConfig?.options[0]?.name }} </div>
                    <!-- <p> 近30天测试 <br> 3676876人 </p> -->
                </div>

                <div class="selection-item " :class="{ 'current': optionCurrent === 2 }"
                    @click="handleSelectItem(versionConfig?.options[1])">
                    <div class="checked-img checked" v-if="optionCurrent === 2">
                        <img src="../../../../../assets/images/duihao.png" alt="">
                    </div>
                    <img v-if="versionConfig?.options[1]?.img" :src="versionConfig?.options[1]?.img" alt="" class="img">
                    <img v-else src="../../../../../assets/images/right2.png" alt="" class="img">
                    <div class="selection-name"> {{ versionConfig?.options[1]?.name }} </div>
                    <!-- <p> 近30天测试 <br> 3676876人 </p> -->
                </div>
            </div>

            <div class="test-button move" @click="confirm"> 开始测试 </div>
            <div v-if="versionConfig.bottomDesc">
                <div class="tips2" v-html="versionConfig?.bottomDesc"></div>
            </div>
            <div class="desc-warper" v-if="versionConfig.desc" v-html="versionConfig.desc"></div>

            <div class="title-warper " v-if="versionConfig?.gains && versionConfig?.gains.length >= 1">测试后您将获得</div>
            <div class="desc-warper bg-purple" v-if="versionConfig?.gains && versionConfig?.gains.length >= 1">
                <div class="gains-warp">
                    <div class="gain-item" v-for="(item, index) in versionConfig?.gains" :key="index">{{ item }}</div>
                </div>
            </div>
            <div class="title-warper conter-title">人格类型</div>
        </div>
        <div class="type-group-List">
            <div class="type-group-item" v-for="(groupItem, index) in versionConfig?.typeGroupList" :key="index"
                :style="{ backgroundColor: groupItem['bgColor'] }">
                <p class="group-title" :style="{ color: groupItem['color'] }">{{ groupItem['groupName'] }}</p>
                <div class="type-list">
                    <div class="type-item" v-for="(item, index) in groupItem?.list" :key="index">
                        <img :src="item?.img" alt="SVG Component" class="img">
                        <p class="type-name" :style="{ color: groupItem['color'] }"> {{ item.type }}-{{ item.name }}</p>
                        <p class="desc"> {{ item.desc }}</p>
                    </div>
                </div>

            </div>
        </div>
        <div class="bottom-warper">
            <div class="notice-warper" v-if="versionConfig?.notice && versionConfig.notice">
                <p class="title">测试说明</p>
                <div class="content" v-html="versionConfig.notice"></div>
            </div>
            <div class="attention-warper">

                <div class="qrcode"> <img :src="wechatConf?.wechat_qrcode" alt=""></div>
                <p class="desc">关注【{{ wechatConf?.name }}】公众号，方便查看测评结果</p>
            </div>

            <div v-if="versionConfig?.copyright">
                <div class="desc-warper" v-html="versionConfig?.copyright"></div>
            </div>
        </div>

    </div>
    <div class="footer" v-if="state.botShow">
        <div class="button" @click="confirm">开始测试</div>
    </div>
</template>

<script setup>

const emit = defineEmits(["handleSelectItem2", "confirm"]);

const props = defineProps({
    link: {
        type: String,
    },
    versionConfig: {
        type: Object
    },
    optionCurrent: {
        type: Number,
        default: 0
    },
    lastTestOrderInfo: {
        type: Object,
        default: {}
    }
});
import { useStore } from "@/store";
const store = useStore();
import { useRouter } from "vue-router";
import {
    reactive,
    onMounted,
    computed,
} from "vue";

const wechatConf = computed(() => store.getters.wechatInfo || {});

function handleSelectItem(optionsItem) {
    emit('handleSelectItem2', optionsItem);
}
function confirm() {
    emit('confirm');
}
const state = reactive({
    botShow: false
});
const router = useRouter();

function handleScroll() {
    var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

    // 获取屏幕高度
    const screenHeight = window.innerHeight;

    // 判断滚动位置是否超出屏幕高度
    if (scrollTop >= screenHeight * 0.9) {
        state.botShow = true;
    } else {
        state.botShow = false;
    }
}

// 查看报告
function handleLookResult() {
    if (props.lastTestOrderInfo?.status === 1) { // 未支付订单
        router.push({
        path: "/pay",
        query: {
          testOrderId: props.lastTestOrderInfo.id,
          testPaperId: props.lastTestOrderInfo?.testPaperId,
          promotionId: props.lastTestOrderInfo?.promotionId,
        },
      });
    }
}
onMounted(() => {
    window.loading?.close?.();
    window.addEventListener('scroll', handleScroll);
});
</script>

<style lang="less" scoped>
// p {
//     display: block;
//     margin-block-start: 1em;
//     margin-block-end: 1em;
//     margin-inline-start: 0px;
//     margin-inline-end: 0px;
// }


// min-height: 100vh;
// width: 100%;
// overflow: hidden;
// // background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
// background-image: linear-gradient(to bottom, #a1c4fd 0%, #fff 100%);
// font-size: 14px;
// padding: 10px;
.contenter {
    .mbti-warper {
        position: relative;
        background-image: linear-gradient(to bottom, #BEC4FF 0%, #E7DFEA 100%);
        width: 100%;
        height: auto;

        overflow: hidden;
        min-height: 100vh;
        padding: 20px 20px 0 20px;

        background-image: url("@/assets/images/bg/shade1.png");
        background-size: 100% auto;
        background-repeat: no-repeat;

        .mbit-title {
            font-size: 20px;
            font-weight: bold;
        }

        .header-button-warper {
            margin-top: 10px;
            position: relative;
            width: 100%;
            .space-between();
            height: 30px;

            .left,
            .right {
                padding: 0px 10px;
                border-radius: 20px;
                font-size: @font-size-lg;
            }

            .left {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
                color: #ffff;
            }

            .right {
                background: #fff;
                color: @light-black;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    height: 25px;
                    width: auto;
                }

                span {
                    font-size: @font-size-lg;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    background-color: red;
                    border-radius: 50%;
                    margin-left: 2px;
                    opacity: 0.8;
                }
            }
        }

        .top-desc-warper {
            border: 1.5px solid #F8F8F8;
            margin-top: 20px;
            border-radius: 10px;
            position: relative;
            width: 100%;
            line-height: 25px;
            font-size: @font-size-base;
            color: #ffff;
            padding: 10px 10px;
            background-image: linear-gradient(120deg, #8ec5fc 0%, #8ec5fc 100%);
        }

        .selection-title {
            margin-top: 15px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
        }

        .selection-warper {
            display: flex;
            justify-content: space-evenly;
            margin-top: 20px;
            width: 100%;

            .selection-item {
                padding: 5px;
                box-sizing: border-box;
                border-radius: 10px;
                width: 40%;
                border: 3px solid rgba(255, 0, 0, 0);
                text-align: center;
                box-shadow: 0 .08rem .3rem 0 #5934a0;
                background: #fff;

                // height: 160px;
                &.current {
                    border: 3px solid #ff5d7d !important;
                    transform: scale(1.1);
                }

                position: relative;

                .checked-img {
                    display: block;
                    background: #ff5d7d;
                    width: 20px;
                    height: 20px;
                    border-bottom-right-radius: 5px;
                    border-top-left-radius: 5px;
                    position: absolute;
                    top: -1px;
                    left: -1px;

                    img {
                        pointer-events: none;
                        max-width: 90%;
                    }
                }

                .checked {
                    // display: none;
                }

                .img {
                    width: 100%;
                }

                .selection-name {
                    font-size: @font-size-base;
                    margin-top: 0px;
                    color: #999;
                    letter-spacing: 0;
                }
            }
        }
    }

    .type-group-List {
        width: 100%;
        padding-top: 25px;

        background-image: url("@/assets/images/bg/shade2.png");
        background-size: 100% auto;
        background-repeat: no-repeat;

        .type-group-item {
            position: relative;

            .group-title {
                position: absolute;
                top: 20px;
                left: 0;
                opacity: 0.3;
                font-weight: 500;
                width: 100%;
                font-size: 30px;
                text-align: center;
            }

            padding-top: 0px;

            .type-list {
                padding: 20px 20px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .type-item {
                    padding: 10px 0;
                    font-size: @font-size-sm;
                    display: flex;
                    flex-wrap: wrap;
                    text-align: center;
                    position: relative;
                    width: 48%;

                    .img {
                        margin: 0 auto;
                        // width: 80%;
                        height: 120px !important;
                        width: auto;
                    }

                    .type-name {
                        width: 100%;
                        line-height: 30px;
                        font-size: @font-size-base;
                        text-align: center;
                        font-weight: 500;
                    }

                    .desc {
                        height: 50px;
                        line-height: 20px;
                        font-size: @font-size-sm;
                        text-align: left;
                    }
                }
            }

        }
    }

    .bottom-warper {
        background-color: #F9EED7;
        width: 100%;
        padding: 0px 20px 60px 20px;

        .notice-warper {
            width: 100%;
            background-color: #f0e0bf !important;
            border-radius: 10px;
            margin: 0 auto;
            padding: 5px 10px;
            color: #8F5835;

            .title {
                font-size: @font-size-base;
                padding-left: 5px;
                border-left: 4px solid rgba(244, 164, 96, 0.9);
                font-weight: bold !important;
            }

            .content {
                margin-top: 10px;
                font-size: @font-size-sm;
                line-height: 22px;
            }
        }

        .attention-warper {
            margin-top: 20px;

            .desc {
                text-align: center;
                font-size: @font-size-base;
                margin-top: 10px;
            }

            .qrcode {

                position: relative;
                width: 50%;
                height: auto;
                margin: 0 auto;

                img {
                    width: 100%;
                    height: auto;
                    border-radius: 10px;
                    pointer-events: auto;
                }
            }
        }
    }
}





.desc-warper {
    width: 100%;
    background-color: #ced1f7;
    border-radius: 10px;
    color: #fff;
    margin: 0 auto;
    // margin-top: 10px;
    padding: 15px;

    :deep(h5) {
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    &.bg-purple {
        background-color: #ced1f7 !important;
    }

    :deep(p) {
        line-height: 25px;
        font-size: @font-size-base;
    }


    .gains-warp {
        padding: 0px 10px;
        line-height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;

        .gain-item {
            font-size: @font-size-sm;
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            position: relative;
            width: 48%;

            &::before {
                content: "";
                width: 8px;
                height: 8px;
                background-color: #72a1f8;
                border-radius: 50%;
                position: absolute;
                left: -12px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }


}


.test-button {
    // position: fixed;
    // bottom: 1px;
    width: 90%;
    margin-left: 50%;
    margin-top: 50px;
    // left: 50%;
    transform: translate(-50%, -50%);
    // background: linear-gradient(178deg, #ffb489 1%, #f37a4b 99%);
    background: #ff5d7d;

    box-shadow: 0 8px 21px 0 rgba(0, 0, 0, .19);

    border-radius: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    // background-image: linear-gradient(to right, #ff6f8c, #fd466a);
    font-weight: bold;
    font-size: 18px;
    height: 40px;

    border-radius: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    letter-spacing: 5px;

    animation: scaleAnimation 1s ease-in-out infinite;
}


.title-warper {
    line-height: 50px;
    font-weight: bold;
    font-size: @font-size-lg !important
}


@keyframes scaleAnimation {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        transform: translate(-50%, -50%) scale(1.1);
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
    }
}

.footer {
    .fixed-bottom();
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px !important;

    .button {
        font-size: 18px;
        color: #fff;
        background-color: #ff5d7d;
        width: 85%;
        border-radius: 20px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        animation: scaleAnimation2 1s ease-in-out infinite;
        letter-spacing: 5px;
    }
}

@keyframes scaleAnimation2 {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}
</style>