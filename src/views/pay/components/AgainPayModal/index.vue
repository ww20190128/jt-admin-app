<template>
	<van-dialog v-bind="$attrs" :showConfirmButton="false">
		<div class="dialog-content">
			<div class="title">你的评报告已生成</div>

			<div>支付完成后查看详细报告！并且还免费赠送你3次重测机会哦！</div>

			<div class="button" @click="confirm">微信支付解锁报告</div>
			<div class="button red" @click="get" v-if="showGet">领取优惠红包</div>
			<div class="button plain" @click="cancel">我已完成支付，去看报告</div>
			<div class="button red" @click="exit" v-if="showExit">退出</div>
			<div class="icon">
				<slot name="close"></slot>
			</div>
		</div>
	</van-dialog>
</template>

<script>
export default {
	name: "AgainPayDialog",
	props: {
		showExit: {
			type: Boolean,
			default: false,
		},
		showGet: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			default: "#4CAF50",
		},
	},
	setup(props, ctx) {
		function confirm() {
			ctx.emit("update:show", false);
			ctx.emit("confirm");
		}
		function cancel() {
			ctx.emit("cancel");
		}
		function exit() {
			ctx.emit("exit");
		}
		function get() {
			ctx.emit("get");
		}
		return {
			close,
			confirm,
			cancel,
			exit,
			get,
		};
	},
};
</script>

<style lang="less" scoped>
.dialog-content {
	padding: 20px;
	font-size: @font-size-base;
	position: relative;

	.button {
		height: 40px;
		border-radius: 40px;
		background-color: v-bind("theme");
		color: #fff;
		margin-top: @padding-base;
		line-height: 40px;
		text-align: center;

		&.red {
			background-color: #f54337;
		}
	}

	.plain {
		background-color: #fff;
		color: v-bind("theme");
		border: 1px solid v-bind("theme");
	}

	.title {
		font-weight: bold;
		font-size: 18px;
		text-align: center;
		padding: 10px 0 20px 0;
	}

	.icon {
		font-weight: bold;
		font-size: 30px;
		position: absolute;
		top: 15px;
		right: 15px;
	}
}
</style>
