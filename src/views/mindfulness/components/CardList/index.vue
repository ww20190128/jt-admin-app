<template>
    <div class="card-list" v-if="mindfulnessList.length > 0">
        <div class="item" v-for="item in mindfulnessList" :key="item.id" @click="handleItem(item)">
            <div class="img">
                <van-image :src="item.coverImg">
                </van-image>
                <img v-if="tagImg" class="tag" :src="tagImg"></img>
            </div>
            <div class="info-warper">
                <div class="title">{{ item.name }}</div>

            </div>
            <div class="vip-tag" :class="{ free: item.price <= 0 }">{{ item.price <= 0 ? '免费' : '会员' }}</div>
                    <div class="info-tag"><span class="type">{{ item.audioNum > 1 ? '系列' : '单课' }}</span><span
                            class="time">{{ item.totalTime }}分钟</span></div>
            </div>
        </div>
        <div class="no-data" v-else>
            <!-- <img src="@/assets/images/collect-bg.png" />
            <p>暂无课程</p> -->
        </div>

</template>
<!-- 首页卡片 -->
<script>
import { useRouter } from "vue-router";

export default {
    name: "CardList",
    props: {
        mindfulnessList: {
            type: Array,
            default: () => ({}),
        },
        tagImg: {
            type: String,
            default: "",
        },
    },
    setup() {
        const router = useRouter();
        function handleItem({ id }) {
            router.push({
                path: "/mindfulness/detail",
                query: {
                    mindfulnessId: id,
                },
            });
        }
        return {
            handleItem
        };
    },
};
</script>

<style lang="less" scoped>
.van-icon {
    font-size: 20px;

    img {
        width: 20px;
        height: 20px;
    }
}

.no-data {
    height: 100% !important;
    position: relative;
    text-align: center;

    img {
        margin-top: 20%;
        width: 30%;
        height: auto;
    }

    p {
        text-align: center;
        color: @gray-color;
        font-size: @font-size-base;
    }
}

.card-list {
    padding: 10px 10px;
    display: flex;
    flex-wrap: wrap;
    background: #F7F7F7;

    .item {
        background: #ffff;
        width: 48%;

        .pointer();

        &:nth-child(2n + 1) {
            margin-right: 4%;
        }

        margin-bottom: 20px;

        .img {
            position: relative;
            width: 100%;

            .van-image {
                width: 100%;
                height: auto;

                :deep(img) {
                    border-radius: 2px;
                }
            }

            .tag {
                position: absolute;
                right: -10px;
                top: -5px;
                width: 40px;
                height: auto;
            }

        }

        .info-warper {
            padding: 0 2px;
            text-align: left;
            height: 20px;
            line-height: 20px;

            .title {
                font-weight: 500;
                font-size: @font-size-base;
            }
        }

        position: relative;

        .vip-tag {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            width: 27px;
            height: 13px;
            padding-left: 3px;
            background-color: #ffd427;
            color: #fff;
            text-align: center;
            line-height: 13px;
            position: absolute;
            font-size: 14px;
            right: 0;
            top: 5px;
            font-size: 10px;

            &.free {
                background-color: #9FD4FF !important;
            }
        }

        .info-tag {
            position: absolute;
            left: 5px;
            bottom: 35px;
            height: 13px;
            line-height: 13px;

            .type {
                padding: 2px 3px;
                color: #fff;
                font-size: 10px;
                display: inline-block;
                background-color: #9FD4FF;
            }

            .time {
                border: 1px solid #6bbbfd;
                display: inline-block;
                opacity: 0.8;
                color: #9FD4FF;
                padding: 1px 2px;
                font-size: 10px;
                background-color: #5a5a5a;
            }
        }


        .bottom {
            .space-between();
            height: 22px;
            line-height: 22px;

            .text {
                color: @gray-color;
                flex: 1;
                font-size: @font-size-sm !important;

                .icon {
                    color: @theme-color;
                }
            }

            .go-button {
                text-align: center;
                // padding: 0 @padding-sm;
                color: #fff;
                font-size: @font-size-sm !important;
                background-color: @theme-color;
                border-radius: 15px;
                width: 70px;
            }
        }
    }
}
</style>