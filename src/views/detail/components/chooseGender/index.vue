<template>
	<div>
		<div class="tips1" @click="handleLookResult" v-if="state.lastTestOrderInfo?.status === 2" v-show="state.tipsShow">
			<div class="left">
				<van-icon name="close" style="	font-size: 24px;margin: 0 6px;" @click.stop="state.tipsShow = false" />
				你已经购买了该评测报告
			</div>
			<div class="right">查看报告</div>
		</div>
		<div class="popup-content" v-if="state.testPaperInfo?.versionConfig && state.testPaperInfo?.versionConfig.text">
			<div class="title">{{ state.testPaperInfo?.versionConfig.text }}</div>
			<div class="options">
				<van-row gutter="15">
					<van-col span="12" v-for="item in state.testPaperInfo?.versionConfig?.options" :key="item.id" @click="handleSelectItem(item)">
						<div class="item" :class="{ 'active': state.optionCurrent === item.id }">
							<img v-if="item?.img" :src="item?.img" />
							<p>{{ item?.name }}</p>
						</div>
					</van-col>
				</van-row>
			</div>
			<div class="button" @click="confirm">开始测试</div>
		</div>
		<ToCustomer v-if="state.testPaperInfo?.customerUrl" :link="state.testPaperInfo?.customerUrl" />
		<!-- 显示历史订单按钮 -->
		<HistoricalOrders v-if="state.historyOrderButtonShow" @confirm="historicalOrders" />
	</div>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue"
import ToCustomer from "../customer";
import HistoricalOrders from "../historicalOrders";


import { useRoute, useRouter } from "vue-router"
import { useAgent } from "@/hooks/useAgent"
import { Toast, Dialog } from "vant"
import { shareWx } from "@/hooks/shareWx"
import { useAuth } from "@/hooks/useAuth";
// api 接口
import { 
	getPromotionInfo
} from "@/api/promotion"
import {
	getTestPaperInfo,
	createTestOrder,
	resetTestOrder,
	getTestOrderInfo,
	showHistoryOrderButton
} from "@/api/testPaper";
const route = useRoute()
const router = useRouter()
const { md, ua, network, os, isWeChat } = useAgent()
const state = reactive({
	testPaperInfo: {}, // 商品信息
	optionCurrent: 1, // 双版本选择值
	optionVisible: false, // 双版本选择显示隐藏
	lastTestOrderInfo:{},
	testOrderId: "",
	tipsShow: false,
	historyOrderButtonShow: false, // 是否显示历史订单按钮
})
let { promotionId, testPaperId, couponId, shareCode } = route.query
onMounted(() => {})
useAuth(
	{
		authType: 2,
	},
	async () => {
		shareWx({ testPaperId:testPaperId, promotionId:promotionId });
		try {
			initOptions()

		} catch (error) {
		}
	}
);
// 查看报告
function handleLookResult() {
	router.push({
		path: "/report",
		query: {
			testOrderId: state.testOrderId,
			testPaperId: testPaperId,
			promotionId: promotionId,
		},
	});
}

async function initOptions() {
	if (promotionId) {
		const { promotionInfo, testPaperInfo } = await getPromotionInfo({ promotionId })
		state.promotionInfo = promotionInfo;
		try {
			// 获取缓存的订单ID
			const testOrderId = window.localStorage.getItem(`testPaperId_${promotionInfo?.testPaperId}`)
				? window.localStorage.getItem(`testPaperId_${promotionInfo?.testPaperId}`)
				: "";
			if (testOrderId) {
				state.testOrderId = testOrderId;
				await getTestOrderInfoById();
			}
		} catch (error) {
			window.__bl?.api(
				"根据缓存订单号获取订单失败",
				false,
				0,
				"error",
				`加载失败:${error}`
			);
		}
		state.testPaperInfo = testPaperInfo;
	} else {
		const { testPaperInfo } = await getTestPaperInfo({ testPaperId : testPaperId });
		state.testPaperInfo = testPaperInfo
	}
	// 是否显示历史订单按钮
	const { showButton } = await showHistoryOrderButton({ testPaperId : testPaperId, promotionId: promotionId })
	state.historyOrderButtonShow = showButton
}

