<script setup>
const STATUS = {
	DONE: "done",
	DOING: "doing",
	UNDONE: "undone",
};
const props = defineProps({
	value: {
		type: Number,
		default: 0,
	},
	currentStepNumber: {
		type: [Number, String],
		default: 0,
	},
	steps: {
		type: Array,
		default: () => [],
	},
});

function getStatus(index) {
	const { value } = props;
	if (value > index) return STATUS.DONE;
	if (value === index) return STATUS.DOING;
	if (value < index) return STATUS.UNDONE;
}
function getStepItemsTotal(item) {
	const { start, end } = item;
	const startIndex = start - 1;
	return end - startIndex;
}
// function getCurrentStepNumber(item, index) {
// 	if (index === props.value) {
// 		return parseInt(props.currentStepNumber);
// 	} else if (index < props.value) {
// 		return getStepItemsTotal(item);
// 	} else {
// 		return 0;
// 	}
// }
</script>
<template>
	<transition name="van-slide-down">
		<div class="steps" v-show="value > 0">
			<div
				class="step"
				v-for="(item, index) in steps"
				:key="index"
				:class="[getStatus(index)]"
			>
				<div class="dot-wrapper">
					<div class="dot">
						<img
							src="@/assets/images/success.png"
							class="icon"
							v-if="getStatus(index) === STATUS.DONE"
						/>
						<span class="index"> {{ index + 1 }}</span>
					</div>
					<div class="footer">
						<div class="name">{{ item?.name }}</div>
						<!-- <div class="value">
							{{ getCurrentStepNumber(item, index) }}/{{
								getStepItemsTotal(item)
							}}
						</div> -->
					</div>
				</div>
				<div class="line"></div>
			</div>
		</div>
	</transition>
</template>

<style lang="less" scoped>
.steps {
	display: flex;
	justify-content: space-between;
	padding: 8px 16px 20px 16px;
	background-color: #fff;
	height: 70px;
	overflow: hidden;

	.step {
		position: relative;
		flex: 1;
		display: flex;

		.dot-wrapper {
			flex-shrink: 0;
			width: 30px;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;

			.dot {
				width: 30px;
				height: 30px;
				color: #fff;
				background-color: #cccccc;
				font-size: 14px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;

				.icon {
					position: absolute;
					width: 18px;
					bottom: 2px;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.footer {
				position: absolute;
				left: 50%;
				width: 100px;
				text-align: center;
				transform: translate(-50%, 100%);
				bottom: 8px;
				font-size: 14px;
				color: #cccccc;
			}
		}

		.line {
			flex: 1;
			height: 1px;
			background-color: #ccc;
			margin-top: 15px;
			transform: translateY(-50%);
		}

		&.done {
			.dot {
				// background-color: #9f6ba7;
				background-color: #4caf50;
			}

			.line {
				// background-color: #9f6ba7;
				background-color: #4caf50;
			}

			.name,
			.value {
				// color: #9f6ba7;
				color: #4caf50;
			}
		}

		&.doing {
			.dot {
				background-color: #9f6ba7;
			}

			.name,
			.value {
				color: #9f6ba7;
			}

			.value {
				font-size: 18px;
			}
		}

		&:last-child {
			width: 30px;
			flex-shrink: 0;
			flex: none;

			.line {
				display: none;
			}
		}
	}
}
</style>
