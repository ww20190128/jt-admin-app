<template>
	<div class="cell-card-list">
		<div class="item" v-for="item in data" :key="item.id" @click="handleItem(item)">
			<div class="left">
				<van-image fit="cover" :src="item?.coverImg">
				</van-image>
			</div>
			<div class="right">
				<p class="title">{{ item?.subhead }}</p>
				<p class="subhead">{{ item?.name }}</p>

				<div class="bottom-info">
					<!--  fa fa-user-plus -->
					<p class="num">{{ item?.saleNum }}人已测试</p>
					<p class="good fa fa-thumbs-o-up" v-if="item?.favorableRate && item?.favorableRate >= 60">{{ item?.favorableRate }}%好评</p>
				</div>
			</div>
			<div class="go-button">立即测试</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
	name: "CellCardList",
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		clickItem: {
			type: Function
		}
	},
	setup(props) {
		const router = useRouter();
		function handleItem({ id }) {
			if (props.clickItem) {
				return props.clickItem({ id })
			}
			router.push({
				path: "/detail",
				query: {
					testPaperId: id,
				},
			});
		}
		return {
			handleItem,
		};
	},
};
</script>

<style lang="less" scoped>
.cell-card-list {
	.item {
		padding: 10px;
		border-radius: 10px;
		box-shadow: 0px 0px 4px #e8e8e8;
		margin-bottom: @padding-base;
		.pointer();
		.space-between();

		height: 90px !important;
		position: relative;

		.left {
			width: 70px !important;
			height: 70px !important;
			.van-image {
				width: 100%;
				height: 100%;

				:deep(img) {
					border-radius: @radius-base;
				}
			}
		}

		.right {
			padding-left: 10px;
			font-size: @font-size-lg;
			//  width: 260px;
			flex: 1;
			height: 70px;

			// .column-space-between();
			.title {
				font-weight: bold;
			}

			.subhead {
				height: 20px;
				line-height: 20px;
				color: @gray-color;
				font-size: 14px;
				overflow: hidden;
			}

			position: relative;

			.bottom-info {

				position: absolute;
				height: 20px;
				line-height: 20px;
				bottom: 0;
				left: 10px;
				.space-between();

				.num {
					font-size: @font-size-sm;
					color: @gray-color;
					height: 20px;
					line-height: 20px;
					&::before {
						color: @theme-color;
						padding-right: 5px;
					}
				}

				.good {
					height: 20px;
					line-height: 20px;
					padding-left: 20px;
					font-size: @font-size-sm;

					&::before {
						color: #FF5D7D;
						padding-right: 3px;
					}

					color: @gray-color;
				}
			}
		}

		.go-button {
			position: absolute;
			right: 5px;
			bottom: 10px;
			width: 70px;
			height: 22px;
			line-height: 22px;
			border-radius: 15px;
			text-align: center;
			background-color: @theme-color;
			color: #fff;
			font-size: @font-size-sm;
		}
	}
}
</style>