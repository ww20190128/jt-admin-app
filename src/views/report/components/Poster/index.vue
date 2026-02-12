<template>
	<div class="poster">

		<div class="button-body">
			<span
				class="button"
				@click="handleShare"
			>
				<i class="fa fa-share-alt"></i>
				{{ text }}
			</span>
		</div>


		<Teleport to='body'>
			<van-overlay :show="show" :z-index="1001">
				<div class="wrapper">
					<div
						class="content"
						ref="posterRef"
					>
						<img
							:src="posterUrl"
							v-if="posterUrl"
						>
						<div v-else>
							<img :src="`${img}?${timestamp}`">
							<VueQr
								class="qr"
								:text="qrUrl"
								:margin="10"
							/>
							<slot>
							</slot>
						</div>

					</div>
					<div
						class="close"
						@click="show = false"
					>
						<van-icon name="clear" />
					</div>
				</div>
			</van-overlay>
		</Teleport>
	</div>
</template>

<script>
import { reactive, toRefs, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import VueQr from "vue-qr/src/packages/vue-qr";
import html2canvas from "html2canvas";
import { useStore } from "@/store";

import qs from "qs";
export default {
	name: "Poster",
	components: {
		VueQr,
	},
	props: {
		img: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	setup() {
		const store = useStore();
		const route = useRoute();
		const state = reactive({
			show: false,
			qrUrl: "",
			posterUrl: "",
			timestamp: new Date().getTime(),
		});

		const posterRef = ref(null);
		const { guid, puid } = route.query;
		const query = {
			guid,
			puid,
			source: "sharePosters",
		};
		const search = qs.stringify(query);
		watch(
			() => state.show,
			(val) => {
				const backtop = document.querySelector(".backtop");
				const app = document.querySelector("#app");
				backtop.style.display = val ? "none" : "flex";
				app.style.height = val ? "100vh" : "auto";
			}
		);
		onMounted(() => {
			// state.timer = window.setTimeout(() => {
			//   handleShare()
			// }, 3000);
		});
		onBeforeUnmount(() => {
			window.clearTimeout(state.timer);
		});

		async function handleShare() {
			window.clearTimeout(state.timer);
			const url = store.getters.wechatInfo?.web_url;
			state.qrUrl = `${url}goods?${search}`;
			state.show = true;

			
			window.setTimeout(async () => {
				// console.log('%c [  ]-115', 'font-size:13px; background:pink; color:#bf2c9f;',posterRef.value )
				if (!state.posterUrl) {
				
					const canvas = await html2canvas(posterRef.value, {
						useCORS: true,
						allowTaint: false,
					});
					state.posterUrl = canvas.toDataURL();
				}
			}, 0);
		}

		return {
			...toRefs(state),
			handleShare,
			posterRef,
		};
	},
};
</script>

<style lang="less" scoped>
// PC海报样式
@import "./media.less";

.button-body {
	display: flex;
	justify-content: center;
}

.button {
	display: inline-block;
	padding: 0 @padding-base;
	text-align: center;
	line-height: 40px;
	width: auto;
	height: 40px;
	border-radius: 40px;
	background-color: #01c453;
	color: #fff;
	font-size: @font-size-base;
	margin: 10px 0;
}

.wrapper {
	width: 300px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;

	.content {
		width: 100%;
		position: relative;

		.qr {
			position: absolute;
			bottom: 20px;
			right: 20px;
			width: 100px;
			height: 100px;
		}

		img {
			width: 100%;
			display: block;
			pointer-events: auto;
		}
	}

	.close {
		width: 40px;
		height: 40px;
		position: absolute;
		left: 50%;
		bottom: -50px;
		transform: translateX(-50%);

		.van-icon {
			font-size: 40px;
			color: #fff;
		}
	}
}
</style>