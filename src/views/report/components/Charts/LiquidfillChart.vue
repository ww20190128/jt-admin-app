<template>
	<div ref="el" class="liquid-fill-chart"></div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";
import { px2number } from "@/utils/rem";
export default {
	name: "HalfRingChart",
	props: {
		options: {
			type: Object,
			default: () => ({
				color: "#F6727E",
				clearColor: "#FEDDDD",
				value: 0,
			}),
		},
	},
	setup(props) {
		const el = ref(null);
		onMounted(() => nextTick(() => setOptions()));
		function setOptions() {
			const chart = echarts.init(el.value);
			const option = {
				series: [
					{
						type: "liquidFill",
						radius: "90%", // 半径大小
						center: ["50%", "50%"], // 布局位置
						data: [props.options?.value / 100], // 水球波纹值
						color: [props.options?.clearColor], // 设置颜色系列
						backgroundStyle: {
							color: "#fff",
						},
						// phase: 10,
						amplitude: 12, // 振幅设置为0，表示水平波浪
						outline: {
							// 轮廓设置
							show: true,
							borderDistance: px2number(2), // 轮廓间距
							itemStyle: {
								borderColor: props.options?.color, // 轮廓颜色
								borderWidth: px2number(6), // 轮廓大小
								shadowBlur: "none", // 轮廓阴影
							},
						},
						itemStyle: {
							shadowBlur: 0, // 波浪的阴影范围
						},
						label: {
							insideColor: "#f64a4a",
							show: true,
							color: props.options?.color,
							fontSize: px2number(42),
							borderColor: props.options?.color,
							//formatter: '{c}' 输出纯文本
							formatter: function (param) {
								return (param.value * 100).toFixed(0);
							},
						},
						emphasis: {
							itemStyle: {
								color: props.options?.clearColor,
								//悬停样式
								opacity: 1,
							},
						},
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
.liquid-fill-chart {
	width: 180px;
	height: 180px;
	margin: 0 auto;
}
</style>
