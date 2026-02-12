<template>
	<div class="content">
		<div class="card">
			<div class="pc-title">测前须知</div>
			<div v-if="isMobile" class="pc-text-content" v-html="promotionInfo?.payDescMobile"></div>
			<div v-else class="pc-text-content" v-html="promotionInfo?.payDescPc"></div>

			<div class="pc-button" @click="handleConfirm">{{promotionInfo?.ui_testBtnText}}</div>
		</div>
		<div v-if="!isMobile"  class="pc-copyright" v-html="promotionInfo?.copyright">
		</div>
	</div>
</template>
<script setup>

import { useAgent } from "@/hooks/useAgent";
defineProps({
	promotionInfo: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits(["confirm"]);
function handleConfirm() {
	emit("confirm");
}
const { isMobile } = useAgent();

</script>

<style lang="less" scoped>
@media screen and(min-width:750px) {
	.pc-title{
		font-size: 22px !important;
	}
	.pc-text-content{
		font-size: 18px !important;
		line-height: 28px !important;
	}
}

.content {
	padding: 40px 30px;
	background-color: #f3f3f3;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.card {
		padding: 20px;
		box-shadow: 0 0 2px 0 rgba(#000, 0.15);
		border-radius: 6px;
		.pc-title{
			font-weight: bold;
			font-size: 18px;
			text-align: center;
			padding-bottom: 20px;
			color:#1b1b1b;
		}
		.pc-text-content{
			font-size: 14px;
			color: #555;
			line-height: 24px;
			:deep(p){
				margin-bottom: 10px !important;
			}
		}
		.pc-button{
			font-size: 14px;
			color: #fff;
			height: 40px;
			width: 200px;
			border-radius: 6px;
			background-color: #28728F;
			margin: 20px auto 10px;
			text-align: center;
			line-height: 40px;
			cursor: pointer;
		}
	}
	.pc-copyright{
		font-size: 16px;
		color: #c7c7c7;
		text-align: center;
		margin-top: 50px;
	}
}
</style>
