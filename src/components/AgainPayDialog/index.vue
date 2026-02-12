<template>
	<van-dialog
		v-model:show="visible"
		:showConfirmButton="false"
	>
		<div class="dialog-content">
			<div class="title">{{ title }}</div>
			<div>
				{{ content }}
			</div>
			<div
				class="button"
				@click="confirm"
			>{{ confirmText }}</div>
			<div
				class="button plain"
				@click="cancel"
			>{{ cancelText }}</div>
			<div
				class="icon"
				@click="close"
			>
				<van-icon name="close" />
			</div>
		</div>
	</van-dialog>
</template>

<script>
import { computed } from "@vue/reactivity";
export default {
	name: "AgainPayDialog",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "支付遇到问题了吗？",
		},
		content: {
			type: String,
			default:
				"如果已支付但没有跳转报告，可点击“已完成支付,去看报告”。如果支付失败，请点击重新支付。",
		},
		confirmText: {
			type: String,
			default: "重新支付",
		},
		cancelText: {
			type: String,
			default: "已完成支付，去看报告",
		},
		theme: {
			type: String,
			default: "#ff5d7d",
		},
	},
	setup(props, cxt) {
		function close() {
			cxt.emit("update:show", false);
		}
		function confirm() {
			cxt.emit("confirm");
		}
		function cancel() {
			cxt.emit("cancel");
		}
		const visible = computed({
			get: () => props.show,
			set: (value) => cxt.emit("update:show", value),
		});
		return {
			close,
			confirm,
			cancel,
			visible
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
		font-size: 20px;
		position: absolute;
		top: 15px;
		right: 15px;
	}
}</style>
