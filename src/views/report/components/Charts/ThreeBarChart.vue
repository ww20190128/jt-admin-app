<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { px2number } from "@/utils/rem";
import * as echarts from "echarts";
const props = defineProps({
	options: {
		type: Object,
	},
});
// indicator
const xaxisData = computed(() =>
	props.options?.indicator?.map((item) => item.text)
);
const yaxisData = computed(() => props.options?.value);
// let xaxisData = ["1月", "2月", "3月", "4月", "5月"];
// let yaxisData = [1600, 1880, 1100, 2200, 2400];
const offsetX = px2number(16);
const offsetY = px2number(6);
// 绘制左侧面
const CubeLeft = echarts.graphic.extendShape({
	shape: {
		x: 0,
		y: 0,
	},
	buildPath: function (ctx, shape) {
		// 会canvas的应该都能看得懂，shape是从custom传入的
		const xAxisPoint = shape.xAxisPoint;
		const c0 = [shape.x, shape.y];
		const c1 = [shape.x - offsetX, shape.y - offsetY];
		const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
		const c3 = [xAxisPoint[0], xAxisPoint[1]];
		ctx
			.moveTo(c0[0], c0[1])
			.lineTo(c1[0], c1[1])
			.lineTo(c2[0], c2[1])
			.lineTo(c3[0], c3[1])
			.closePath();
	},
});

// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
	shape: {
		x: 0,
		y: 0,
	},
	buildPath: function (ctx, shape) {
		const xAxisPoint = shape.xAxisPoint;
		const c1 = [shape.x, shape.y];
		const c2 = [xAxisPoint[0], xAxisPoint[1]];
		const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
		const c4 = [shape.x + offsetX, shape.y - offsetY];
		ctx
			.moveTo(c1[0], c1[1])
			.lineTo(c2[0], c2[1])
			.lineTo(c3[0], c3[1])
			.lineTo(c4[0], c4[1])
			.closePath();
	},
});

// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
	shape: {
		x: 0,
		y: 0,
	},
	buildPath: function (ctx, shape) {
		const c1 = [shape.x, shape.y];
		const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
		const c3 = [shape.x, shape.y - offsetX];
		const c4 = [shape.x - offsetX, shape.y - offsetY];
		ctx
			.moveTo(c1[0], c1[1])
			.lineTo(c2[0], c2[1])
			.lineTo(c3[0], c3[1] + 4)
			.lineTo(c4[0], c4[1])
			.closePath();
	},
});

// 注册三个面图形
echarts.graphic.registerShape("CubeLeft", CubeLeft);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

const option = {
	backgroundColor: "transparent",
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
		// backgroundColor: "rgba(255,255,255,0.75)",
		// extraCssText: "box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.3);",
		textStyle: {
			fontSize: px2number(14),
			color: "#333",
		},
		formatter: (params) => {
			const item = params[1];
			return `${item.value}%`;
		},
	},
	grid: {
		left: "0%",
		right: "5%",
		top: "5%",
		bottom: "5%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		data: xaxisData.value,
		axisLine: {
			show: true,
			lineStyle: {
				width: 1,
				color: "#333",
			},
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			fontSize: px2number(14),
			color: "#333",
			padding: px2number(4),
		},
	},
	yAxis: {
		type: "value",
		max: 100, //最大值
		min: 0, //最小值
		nameTextStyle: {
			color: "#333",
			fontWeight: 400,
			fontSize: px2number(14),
		},
		axisLine: {
			show: true,
			lineStyle: {
				width: 1,
				color: "#333",
			},
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: "#999997",
				type: "dashed",
			},
		},
		axisTick: {
			show: false,
		},

		axisLabel: {
			fontSize: px2number(12),
			color: "#999997",
			formatter: function (value) {
				//百分比显示
				return `${value}%`;
			},
		},
	},
	series: [
		{
			type: "custom",
			renderItem: (params, api) => {
				const location = api.coord([api.value(0), api.value(1)]);
				return {
					type: "group",
					children: [
						{
							type: "CubeLeft",
							shape: {
								api,
								xValue: api.value(0),
								yValue: api.value(1),
								x: location[0],
								y: location[1],
								xAxisPoint: api.coord([api.value(0), 0]),
							},
							style: {
								fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 1,
										color: "#FEEAA1",
									},
									{
										offset: 0,
										color: "#E4B612",
									},
								]),
							},
						},
						{
							type: "CubeRight",
							shape: {
								api,
								xValue: api.value(0),
								yValue: api.value(1),
								x: location[0],
								y: location[1],
								xAxisPoint: api.coord([api.value(0), 0]),
							},
							style: {
								fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 1,
										color: "#FEEAA1",
									},
									{
										offset: 0,
										color: "#FACA2F",
									},
								]),
							},
						},
						{
							type: "CubeTop",
							shape: {
								api,
								xValue: api.value(0),
								yValue: api.value(1),
								x: location[0],
								y: location[1],
								xAxisPoint: api.coord([api.value(0), 0]),
							},
							style: {
								fill: "#FDE58A",
							},
						},
					],
				};
			},
			data: yaxisData.value,
		},
		{
			type: "bar",
			itemStyle: {
				normal: {
					color: "transparent",
					label: {
						show: true, //开启显示
						position: "top", //在上方显示
						formatter: function ({ value }) {
							return `${value}%`;
						},
						textStyle: {
							//数值样式
							color: "black",
							fontSize: px2number(14),
							padding: px2number(16),
						},
					},
				},
			},
			data: yaxisData.value,
		},
	],
};
const el = ref(null);
function setOptions() {
	const chart = echarts.init(el.value);
	chart.setOption(option);
}
onMounted(() => {
	nextTick(() => setOptions());
});
// watch(
//   () => props.options,
//   () => setOptions(),
//   {
//     deep: true,
//   }
// );
</script>

<template>
	<div ref="el" class="charts"></div>
</template>

<style lang="less" scoped>
.charts {
	width: 100%;
	height: 300px;
	margin: 0 auto;
}
</style>
