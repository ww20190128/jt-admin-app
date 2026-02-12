<template>
	<div class="large-title" v-if="label">
		<div class="dot-container">
			<div class="dot dot1"></div>
			<div class="dot dot2"></div>
			<div class="dot dot3"></div>
		</div>
		<div class="left"></div><span class="title">{{ label }}</span>
		<div class="right"></div>
	</div>
</template>

<script>
export default {
	name: "LargeTitle",
	props: {
		label: {
			type: String,
		},
		icon: {
			type: String,
			default: "",
		},
	},
};
</script>
<!-- border-color: #4687ff; -->
<style lang="less" scoped>
.large-title {
	margin-top: 30px;
	margin-bottom: 30px;
	width: 100%;
	text-align: center;
	position: relative;
	.left,
	.right {
		display: inline-block;
		width: 9px;
		height: 9px;
		background: #fff;
		margin-right: 10px;
		// border-radius: 1px;
		border: 3px solid #4687ff;
		opacity: 0.6;
		transform: translate(0, -50%) rotate(-45deg);
	}
	.left {
		margin-right: 10px;
	}
	.right {
		margin-left: 10px;
	}
	span {
		font-size: 25px !important;
	}
	.title {
		position: relative;
		text-align: center;
		font-weight: bold;
		&:before {
			height: 1px;
			top: -8px;
		}
		&:after {
			height: 1px;
			bottom: -8px;
		}
		&:after,
		&:before {
			opacity: 0.7;
			content: '';
			display: block;
			height: 1px;
			background-color: #4687ff;
			position: absolute;
			left: 0;
			right: 0;
			// box-shadow: 0px 4px 0px #ffd427;
		}
	}
	.dot-container {
		z-index: 999;
		background-color: #fff;
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		padding: 0 10px;
		.dot {
			width: 8px;
			height: 8px;
			background-color: #fff;
			opacity: 0.5;
			border-radius: 50%;
			margin: 0 3px;
		}

		.dot1 {
			width: 8px;
			height: 8px;
			border: 2px solid #4687ff;
			border-radius: 50%;
			margin: 0 3px;
		}

		.dot2 {
			width: 8px;
			height: 8px;
			border: 2px solid #ffd427;
			border-radius: 50%;
			margin: 0 3px;
		}

		.dot3 {
			width: 8px;
			height: 8px;
			border: 2px solid #4687ff;
			border-radius: 50%;
			margin: 0 3px;
		}
	}

}
</style>
<style lang="less">
.large-title-mbti {
	text-align: center;
	padding: @padding-base 0;
	font-size: 22px;
	font-weight: bold;
	color: #000;
}

.large-title-mbti i {
	margin-right: 5px;
}

.mbti-tishi {
	/* font-size: 14px; */
	line-height: 24px;
	padding: 10px 10px 1px 10px;
	background: #fff8ef;
	border-radius: 10px;
}

.mbti-shuoming {
	line-height: 24px;
	padding: 10px 10px 1px 10px;
	background: #f5eeef;
	border-radius: 0.26667rem;
	margin-top: 20px;
	margin-bottom: 20px;
}

.mbti-shuoming-1 {
	text-align: center;
}

.mbti-top {
	margin-bottom: 0.4rem;
	border-bottom: 0.4rem solid #ebebeb;
	width: 120%;
	margin-left: -10%;
}

.rich-text ul {
	margin-left: 20px;
}
</style>