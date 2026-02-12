<script setup>
import ContentWrapper from "../ContentWrapper";
import { onMounted, computed, ref } from "vue";
import { px2rem } from "@/utils/rem";
import vDragscroll from "../../directives/vDragscroll";
const scrollRef = ref();
const scrollHeight = ref(0);
const clientHeight = ref(0);
const scrollTop = ref(0);

const props = defineProps({
	data: {
		type: Object,
	},
});
const childWeiduList = computed(() => props.data?.childWeiduList);

const percentage = computed({
	get: () => {
		return (scrollTop.value / (scrollHeight.value - clientHeight.value)) * 100;
	},
	set: (value) => {
		scrollRef.value.scrollTop =
			((scrollHeight.value - clientHeight.value) * value) / 100;
	},
});
function scroll() {
	scrollTop.value = scrollRef.value.scrollTop;
}
onMounted(() => {
	// ww 关闭排名
	// scrollHeight.value = scrollRef.value.scrollHeight;
	// clientHeight.value = scrollRef.value.clientHeight;
	// scrollRef.value.addEventListener("scroll", scroll);
});
const currentPage = ref(1);
const pageSize = 5;

const pageData = computed(() => {
	const start = (currentPage.value - 1) * pageSize;
	const end = currentPage.value * pageSize;
	return childWeiduList.value.slice(start, end);
});
const parse = (value) => parseInt(value);
</script>

<template>
	<ContentWrapper title="您的才干解读" enTitle="Your talent distribution">
		<div class="wrapper">
			<!-- <div class="scroll-content">
				<div class="bar-contaner-scroll" ref="scrollRef" v-dragscroll>
					<div class="bar-container">
						<div
							class="bar"
							v-for="(item, index) in childWeiduList"
							:key="index"
						>
							<div
								class="bar-inner"
								:style="{ width: `${item.last_percent}%` }"
							>
								<span class="name">{{ item.weidu_name }}</span>
								<span class="value">{{ parse(item.last_percent) }}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="slider">
					<div class="text">滑动图表查看其它才干分值</div>
					<van-slider
						v-model="percentage"
						vertical
						:bar-height="px2rem('4px')"
						active-color="#FFC857"
					>
						<template #button>
							<div class="slider-trigger"></div>
						</template>
					</van-slider>
				</div>
			</div> -->
			<div class="list">
				<!-- <div class="title">才干解释</div> -->
				<div
					class="item"
					v-for="(item, index) in pageData"
					:key="index"
					:style="{
						borderColor: item.p_extend?.weidu_color,
					}"
				>
					<div class="left">
						<div class="item-title">
							{{ item.score_sort }}.{{ item.weidu_name }}
							<span>{{ item.p_weidu_name }}</span>
						</div>
						<div class="text" v-html="item.jianjie"></div>
					</div>
					<div
						class="right"
						:style="{
							backgroundImage: `url(${item.p_extend?.sort_icon})`,
						}"
					>
						<div class="text">得分</div>
						<div
							class="value"
							:style="{
								color: item.p_extend?.weidu_color,
							}"
						>
							{{ parse(item.last_percent) }}
						</div>
					</div>
				</div>
				<van-pagination
					v-model="currentPage"
					:total-items="childWeiduList.length"
					:items-per-page="pageSize"
					:show-page-size="10"
					class="pagination"
				>
					<template #prev-text>
						<van-icon name="arrow-left" />
					</template>
					<template #next-text>
						<van-icon name="arrow" />
					</template>
					<template #page="{ text }">{{ text }}</template>
				</van-pagination>
			</div>
		</div>
	</ContentWrapper>
</template>

<style lang="less" scoped>
.wrapper {

	.scroll-content {
		display: flex;
		padding: 10px 5px;
		border: 1px solid #cfc7ff;
		border-radius: 5px;
		// 滑动栏
		.slider {
			padding: 12px;
			display: flex;
			:deep(.van-slider__bar) {
				transition: none;
			}
			.text {
				color: #6e5757;
				font-size: 12px;
				width: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 10px;
			}
			.slider-trigger {
				width: 14px;
				height: 14px;
				border-radius: 50%;
				box-shadow: 0 0 6px 4px rgba(#ffc857, 0.7);
				background-color: #fff;
				border: 2px solid #ffc857;
			}
		}
		.bar-contaner-scroll {
			height: 250px;
			overflow-y: auto;
			flex: 1;
			//滚动条整体部分
			&::-webkit-scrollbar {
				display: none;
			}
			padding: 10px 0;
			.bar-container {
				margin-left: 40px;
				border-left: 1px solid #eee;
				.bar {
				
					width: 100%;
					height: 8px;
					border-radius: 0 30px 30px 0;
					background-color: #eeeeee;
					
					&:not(:last-child) {
						margin-bottom: 14px;
					}
					.bar-inner {
						height: 100%;
						background-color: #a08fff;
						border-radius: 0 10px 10px 0;
						position: relative;
						font-size: 14px;
						color: #565656;

						.name {
							position: absolute;
							left: 0;
							top: 50%;
							transform: translate(-100%, -50%);
							width: 40px;
							text-align: center;
						}
						.value {
							position: absolute;
							right: 0;
							top: 50%;
							transform: translate(100%, -50%);
							padding: 0 10px;
							text-align: center;
						}
					}
				}
			}
		}
	}
	.list {
		.title {
			color: #333;
			font-size: 18px;
			text-align: center;
			padding: 16px 0;
			font-weight: bold;
		}
		.item {
			background-color: #f3f3f3;
			border-radius: 5px 0px 5px 5px;
			padding: 5px 60px 5px 6px;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
			border-left: 6px solid;
			position: relative;
			.left {
				.item-title {
					color: #333;
					font-size: 18px;
					padding-bottom: 4px;
					span {
						font-size: 12px;
						color: #999999;
					}
				}
				.text {
					color: #555555;
					font-size: 12px;
				}
			}
			.right {
				position: absolute;
				right: 0px;
				top: 0px;
		// background-color: #a08fff;
				background-size: 100% 100%;
				width: 40px;// 50
				height: 60px; //76px
				flex-shrink: 0;
				text-align: center;
				.text {
					font-size: 14px;
					color: #fff;
					padding-top: 2px;
				}
				.value {
					font-size: 18px;
					padding-top: 3px;
				}
			}
		}
		:deep(.pagination) {
			display: flex;
			justify-content: center;
			padding: 10px 0;
			.van-pagination__item {
				width: 22px;
				height: 22px;

				padding: 0;
				flex: none;
				min-width: 22px;
				border-radius: 5px;
				overflow: hidden;
				color: #666666;

				button {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					border: 1px solid #999999;
					border-radius: 5px;

					&:active {
						background-color: #a08fff;
						color: #fff;
						border-color: #a08fff;
						border-radius: 5px;
					}
				}
				&.van-pagination__item--active {
					background-color: #a08fff;
					border-color: #a08fff;
					color: #fff;
				}
				&:not(:last-child) {
					margin-right: 16px;
				}
				&::after {
					border: none;
				}
			}
		}
	}
}
</style>
