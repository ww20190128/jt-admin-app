<template>
    <transition name="van-fade">
        <div class="animation-content" v-show="show">
            <div class="top-warper">
                <div class="title-warper">
                    <div class="title">
                        您的《{{ testPaperInfo.name }}》报告
                    </div>
                    <div class="loading">
                        正在生成中
                        <div class="loading-d">...</div>
                    </div>
                </div>
                <img :src="testPaperInfo.coverImg">
            </div>
            <div class="bottom">
                <div class="card">
                    <div class="header">
                        <van-tabs ref="tabsRef" v-model:active="activeIndex" color="#83a4f8"
                            title-active-color="#83a4f8" :before-change="() => false">
                            <van-tab v-for="item in reportProcessList" :key="item.id" :title="item.name"
                                title-class="tab-title" />
                        </van-tabs>
                    </div>
                    <div class="card-content">
                        <div class="item" v-for="item in progressList" :key="item.id">
                            <p class="title">{{ item.title }}</p>
                            <van-progress :show-pivot="false" color="#ffd427" :percentage="item.percentage"
                                stroke-width="4" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<script setup>
import { ref, unref, watch, computed } from "vue"
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    testPaperInfo: {
        type: Object,
    },
    reportProcessList: {
        type: Object,
    }
})
const tabsRef = ref(null)
watch(() => props.show, (show) => {
    if (!show) return
    unref(tabsRef).resize()
    createInterval()
})
const activeIndex = ref(0)

const progressList = computed(() => {
    const index = activeIndex.value;
    return props.reportProcessList[index]?.subList
})


const itemIndex = ref(0)

const progressTime = computed(() => {
    const currentItem = unref(progressList)[unref(itemIndex)]
    const time = Number(currentItem.executeTime)
    return time / 100
})


const emits = defineEmits(['over'])
function createInterval() {

    const timer = ref(null)

    if (unref(itemIndex) > unref(progressList).length - 1) {
        if (activeIndex.value === props.reportProcessList.length - 1) {
            return emits('over')
        }
        activeIndex.value += 1
        itemIndex.value = 0;
        createInterval()
        return

    }
    const currentTab = props.reportProcessList[unref(activeIndex)]
    const progress = currentTab.subList[unref(itemIndex)]

    if (!progress) return
    timer.value = setInterval(() => {
        if (progress.percentage >= 100) {
            clearInterval(timer.value)
            itemIndex.value++
            return setTimeout(() => {
                createInterval()
            }, 500);
        }
        if (!progress.percentage) {
            progress.percentage = 1
        } else {
            progress.percentage += 1;
        }
    }, unref(progressTime))
}

</script>

<style lang="less" scoped>
@keyframes rotateAnimation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animation-content {
    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    background-color: #EAE9F1;

    .top-warper {
        height: 230px;
        background-color: #83a4f8;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            border-radius: 50%;
            width: 100px;
            animation: rotateAnimation 3s linear infinite;
            transition: transform 0.5s ease;
        }

        .title-warper {
            font-size: 16px;
            text-align: center;
            color: #fff;
            padding: 10px 0;

            div {
                font-size: 16px;
            }
        }
    }

    .bottom {
        flex: 1;
        padding: 0 @padding-base;

        .card {
            margin-top: -20px;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            font-size: 14px;

            .header {
                padding-top: 16px;

                :deep(.van-tabs__nav) {
                    .van-tabs__line {
                        width: 64px;
                    }
                }

                :deep(.tab-title) {
                    font-size: 16px;

                    &.van-tab--active {
                        font-weight: bold;

                    }

                }
            }

            .card-content {
                padding: 20px 15px;

                .item {
                    .title {
                        font-size: 16px;
                        padding-bottom: 10px;
                        color: #3f3f3f;
                    }

                    margin-bottom: 20px;

                    &:last-child {
                        margin: 0;
                    }
                }
            }
        }
    }
}




.loading-d {
    display: inline-block;
    font-family: monospace;
    clip-path: inset(0 3ch 0 0);
    animation: l 1s steps(4) infinite;
}

@keyframes l {
    to {
        clip-path: inset(0 -1ch 0 0)
    }
}
</style>