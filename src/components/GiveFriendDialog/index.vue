<template>
	<BaseDialog
		v-bind="$attrs"
		:showConfirmButton="false"
	>
		<div class="dialog-content">

			<img :src="vipOpen">
			<div class="title">赠送好友</div>
			<div class="text">
				<slot>

				</slot>
				<div class="bottom">
					<span>点这里：</span><span
						class="text-button"
						@click="$router.push('/giveManage')"
					>查看赠送记录</span>
				</div>
			</div>
			<div
				class="button"
				@click="confirm"
			>
				<slot name="button">
				</slot>
			</div>

			<div
				class="icon"
				@click="close"
			>
				<van-icon name="close" />
			</div>
		</div>
	</BaseDialog>
</template>

<script>
import vipOpen from "@/assets/images/vip-open.png";
import BaseDialog from '@/components/BaseDialog'
export default {
	components: { BaseDialog },
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

	img {
		width: 60px;
	}

	.button {
		height: 38px;
		background-color: @theme-color;
		color: #fff;
		margin-top: @padding-base;
		line-height: 38px;
		border-radius: 38px;
		font-size: 18px;
	}

	.title {
		font-weight: bold;
		color: @theme-color;
		font-size: 20px;
	}

	.subhead {
		font-size: @font-size-lg;
		color: @light-black;
		text-align: left;
		font-weight: bold;
		padding: @padding-base 0;
	}

	.text {
		color: @light-black;
		font-size: @font-size-base;
		text-align: left;
		padding-bottom: @padding-base;
		line-height: 25px;

		.bottom {
			padding-top: @padding-sm;
		}

		span {
			color: #000;
		}

		.text-button {
			color: #ff5d5e;
		}
	}

	.icon {
		font-weight: bold;
		font-size: 20px;
		position: absolute;
		top: 15px;
		right: 15px;
	}
}</style>