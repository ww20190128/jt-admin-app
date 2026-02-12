<template>
    <div class="steps-wrapper" v-if="steps.length">
        <Steps :value="stepValue" :steps="steps" :currentStepNumber="stepQuestionNumber" />
        <div class="steps-progress">
            <div class="progress">
                <van-progress color="#ff905b" :percentage="currentStepPercentage" :stroke-width="px2rem('10px')"
                    :show-pivot="false" />
            </div>
        </div>
    </div>
    <div class="progress-wrapper" v-else>
        <div class="progress">
            <van-progress color="#ff905b" :percentage="percentage" :stroke-width="px2rem('10px')" :show-pivot="false" />
        </div>
    </div>
</template>

<script>
// 答题进度条
import { computed, onMounted } from "vue";
import { useStore } from "@/store";

export default {
    name: "questionSteps",
    props: {
        vertical: {
            type: Boolean,
            default: false,
        },
        showTitle: {
            type: Boolean,
            default: true,
        },
    },
    setup() {
        const store = useStore();
        const wechatInfo = computed(() => store.getters.wechatInfo || {});
        return {
            wechatInfo,
        };
    },
};
</script>

<style lang="less" scoped>
.steps-wrapper {
    .steps-progress {
        display: flex;
        align-items: center;
        padding-top: 15px;
        padding-bottom: 15px;
        margin: 0 28px;
        .value {
            font-size: 14px;
            padding-right: 10px;
            color: #b0b0b0;

            .current {
                font-weight: bold;
                font-size: 16px;
                color: #ff905b;
            }
        }
        .progress {
            flex: 1;
        }
    }
}

.progress-wrapper {

    margin-top: 30px;
    margin-bottom: 10px;
    width: 80%;
    margin-left: 10%;
    display: flex;
    align-items: center;

    :deep(.van-progress) {
        border-radius: 999px;
        overflow: hidden;
    }

    .value {
        font-size: @font-size-sm;
        margin-right: 10px;
        color: #b0b0b0;

        .current {
            font-size: @font-size-lg;
            color: #ff905b;
        }
    }
    .progress {
        // width: 200px;
        flex: 1;
    }

}
</style>