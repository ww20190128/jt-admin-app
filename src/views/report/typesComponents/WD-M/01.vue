<template>
    <div class="WD-M-01">
        <div class="top">
            <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />

            <!-- 简介内容 -->
            <RichTextBody :data="setting?.jianjie" />

            <Tabs v-model:active="active">
                <TabItem :name="index" v-for="(item, index) in duoweiduParentList" :key="item.id">
                    {{ item.weidu_name }}
                </TabItem>

            </Tabs>

            <!-- 简介 -->
            <RichTextBody :data="currentResult.jianjie" />
            <div class="result-name" :style="{ color: currentResult.extend?.weidu_color }">
                {{ currentResult.weidu_result?.name }}</div>
            <!-- 网状图 -->
            <MeshChart v-if="currentResult.extend?.weidu_show == 1" :options="meshChartOption" />
            <!-- 半环形图 -->
            <HalfRingChart v-if="currentResult.extend?.weidu_show == 2" :options="halfRingChartOption" />

            <!-- 结果分析 -->
            <RichTextBody :data="currentResult.weidu_result?.result_explain" />
            <!-- 建议指导 -->
            <Suggest :data="currentResult.weidu_result?.jianyi" />
            <!-- 注意事项-->
            <Warning :data="currentResult.weidu_result?.zhuyi" />

            <!-- 详细解答 -->
            <RichTextBody :data="currentResult.xiangxijieda" />

            <!-- 子维度循环 -->
            <template v-for="item in currentResult.child_duoweidu" :key="item.id">

                <!-- 带结果判断 -->
                <template v-if="item.extend?.child_weidu_result == 1">
                    <!-- 结果 -->
                    <ResultName :title="item.weidu_name" :result="item.weidu_result?.name"
                        :color="item.extend.weidu_color" titleColor="#5a5a5a" />
                    <PositionBar :value="item.last_percent"
                        :multi="[item.extend?.duorenshu.min_score, item.extend?.duorenshu.max_score]"
                        :color="item.extend.weidu_color" />

                    <!-- 结果分析 -->
                    <RichTextBody :data="item.weidu_result?.result_explain" />

                    <!-- 建议指导 -->
                    <Suggest :data="item.weidu_result?.jianyi" />
                    <!-- 温馨提示 -->
                    <Warning :data="item.weidu_result?.zhuyi" title="温馨提示" icon="fa vaaeq fa-bullhorn" />
                </template>
                <!-- 不带结果判断 -->
                <template v-if="item.extend?.child_weidu_result == 2">

                    <!-- 简介 -->
                    <RichTextBody :data="item.jianjie" />
                    <div class="name">{{ item.weidu_name }}</div>
                    <PositionBar :value="item.last_percent"
                        :multi="[item.extend?.duorenshu.min_score, item.extend?.duorenshu.max_score]"
                        :color="item.extend.weidu_color" />

                    <!-- 详细解答 -->
                    <RichTextBody :data="item.xiangxijieda" />

                </template>

            </template>
        </div>
        <div class="bottom" v-if="currentResult.tuozhanyuedu">
            <!-- 扩展阅读 -->
            <RichTextBody :data="currentResult.tuozhanyuedu" />

        </div>
    </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import MeshChart from "../../components/Charts/MeshChart";
import HalfRingChart from "../../components/Charts/HalfRingChart";
import ResultName from "../../components/ResultName";
export default {
    name: "01",
    components: {
        PositionBar,
        Tabs,
        TabItem,
        Suggest,
        Warning,
        LargeTitle,
        RichTextBody,
        MeshChart,
        HalfRingChart,
        ResultName,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        const state = reactive({
            active: 0,
        });
        // 当前tab展示的内容
        const currentResult = computed(() => {
            return props.data.duoweiduParentList[state.active] || {};
        });
        // 半环形图数据
        const halfRingChartOption = computed(() => {
            return {
                color: currentResult.value.extend?.weidu_color,
                value: currentResult.value.last_percent,
            };
        });
        // 网状图数据
        const meshChartOption = computed(() => {
            const indicator = currentResult.value.child_duoweidu.map((v, index) => ({
                text: v.weidu_name,
                max: 100,
                axisLabel: { show: index === 0 ? true : false },
            }));

            const value = currentResult.value.child_duoweidu.map(
                (v) => v.last_percent
            );

            return {
                value,
                indicator,
            };
        });
        return {
            ...toRefs(state),
            ...toRefs(props.data),
            currentResult,
            halfRingChartOption,
            meshChartOption,
        };
    },
};
</script>

<style lang="less" scoped>


.name {
    font-size: @font-size-lg;
    color: @theme-color;
    padding: @padding-sm 0;
}

.result-name {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: @theme-color;

    
}
</style>