<template>
	<div ref="el" class="charts"></div>
</template>
<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
import { px2number } from "@/utils/rem";
const props = defineProps({
	data: {
		type: Array,
	},
});
const el = ref(null);
onMounted(() => nextTick(() => setOptions()));

function setOptions() {
	const chart = echarts.init(el.value);

	const option = {
		radar: [
			{
				indicator: props.data.map((item, index) => ({
					...item,
					max: 100,
					axisLabel: { show: index === 0 },
				})),
				nameGap: px2number(10), //维度名称与图形之间的距离
				center: ["50%", "55%"], //横坐标和纵坐标偏移距离
				radius: ["0%", "60%"], //雷达图大小，内半径和外半径
				startAngle: 90, //雷达图起始角度
				splitNumber: 5, //雷达图圈数
				shape: "circle",
				axisLabel: {
					//刻度样式
					show: true,
					// color: "rgba(160, 160, 160, 0.3)",
					showMinLabel: false,
					fontSize: px2number(12),
					// formatter: "{value}%",
					verticalAlign: "top",
					margin: -5,
					align: "left",
				},
				name: {
					color: "#fff",
					padding: [0, px2number(10), 0, px2number(10)],
					formatter: function (text) {
						const item = props.data.find((item) => item.name === text);
						return `{a|${text}}\n{b|分值} {c|${item.value}}`;
					},
					lineHeight: px2number(20),
					rich: {
						a: {
							color: "#333333",
							fontSize: px2number(14),
							align: "center",
						},
						b: {
							color: "#888888",
							fontSize: px2number(12),
							align: "center",
							lineHeight: px2number(24),
						},
						c: {
							color: "#615CF4",
							fontSize: px2number(14),
							align: "center",
							fontWeight: "bold",
							lineHeight: px2number(24),
						},
					},
				},
				splitArea: {
					//分隔区域
					areaStyle: {
						color: ["#FCFCFC", "#FCFCFC", "#FCFCFC", "#F7F7F7"], //圆环背景色
					},
				},
				axisLine: { lineStyle: { color: "rgb(210,210,247)" } }, //坐标轴轴线相关设置

				splitLine: {
					// (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
					lineStyle: {
						type: "dashed",
						color: "rgb(210,210,247)", // 分隔线颜色
						width: 1, // 分隔线线宽
					},
				},
			},
		],
		series: [
			{
				type: "radar",
				itemStyle: {
					// 单个拐点标志的样式设置。
					normal: {
						opacity: 0,
						color: "rgb(133,113,244)",
					},
				},
				areaStyle: {
					color: "rgba(133,113,244,0.3)",
				},
				data: [
					{
						value: props.data.map((item) => item.value),
					},
				],
			},
		],
	};
	chart.setOption(option);
}
</script>

<style lang="less" scoped>
.charts {
	width: 100%;
	height: 300px;
	margin: 0 auto;
}
</style>
