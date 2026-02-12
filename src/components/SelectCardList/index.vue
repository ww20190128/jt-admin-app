<template>
    <div class="select-card-list">
        <div class="left-card item" @click="handleItem(leftData)">
            <div class="top">
                <div class="left">
                    <div class="img">
                        <van-image :src="leftData.coverImg" class="cover"></van-image>
                    </div>
                </div>
                <div class="right">
                    {{ leftData.name }}
                </div>
            </div>
            <div class="bottom-warp">
                <span>{{ leftData.saleNum }}人已测</span>
            </div>
            <div class="tag-button">
                去测试
            </div>
        </div>

        <div class="right-card item" @click="handleItem(rightData)">
            <div class="top">
                <div class="left">
                    <div class="img">
                        <van-image :src="rightData.coverImg" class="cover"></van-image>
                    </div>
                </div>
                <div class="right">
                    {{ rightData.name }}
                </div>
            </div>
            <div class="bottom-warp">
                <span>{{ rightData.saleNum }}人已测</span>
            </div>
            <div class="tag-button">
                去测试
            </div>
        </div>
    </div>
</template>
<!-- 首页卡片 -->
<script>
import { useRouter } from "vue-router";
import { computed } from "vue";

export default {
    name: "SelectCardList",
    props: {
        leftData: {
            type: Object,
            default: () => {},
        },
        rightData: {
            type: Object,
            default: () => {},
        },
    },
    setup(props) {
        const router = useRouter();
        // const left = computed(() => {
        //     const [value] = props.data.splice(0, 1);
        //     return value || {};
        // });
        // const right = computed(() => {
        //     const [value] = props.data.splice(1, 1);
        //     return value || {};
        // });
        const style = computed(() => {
            return {
                background: `linear-gradient(rgba(228, 228, 228, 0), rgba(0, 0, 0, 0.5)),
    url(${first.value.coverImg}) center
      center / 100% no-repeat`,
            };
        });

        function handleItem({ id }) {
            router.push({
                path: "/detail",
                query: {
                    testPaperId: id,
                },
            });
        }
        return {
            // left,
            // right,
            style,
            handleItem,
        };
    },
};
</script>

<style lang="less" scoped>
.select-card-list {
    width: 100%;
    .space-between();
    padding: 5px 0;

    .left-card {
        background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    }

    .right-card {
        background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    }

    .item {
        height: 90px;
        box-shadow: 0px 0px 6px #8f8f8f;
        width: 48%;
        padding: 5px;
        border-radius: @radius-base;
        color: white;
        position: relative;

        .tag-button {
            text-align: center;
            line-height: 22px;
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: @font-size-base;
            padding-left: 5px;
            height: 22px;
            width: 65px;
            border-top-left-radius: 18px;
            background-color: #fff;
            border-bottom-right-radius: @radius-base;
            color: @theme-color;
            font-weight: 400;
        }

        .bottom-warp {
            position: absolute;
            bottom: 5px;
            left: 5px;
            text-align: left !important;
            span {
                color: #fff;
                font-size: @font-size-sm;
            }
        }

        .top {
            .space-between();

            .left {
                .img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: aliceblue;
                    padding-top: 3px;
                    text-align: center;

                    .cover {
                        width: 33px;
                        height: 33px;
                        border-radius: 50%;
                        background-color: aliceblue;

                        :deep(img) {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
            }

            .right {
                padding-left: 5px;
                font-weight: bold;
                font-size: @font-size-base;
            }
        }

    }
}
</style>