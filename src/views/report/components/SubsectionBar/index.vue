<!--

 * @Date: 2022-12-02 21:28:36
-->
<template>
	<div class="subsection">
		<div class="value">
			<van-icon name="down" />
		</div>
		<div class="subsection-bar">
			<div
				class="item"
				v-for="(item, index) in list"
				:style="getStyle(item)"
				:key="index"
			>
				<span class="text">{{ item.text }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
	colors: {
		type: Array,
		default: () => [],
	},
	value: {
		type: Number,
		default: 0,
	},
});
const values = [
	{
		text: "0-25%",
		value: 25,
	},
	{
		text: "25-50%",
		value: 25,
	},
	{
		text: "50-75%",
		value: 25,
	},
	{
		text: "75-95%",
		value: 20,
	},
	{
		text: "95%+",
		value: 5,
	},
];
const list = computed(() => {
	values.forEach((item, i) => {
		props.colors.map((color, j) => {
			if (i === j) item.color = color;
		});
	});
	return values;
});
const left = computed(() => `${props.value}%`);
const getStyle = ({ value, color }) => {
	return {
		color,
		backgroundColor: color,
		width: `${value}%`,
	};
};
</script>

<style lang="less" scoped>
.subsection {
	padding: 0 0 30px 0;
	position: relative;
	margin-top: 46px;

	.value {
		position: absolute;
		width: 1px;
		top: 0;
		left: v-bind(left);
		z-index: 9;
		font-size: 14px;
		transform: translateY(-130%);
		display: flex;
		justify-content: center;

		&::before {
			position: absolute;
			content: "你";
			left: 0;
			top: 50%;
			transform: translate(-150%, -50%);
		}

	}

	.subsection-bar {
		width: 100%;
		display: flex;

		.item {
			height: 16px;
			flex-shrink: 0;
			position: relative;

			&:last-child {
				border-radius: 0 6px 6px 0;
			}

			&:first-child {
				border-radius: 6px 0 0 6px;
			}

			.text {
				position: absolute;
				left: 0;
				bottom: 0;

				font-size: 14px;
				transform: translateY(130%);
			}
		}
	}
}
</style>
