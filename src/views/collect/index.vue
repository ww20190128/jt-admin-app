<template>
    <div class="collect-warper">
        <div class="test-paper-warper" v-if="collectTestPaperList.length >= 1">
            <div class="title-warper">测评</div>
            <div class="card-list">
                <div class="item test-paper-item" v-for="(item, index)  in collectTestPaperList" :key="item.id" @click="handleItem(item)">
                   
                    <div class="collect-tag" :class="{ collected: item.collectStatus == 1 }"
                        @click.stop="handleDoCollect(item, 1)">
                        <i class="fa fa-heart" v-if="item.collectStatus == 1"></i>
                        <i class="fa fa-heart-o" v-else></i>
                    </div>
                    <div class="img">
                        <van-image :src="item.mainImg">
                        </van-image>
                        <img v-if="tagImg" class="tag" :src="tagImg"></img>
                    </div>
                    <div class="title">{{ item.name }}</div>
                    <div class="bottom">
                        <div class="text">
                            <!-- <i class="icon fa fa-heart"></i> -->
                            {{ item.saleNum }}人测过
                        </div>
                        <div class="go-button" >立即测试</div>
                    </div>
                </div>
            </div>
            <div class="card-split" v-if="collectMindfulnessList.length >= 1"></div>
        </div>

        <div class="mindfulness-warper" v-if="collectMindfulnessList.length >= 1">
            <div class="title-warper">正念课程</div>
            <div class="card-list">
                <div class="item" v-for="(item, index)  in collectMindfulnessList" :key="item.id" @click="handleMindfulnessItem(item)">
                    <div class="collect-tag" :class="{ collected: item.collectStatus == 1 }"
                        @click.stop="handleDoCollect(item, 2)">
                        <i class="fa fa-heart" v-if="item.collectStatus == 1"></i>
                        <i class="fa fa-heart-o" v-else></i>
                    </div>
                    <div class="img">
                        <van-image :src="item.coverImg">
                        </van-image>
                        <img v-if="tagImg" class="tag" :src="tagImg"></img>
                    </div>
                    <div class="title mindfulness-title">{{ item.name }}</div>
                </div>
            </div>
        </div>

        <div class="no-data" v-if="collectTestPaperList.length <= 0 && collectMindfulnessList.length <= 0">
            <img src="@/assets/images/collect-bg.png" />
            <p>暂无收藏测</p>
        </div>
    </div>
</template>

<script>

import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCollectList, doCollect } from "@/api/testPaper";
import { Toast } from "vant";
export default {
    name: "collect",
    setup() {
        const router = useRouter();
        const state = reactive({
            collectTestPaperList: [],
            collectMindfulnessList: [],
        });
        onMounted(() => init());

        // 获取列表数据
        async function init() {
            const { testPapers, mindfulnesss } = await getCollectList(state.query);
            state.collectTestPaperList = [...testPapers];
            state.collectMindfulnessList = [...mindfulnesss];
        }
        // 收藏或取消收藏
        async function handleDoCollect(item, type = 1) {
            if (type == 1) {
                const {
                    collectStatus
                } = await doCollect({ testPaperId: item.id });
                item.collectStatus = collectStatus;
            } else {
                const {
                    collectStatus
                } = await doCollect({ mindfulnessId: item.id });
                item.collectStatus = collectStatus;
            }
            Toast(item.collectStatus === 0 ? '取消收藏' : '加入收藏');
        }
        function handleItem({ id }) {
            router.push({
                path: "/detail",
                query: {
                    testPaperId: id,
                },
            });
        }
        function handleMindfulnessItem({ id }) {
            router.push({
                path: "/mindfulness/detail",
                query: {
                    mindfulnessId: id,
                },
            });
        }
        return {
            ...toRefs(state),
            handleItem,
            handleMindfulnessItem,
            handleDoCollect,
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

.title-warper {
    font-size: 18px;
    font-weight: bold;
    padding-left: 5px;
    margin-left: 10px;
    border-left: 4px solid rgba(244, 164, 96, 1);
    font-weight: bold !important;
}

.collect-warper {
    background: #F7F7F7;
    width: 100%;
    min-height: 80vh;
    position: relative;
    padding-top: 10px;
    padding-bottom: 20px;

    .no-data {
        position: relative;
        width: 100%;
        height: 100vh;
        position: relative;
        text-align: center;
        background: #F7F7F7;

        img {
            margin-top: 30%;
            width: 50%;
            height: auto;
        }

        p {
            text-align: center;
            color: @gray-color;
            font-size: @font-size-base;
        }
    }

    .card-list {
        padding: 10px 10px 0px 10px;
        background: #F7F7F7;
        min-height: 80%;
        display: flex;
        flex-wrap: wrap;

        .item {
            background-color: #fff;
            width: 48%;
            .pointer();

            &:nth-child(2n + 1) {
                margin-right: 4%;
            }
            &.test-paper-item {
                padding-bottom: 10px;
            }
            
            position: relative;

            .collect-tag {
                width: 20px;
                height: 20px;
                // border-radius: 50%;
                // background-color: #000;
                text-align: center;
                position: absolute;
                right: 2px;
                top: 2px;
                font-size: 15px;
                z-index: 1;
                opacity: 0.4;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;

                &.collected {
                    color: red !important;
                }
            }

            margin-bottom: @padding-base;

            .img {
                position: relative;
                width: 100%;
                min-height: 90px;

                .van-image {
                    width: 100%;
                    min-height: 90px;
                    height: auto;

                    :deep(img) {
                        border-radius: 5px;
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

            .title {
                text-align: left;
                font-weight: bold;
                font-size: @font-size-base;
                height: 32px;
                line-height: 32px;
                .ellipsis();
                padding: 0px 2px;
            }

            .bottom {
                padding: 0px 2px;
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

}
</style>