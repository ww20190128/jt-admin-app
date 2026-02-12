<template>
	<van-dialog
		v-bind="$attrs"
		:showConfirmButton="false"
		class="instruction-dialog"
	>
		<!-- 测评须知 -->
		<div class="dialog-content">
			<div class="title">{{ testPaperInfo?.noticeTitle }}</div>
			<div
				class="text-content"
				v-html="testPaperInfo?.notice"
			>
			</div>
			<QrCard :showTitle="false" />
			<div
				class="button"
				@click="close"
			>我知道了</div>
		</div>
	</van-dialog>
</template>
<!-- 题目右上角弹窗 -->
<script>
import QrCard from "@/components/QrCard";
export default {
	name: "AgainPayDialog",
	components: {
		QrCard,
	},
	props: {
		testPaperInfo: {
			type: Object,
		},
	},
	setup(_, cxt) {
		function close() {
			cxt.emit("update:show", false);
		}
		return {
			close,
		};
	},
};
</script>
<style lang="less">
.instruction-dialog {
	top: 50% !important;
	transform: translate(-50%, -50%);
}
</style>
<style lang="less" scoped>
.dialog-content {
	padding: 20px 30px;
	font-size: @font-size-base;
	position: relative;

	.button {
		height: 38px;
		line-height: 38px;
		border-radius: 38px;
		background-color: @theme-color;
		color: #fff;
		margin-top: @padding-base;
		text-align: center;
		font-size: @font-size-base;
		margin: 20px 0;
	}

	:deep(.text-content) {
		font-size: 13px;
		color: #505050;
		line-height: 24px;
		padding-bottom: @padding-sm;

		p {
			margin-top: @padding-sm;
		}
	}

	.title {
		font-size: 18px;
		text-align: center;
		padding: @padding-sm 0;
		font-weight: bold;
	}
}
</style>