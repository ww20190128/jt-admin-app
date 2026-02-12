<template>
	<div class="WGZSM-01">
		<LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />
		<div class="name">{{ result }}</div>
		<!-- 简介内容 -->
		<RichTextBody :data="setting?.jianjie" />
		<VerticalBarChart :options="options" />
	</div>
</template>

<script>
import { toRefs, computed } from "vue";
import RichTextBody from "../../components/RichTextBody";

import LargeTitle from "../../components/LargeTitle";
import VerticalBarChart from "../../components/Charts/VerticalBarChart";
export default {
	name: "03",
	components: {
		LargeTitle,
		VerticalBarChart,
		RichTextBody
	},
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const { setting } = props.data;
	
		const { left_text, right_text } = props.data?.setting ?? {};
		const options = {
			xAxisData: [left_text, right_text],
			seriesData: [
				{
					value: setting?.l1_percent,
					itemStyle: {
						color: "#5A84FE",
					},
				},
				{
					value: setting?.l2_percent,
					itemStyle: {
						color: "#FF8383",
					},
				},
			],
		};

		const result = computed(() => {
			if (setting.l1_percent >= 50 && setting.l2_percent >= 50) {
				return "双性化型";
			} else if (setting.l1_percent >= 50 && setting.l2_percent < 50) {
				return "男性化型";
			} else if (setting.l1_percent < 50 && setting.l2_percent >= 50) {
				return "女性化型";
			} else if (setting.l1_percent < 50 && setting.l2_percent < 50) {
				return "未分化型";
			}
		});
		const analyse = computed(() => {
			if (setting.l1_percent >= 50 && setting.l2_percent >= 50) {
				return setting.all_result;
			} else if (setting.l1_percent >= 50 && setting.l2_percent < 50) {
				return setting.man_result;
			} else if (setting.l1_percent < 50 && setting.l2_percent >= 50) {
				return setting.woman_result;
			} else if (setting.l1_percent < 50 && setting.l2_percent < 50) {
				return setting.weifenhua_result;
			}
		});

		return {
			...toRefs(props.data),
			analyse,
			options,
			result,
		};
	},
};
</script>

<style lang="less" scoped>
.WGZSM-01 {
	padding: 0 @padding-base;
}
.name {
	color: @theme-color;
	font-weight: bold;
	text-align: center;
	padding: @padding-base 0;
	font-size: 20px;
}
</style>
