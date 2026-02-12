<template>
	<div ref="el" class="charts"></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { px2number } from "@/utils/rem";
import * as echarts from "echarts";

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
					axisLabel: {
						show: index === 0,
					},
				})),
				nameGap: px2number(10), //维度名称与图形之间的距离
				center: ["50%", "52%"], //横坐标和纵坐标偏移距离
				radius: ["0%", "58%"], //雷达图大小，内半径和外半径
				startAngle: 90, //雷达图起始角度
				splitNumber: 5, //雷达图圈数
				shape: "circle",
				axisLabel: {
					//刻度样式
					show: true,
					color: "rgba(160, 160, 160, 0.3)",
					showMinLabel: false,
					fontSize: px2number(12),
					formatter: "{value}%",
					verticalAlign: "top",
					margin: -5,
					align: "left",
				},
				name: {
					color: "#fff",
					//   padding: [0, px2number(10), 0, px2number(10)],
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
	width: 345px;
	height: 300px;
	margin: 0 auto;
}
</style>

<!-- <template>
	<div ref="el" class="charts"></div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";

export default {
	props: {
		options: {
			type: Object,
			default: () => ({
				indicator: [],
				value: [],
				// color: "#f6727e",
			}),
		},
	},
	setup(props) {
		const el = ref(null);
		onMounted(() => nextTick(() => setOptions()));

		watch(
			() => props.options,
			() => setOptions(),
			{
				deep: true,
			}
		);

		function setOptions() {
			const chart = echarts.init(el.value);

			//   const data = [
			//     {
			//       value: props.options.value,
			//       areaStyle: {
			//         color: props.options.transparentColor || "rgba(246, 122, 134, 0.5)",
			//       },
			//     },
			//   ];

			const option = {
				// color: props.options.color || "#f6727e",

				radar: [
					{
						indicator: props.options.indicator,
						nameGap: 10, //维度名称与图形之间的距离
						center: ["50%", "50%"], //横坐标和纵坐标偏移距离
						radius: ["0%", "65%"], //雷达图大小，内半径和外半径
						startAngle: 90, //雷达图起始角度
						splitNumber: 4, //雷达图圈数
						axisLabel: {
							//刻度样式
							show: true,
							color: "rgba(160, 160, 160, 0.5)",
							showMinLabel: false,
							fontSize: "12px",
							formatter: "{value}%",
							verticalAlign: "top",
							margin: -4,
							align: "center",
						},
						name: {
							//维度名称设置
							formatter: "{value}",
							textStyle: {
								color: "#333",
								fontSize: "14px",
							},
							formatter: (text) => {
								text = text.replace(/\S{5}/g, (match) => {
									return match + "\n";
								});
								return text;
							},
						},
						splitArea: {
							//分隔区域
							areaStyle: {
								color: ["#FCFCFC", "#FCFCFC", "#FCFCFC", "#F7F7F7"], //圆环背景色
								// shadowColor: "rgba(210, 210, 210, .4)", //圆环阴影
								// shadowBlur: 100,
							},
						},
						axisLine: { lineStyle: { color: "rgb(210,210,247)" } }, //坐标轴轴线相关设置

						splitLine: {
							// (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
							lineStyle: {
								// type: ["dashed", "dashed", "dashed", "solid"],
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
						//  emphasis: { lineStyle: { width: 4 } },

						itemStyle: {
							// 单个拐点标志的样式设置。
							normal: {
								opacity: 0,
								// borderColor: "rgb(133,113,244)", // 拐点的描边颜色。[ default: '#000' ]
								// borderWidth: 5, // 拐点的描边宽度，默认不描边。[ default: 0 ]
								color: "rgb(133,113,244)",
							},
						},
						areaStyle: {
							color: "rgba(133,113,244,0.3)",
						},
						data: [
							{
								value: props.options.value,
							},
						],
					},
					{
						type: "radar",
						itemStyle: {
							// 单个拐点标志的样式设置。
							normal: {
								opacity: 0,
								color: "#B1B3F8",
							},
						},
						data: [
							{
								value: [100, 100, 100, 100],
							},
						],
					},
				
				],
			};
			chart.setOption(option);
		}
		return {
			el,
		};
	},
};
</script>

<style lang="less" scoped>
.charts {
	width: 345px;
	height: 270px;
	margin: 0 auto;
}
</style> -->
