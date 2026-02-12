<template>
	<div class="slide-card-list">
		<div class="items-container">
			<div class="item" v-for="item in data" :key="item.id" @click="handleItem(item)">
				<div class="img">
					<van-image :src="item.coverImg"></van-image>
				</div>
				<div class="info-warp">
					<div class="name"><span>{{ item.name }}</span></div>
					<p class="text">
						<!-- fa fa-user-plus -->
						<i class="icon"></i>{{ item.saleNum }}人已测
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<!-- 首页卡片 -->
<script>
import { useRouter } from "vue-router";
export default {
	name: "SlideCardList",
	props: {
		data: {
			type: Array,
			default: () => ({}),
		},
	},
	setup() {
		const router = useRouter();
		function handleItem({ id }) {
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
.slide-card-list {

	overflow-x: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	.items-container {
		margin: 0 5px;
		display: flex;
		margin-bottom: 10px;
		padding: 5px 0;

		.item {
			padding: 5px 8px;
			border-radius: 5px;
			// box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 -1px 2px rgba(0, 0, 0, 0.1);
			box-shadow: 0px 0px 4px #e8e8e8;
			.pointer();
			margin-right: 15px;
			cursor: pointer;

			&:last-child {
				margin-right: 0;
			}

			.img {
				height: 90px;
				width: 90px;

				.van-image {
					width: 100%;
					height: 100%;

					:deep(img) {
						border-radius: 5px;
					}
				}
			}

			.info-warp {
				margin-top: 5px;
				.name {
					height: 35px;
					text-indent: 0;
					text-align: left !important;
					font-weight: 500;
					line-height: 1.2;
					overflow: hidden;
					margin-bottom: 0px;
					span {
						font-size: 13px;
					}
				}

				.text {
					line-height: 1.2;

					text-indent: 0;
					text-align: left;
					overflow: hidden;
					color: @gray-color;
					font-size: 12px;

					.icon {
						color: @theme-color;
						padding-right: 2px;
					}
				}
			}
		}
	}
}
</style>