// 获取最近一次订单详情
async function getTestOrderInfoById() {
	const {
		testOrderInfo
	} = await getTestOrderInfo({
		testOrderId: state.testOrderId,
	});
	state.tipsShow = true
	state.lastTestOrderInfo = testOrderInfo;
}

const style = {
	height: "100%",
	backgroundColor: "#F5F5F5",
};
function handleSelectItem(item) {
	state.optionCurrent = item.id

}
function confirm() {
	if (state.reset) { // 重测
		onResetTestOrder();
	} else {
		createNewTestOrder();
	}
}

// 重测
async function onResetTestOrder() {
	const params = {
		testOrderId: state.lastTestOrderInfo.testOrderId,
		version: state.optionCurrent,
		testPaperId: testPaperId || state.testPaperInfo.id
	}
	if (!testPaperId) {
		params.promotionId = promotionId
	}
	const {
		testOrderId,
	} = await resetTestOrder(params);
	state.testOrderId = testOrderId;
	goExam();
}
function historicalOrders() {
	// ww注释20240420
    //   router.push({
    //     path: "/order",
    //     query: {
    //       promotionId: promotionId,
    //       guid:state.goodsInfo.goods?.guid
    //     },
    //   });
}
function goExam() {
	router.push({
		path: "/exam",
		query: {
			testOrderId: state.testOrderId,
			testPaperId: testPaperId,
			promotionId: promotionId,
			couponId: couponId,
		},
	});
}

// 创建新订单
async function createNewTestOrder() {
	const { width, height } = window.screen;
	const deviceInfo = {
		phoneModel: "",
		browserVersion: ua,
		screenResolution: `${width}*${height}`,
		network,
		useEnv: isWeChat ? 1 : 2,
		...route.query,
		testPaperId,
	};
	if (promotionId) {
		deviceInfo.promotionId = promotionId
	}
	if (os == "iOS") { // ios系统
		deviceInfo.phoneModel = md.os() + md.version("iPhone");
	} else if (os == "AndroidOS") { // Android系统的处理
		deviceInfo.phoneModel = md.os() + md.version("Android");
	}
	try {
		// 创建测试
		const {
			testOrderId,
		} = await createTestOrder({
			testPaperId,
			...deviceInfo,
			version: state.optionCurrent,
			shareCode: shareCode,
		});
		state.testOrderId = testOrderId;
		// if (!isWeChat) {
		window.localStorage.setItem(
			"test_order_last",
			JSON.stringify({
			testPaperId,
			testOrderId,
		})
		);
		// }
		goExam();
	} catch (error) {
		Toast(error);
	}
}

</script>
<style lang="less" scoped>
.tips1 {
	height: 55px;
	font-size: 16px;
	display: flex;
	position: sticky;
	top: 0;
	left: 0;

	z-index: 999;

	.left {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #ffcf30;
		color: #383838;

		.close-icon {
			font-size: 24px;
			margin: 0 6px;
		}
	}

	.right {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #d43030;
		color: #ffeb3b;
		padding: 0 20px;
	}
}

.popup-content {
	padding-top: 80px;

	.title {
		font-size: 22px;
		text-align: center;
		font-weight: bold;
		color: @light-black;
	}

	.options {
		display: flex;
		justify-content: center;
		padding: 50px 0;

		.item {
			width: 150px;
			height: 180px;
			border-radius: 15px;
			background-color: #fff;
			padding: 25px;
			border: 3px solid #f5f5f5;
			.align-center();
			flex-direction: column;

			img {
				width: 100%;
			}

			p {
				font-size: @font-size-lg;
				padding-top: 18px;
			}
		}

		.active {
			border-color: @theme-color;
		}
	}

	.button {
		background-image: linear-gradient(to right, #ff6f8c, #fd466a);
		font-weight: bold;
		font-size: 18px;
		height: 40px;
		width: 180px;
		border-radius: 40px;
		color: #fff;
		margin: 0 auto;
		line-height: 40px;
		text-align: center;
		letter-spacing: 5px;
	}
}
</style>