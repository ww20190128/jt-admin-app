<template>
    <van-dialog v-model:show="visible" :showConfirmButton="false">
        <div class="open-vip-warper">
            <div class="title-warper">
                <div class="left">
                    选择会员计划
                </div>
                <div class="right"></div>
            </div>
            <div class="select-warper">
                <div :class="{ current: optionCurrent === index }" class="year-item item"
                    v-for="(item, index) in vipTypeList" :key="item.id" @click="optionCurrent = index">
                    <div class="title">限时特惠</div>
                    <div class="content">
                        <div class="left">
                            {{ item?.name }}<span class="price">￥{{ item?.price }}</span><span
                                class="original-price">￥{{
                                    item.originalPrice }}</span>
                        </div>
                        <div class="right">￥{{ formattedPrice(item?.price) }}/天</div>
                    </div>
                </div>

                <div class="alone-item item" :class="{ 'current': optionCurrent === 999 }" @click="handleItem(999)">
                    <div class="content">
                        <div class="left">
                            解锁课程
                        </div>
                        <div class="right">￥{{ mindfulness.price }}<span class="original-price">￥{{
                            mindfulness.originalPrice }}</span></div>
                    </div>
                </div>
            </div>
            <div class="title-warper">
                <div class="left">
                    会员专属
                </div>
                <div class="right">一次订阅，全平台通用</div>
            </div>
            <div class="rights-list-warper">
                <div class="item" v-for="(item, index) in rights"> <i class="fa fa-check"></i>{{ item }}</div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <van-button @click="handlePayButton" round block color="#F5C77A">立即解锁{{ buttonText }}</van-button>
                <div class="footer-text" @click="close">取消</div>
            </div>
        </template>
    </van-dialog>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { computed, reactive, toRefs } from "vue";
import { useStore } from "@/store";

export default {
    props: {
        mindfulness: {
            type: Object,
            default: {},
        },
        vipTypeList: {
            type: Array,
            default: [],
        },
    },
    components: {},
    setup(props, cxt) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            rights: [
                '100+专业研发的正念与冥想练习',
                '100+专业心理测评，可免费赠送好友',
                '海量高品质的自然声音与白噪音',
                '匠心打磨的小憩与睡眠故事',
                '陪伴放松、专注与助眠的旋律音乐',
                '一次开通，多平台使用',
                '解锁全部内容与高级功能',
            ],
            optionCurrent: 0,
            visible: false,
        });
        function close() {
            cxt.emit("update:show", false);
        }
        function handlePayButton() {
            cxt.emit("handlePay", state.optionCurrent);
        }
        // 调用支付
        function handleItem(type) {
            state.optionCurrent = type;
        }
        const buttonText = computed(() => state.optionCurrent == 1 ? ' 特惠VIP' : ' 特惠课程');
        function formattedPrice(price) {
            if (price) {
                return (price / 365).toFixed(2);
            }
            return '0.00';
        }
        return {
            ...toRefs(state),
            close,
            handleItem,
            buttonText,
            handlePayButton,
            formattedPrice
        };
    },
};
</script>

<style lang="less" scoped>
.open-vip-warper {
    width: 100%;
    height: auto;
    position: relative;
    padding: 0px 15px 20px 15px;

    .title-warper {
        margin-top: 20px;
        margin-bottom: 10px;
        width: 100%;
        .space-between();
        height: 30px;
        line-height: 30px;
        position: relative;

        .left {
            color: @gray-color;
            font-size: @font-size-lg;
        }

        .right {
            font-size: @font-size-sm;
            color: #D2AA82;
        }
    }

    .select-warper {
        position: relative;
        width: 100%;
        height: auto;

        .item {
            position: relative;
            height: auto;
            width: 100%;
            border-radius: 10px;

            &.current {
                .content {
                    border: 1px solid #D2AA82 !important;

                    .left {
                        color: goldenrod !important;
                    }

                    .right {
                        color: goldenrod;
                    }
                }
            }

            &.year-item {
                .content {
                    .left {
                        color: goldenrod;
                    }

                    border-radius: 0 0 5px 5px;
                }
            }

            &.alone-item {
                margin-top: 10px;

                .content {
                    border-radius: 5px;

                    .left {
                        color: #a1a1a1;
                    }
                }
            }

            .title {
                border-radius: 10px 10px 0px 0px;
                width: 100%;
                height: 30px;
                line-height: 30px;
                background-color: #D2AA82;
                color: #fff;
                font-size: 14px;
                text-align: center;
            }

            .content {
                border: 1px solid gainsboro;
                padding: 0 20px;
                width: 100%;
                .space-between();
                height: 50px;
                line-height: 50px;
                position: relative;

                .left {
                    font-size: @font-size-base;

                    .price {
                        font-size: @font-size-lg;
                        font-weight: bold;
                    }

                    .original-price {
                        font-size: @font-size-sm;
                        padding-left: 5px;

                        text-decoration: line-through;
                        color: #a1a1a1;
                    }
                }

                .right {
                    font-size: @font-size-base;
                    color: #a1a1a1;

                    .original-price {
                        font-size: @font-size-sm;
                        padding-left: 5px;
                        text-decoration: line-through;
                        color: #a1a1a1;
                    }
                }
            }
        }
    }

    .rights-list-warper {
        .item {
            line-height: 30px;
            font-size: @font-size-sm;

            i {
                color: #D2AA82;
                margin-right: 10px;
                font-weight: 400;
            }
        }
    }
}

.dialog-footer {
    padding: 20px 30px 20px 30px;
    text-align: center;

    :deep(.van-button__text) {
        font-size: 15px !important;
        font-weight: bold;
        // letter-spacing: 5px;
    }

    .footer-text {
        font-size: 14px;
        color: #a1a1a1;
        padding-top: 20px;
    }
}
</style>