<template>
	<BaseDialog
		v-bind="$attrs"
		:showConfirmButton="false"
	>
		<div class="dialog-content">

			<img :src="vipOpen">
			<div class="title">
				<slot name="title">
				</slot>
			</div>
			<div class="text">
				<slot name="text">
				</slot>
			</div>
			<slot name="bottom">
				<div
					class="button"
					@click="confirm"
				>
					{{ buttonText }}
				</div>
			</slot>

			<div
				class="icon"
				@click="close"
				v-if="clearable"
			>
				<van-icon name="close" />
			</div>
		</div>
	</BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import vipOpen from "@/assets/images/vip-open.png";
export default {
	components: { BaseDialog },
	props: {

		buttonText: {
			type: String,
			default: "",
		},
		clearable: {
			type: Boolean,
			default: true,
		},
	},
	setup(_, cxt) {
		function close() {
			cxt.emit("update:show", false);
		}
		function confirm() {
			cxt.emit("confirm");
		}
		return {
			close,
			confirm,
			vipOpen,
		};
	},
};
</script>

<style lang="less" scoped>
.dialog-content {
	padding: 25px 20px;
	font-size: @font-size-base;
	position: relative;
	text-align: center;

	.button {
		height: 38px;
		background-color: @theme-color;
		color: #fff;
		margin-top: @padding-base;
		line-height: 38px;
		border-radius: 38px;
		font-size: 18px;
	}

	img {
		width: 80px;
		height: auto;
	}

	.title {
		font-weight: bold;
		color: @theme-color;
		font-size: 20px;
		
	}

	.text {
		color: @light-black;
		font-size: @font-size-lg;
		padding: 20px;
		text-align: left;
	}

	.icon {
		font-weight: bold;
		font-size: 20px;
		position: absolute;
		top: 15px;
		right: 15px;
	}
}</style>