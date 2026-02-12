<script setup>
import { computed } from "vue";
import ContentWrapper from "../ContentWrapper";
import RadarChart from "../Content05/RadarChart";

const props = defineProps({
	data: {
		type: Object,
	},
});
const childWeiduList = computed(() => props.data?.childWeiduList);
const dataList = computed(() =>
	childWeiduList.value
		.sort((a, b) => b.last_percent - a.last_percent)
		.slice(5, 10)
);

const radarChartData = computed(() =>
	dataList.value.map((item) => ({
		name: item.weidu_name,
		value: parseInt(item.last_percent),
	}))
);
const CN_NUMBERS = ["六", "七", "八", "九", "十"];
</script>

<template>
	<ContentWrapper
		title="你值得关注的五大优势才干"
	>
		<div class="wrapper">
			<div class="chart">
				<RadarChart :data="radarChartData" />
				<div class="card-bg">
					{{ data.setting?.cgjs }}
				</div>
			</div>
			<div class="content" v-for="(item, index) in dataList" :key="index">
				<!-- 标题 -->
				<div class="content-title">
					<img
						src="@/assets/images/gallup/arrow-left.png"
						class="arrow arrow-left"
					/>
					<span class="text"
						>第{{ CN_NUMBERS[index] }}优势：{{ item.weidu_name }}</span
					>
					<img
						src="@/assets/images/gallup/arrow-left.png"
						class="arrow arrow-right"
					/>
				</div>
				<div class="rank">
					<div class="left">
						<div
							class="item"
							v-for="(child, index) in childWeiduList.slice(0, 10)"
							:key="index"
							:style="{
								backgroundColor:
									item.score_sort === child.score_sort ? item.p_extend?.weidu_color : '#c9c7ca',
							}"
						></div>
					</div>
					<div class="right">
						<div
							class="item"
							v-for="(child, index) in childWeiduList.slice(10, 34)"
							:key="index"
							:style="{
								backgroundColor:
									item.score_sort === child.score_sort ? item.p_extend?.weidu_color : '#c9c7ca',
							}"
						></div>
					</div>
					<div
						class="tag"
						:style="{
							backgroundColor: item.p_extend?.weidu_color,
						}"
					>
						{{ item.weidu_name }}
					</div>
				</div>
				<div class="content-item" v-html="item.extend?.content1"></div>
			</div>
		</div>
	</ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {
	color: #333;
	.chart {
		font-size: 14px;
	}
	.content {
		padding: 0 10px;

		.content-title {
			font-size: 18px;
			color: #4e48e6;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 16px 0;
			.text {
				padding: 0 8px;
			}
			.arrow {
				width: 60px;
				&.arrow-right {
					transform: rotate(-180deg);
				}
			}
		}
		.rank {
			display: flex;
			justify-content: space-between;
			position: relative;
			margin-bottom: 40px;
			.tag {
				height: 20px;
				padding: 0 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				position: absolute;
				left: 15px;
				bottom: -8px;

				border-radius: 4px;
				color: #fff;
				transform: translateY(100%);
			}
			.left,
			.right {
				display: flex;
				justify-content: space-between;
				background-color: #f6f4f7;
				padding: 3px;
				border-radius: 4px;

				.item {
					width: 6px;
					height: 32px;
					border-radius: 6px;
				}
			}
			.left {
				width: 108px;
				margin: 0 12px;
			}
			.right {
				width: 227px;
				margin: 0 12px;
			}
		}

		:deep(.content-item) {
			font-size: 14px;
			padding: 10px;
			h4 {
				font-size: 16px;
				font-weight: bold;
				border-left: 5px solid #ff9e57;
				line-height: 20px;
				padding-left: 6px;
				margin-bottom: 10px;
			}
			& > p {
				padding: 8px 0;
				line-height: 24px;
			}
			& > ul {
				li {
					list-style: none;
					padding: 8px 0;
					line-height: 24px;
					text-indent: 10px;
					position: relative;

					&::before {
						content: "";
						position: absolute;
						left: 0;
						top: 20px;
						transform: translateY(-50%);
						width: 5px;
						height: 5px;
						border-radius: 50%;
						background-color: #ff9e57;
					}
				}
			}
		}
		&:not(:last-child) {
			.content-item {
				border-bottom: 1px dashed #c9c7ca;
			}
		}
	}
}
</style>
