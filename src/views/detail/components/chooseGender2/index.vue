<template>
	<div v-if="state.visibleStlye">
		<div class="tips1" @click="handleLookResult" v-if="state.lastTestOrderInfo?.status === 2"
			v-show="state.tipsShow">
			<div class="left">
				<van-icon name="close" class="close-icon2" @click.stop="state.tipsShow = false" />
				你已经购买了该评测报告
			</div>
			<div class="right">查看报告</div>
		</div>

		<VersionPage @handleSelectItem2="handleSelectItem2" :optionCurrent="state.optionCurrent2" @confirm="confirm2"
			:versionConfig="state.testPaperInfo?.versionConfig"
			:lastTestOrderInfo="state.lastTestOrderInfo"
			v-if="state.testPaperInfo?.versionConfig?.type == 1" />
		<VersionPage2 @handleSelectItem2="handleSelectItem2" :optionCurrent="state.optionCurrent2" @confirm="confirm2"
		:versionConfig="state.testPaperInfo?.versionConfig"
			v-else-if="state.testPaperInfo?.versionConfig?.type == 2" />

		<div v-else
			class="answer">
			<div class="popup-content" v-if="state.testPaperInfo?.versionConfig">
				<div class="title">{{ state.testPaperInfo?.name }}</div>
				
				<div class="centerName" v-if="state.testPaperInfo?.versionConfig?.text" v-html="state.testPaperInfo?.versionConfig?.text"></div>
				<div class="options" v-if="state.testPaperInfo?.versionConfig?.options">
					<van-row :gutter="25">
						<van-col span="12" v-for="item in state.testPaperInfo?.versionConfig?.options" :key="item.id" @click="handleSelectItem(item)">
							<div class="item" :class="{ 'active': state.optionCurrent === item.id }">
								<img class="img" :src="item.img" />
								<p>{{ item.name }}</p>
								<img class="icon" v-if="state.optionCurrent === item.id"
									src="@/assets/images/xuanzhong.png" />
							</div>
						</van-col>
					</van-row>
				</div>

			</div>
		</div>
		<ToCustomer v-if="state.testPaperInfo?.customerUrl" :link="state.testPaperInfo?.customerUrl" />
		<!-- 是否有测试过，有测试过，显示"历史订单" -->
		<HistoricalOrders v-if="state.historyOrderButtonShow" @confirm="historicalOrders" />
	</div>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAgent } from "@/hooks/useAgent"
import { Toast, Dialog } from "vant"
import { shareWx } from "@/hooks/shareWx"
import { useAuth } from "@/hooks/useAuth";
import VersionPage2 from "./versionPage2";
import VersionPage from "./versionPage";
import ToCustomer from "../customer";
import HistoricalOrders from "../historicalOrders";
import { loadingToast } from "@/plugins/vant";
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
const show = ref(true)
const { md, ua, network, os, isWeChat } = useAgent()
const state = reactive({
	visibleStlye: false,
	testPaperInfo: {}, // 测评信息
	optionCurrent: 0, // 双版本选择的id
	optionCurrent2: 0, // 双版本选择的id
	lastTestOrderInfo:{},
	errorCount: 0, //错误次数
	testOrderId: "",
	tipsShow: false, // 是否显示最近订单记录
	historyOrderButtonShow: false, // 是否显示 历史订单按钮
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
		} catch (error) {}
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
		const { promotionInfo, testPaperInfo, testOrderInfo } = await getPromotionInfo({ promotionId })
		state.promotionInfo = promotionInfo;
		try { // 获取缓存的订单ID
			const testOrderId = window.localStorage.getItem(`testOrderId_${promotionInfo?.testPaperId}`)
				? window.localStorage.getItem(`testOrderId_${promotionInfo?.testPaperId}`)
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

		state.lastTestOrderInfo = testOrderInfo;
		testPaperInfo.versionConfig = promotionInfo.versionConfig;
		state.testPaperInfo = testPaperInfo;
		state.promotionInfo = promotionInfo;
		
		document.title = promotionInfo?.name;
	} else {
		const { testPaperInfo } = await getTestPaperInfo({ testPaperId : testPaperId });
		state.testPaperInfo = testPaperInfo
	}
	state.visibleStlye = true
	// 是否显示历史订单按钮
	const { showButton } = await showHistoryOrderButton({ testPaperId : testPaperId, promotionId: promotionId })
	state.historyOrderButtonShow = showButton
}

// 获取订单详情
async function getTestOrderInfoById() {
	if (!state.testOrderId) {
		return ;
	}
	const {
		testOrderInfo
	} = await getTestOrderInfo({ testOrderId: state.testOrderId });
	state.tipsShow = true
	state.lastTestOrderInfo = testOrderInfo;
}

const style = {
	height: "100%",
	backgroundColor: "#F5F5F5",
};
function handleSelectItem(item) {
	state.optionCurrent = item.id
	confirm()
}
function historicalOrders() {
	// ww 20240520 注释
	// router.push({
	// 	path: "/order",
	// 	query: {
	// 		promotionId,
	// 		testPaperId: state.testPaperInfo?.id
	// 	},
	// });
}
function handleSelectItem2(item) {
	state.optionCurrent2 = item.id
	state.optionCurrent = item.id
}

function confirm() {
	if (state.reset) {
		onResetTestOrder();
	} else {
		createNewTestOrder();
	}
}
function confirm2() {
	if (state.optionCurrent2 != 0) {
		if (state.reset) {
			onResetTestOrder();
		} else {
			createNewTestOrder();
		}
	} else {
		Toast('请选择版本');
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
	goExam2();
}

function goExam2() {
	router.push({
		path: "/exam2",
		query: {
			version: state.optionCurrent,
			testOrderId: state.testOrderId,
			testPaperId: testPaperId,
			promotionId: promotionId,
			couponId: couponId,
		},
	});
}
function goExam2NoTestOrderId() { // 没有订单Id
	router.push({
		path: "/exam2",
		query: {
			version: state.optionCurrent,
			testPaperId,
			promotionId,
			couponId
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
	};
	if (promotionId) {
		deviceInfo.promotionId = promotionId
	}
	if (os == "iOS") { // ios系统
		deviceInfo.phoneModel = md.os() + md.version("iPhone");
	} else if (os == "AndroidOS") { // Android系统的处理
		deviceInfo.phoneModel = md.os() + md.version("Android");
	}
	if (state.promotionInfo?.id && state.promotionInfo?.answerStyleType == 1) { // 推广商品没有订单ID
		const loading = loadingToast("加载中...");
		setTimeout(() => { // 延时3秒后跳转
			loading.clear();
			goExam2NoTestOrderId();
		}, 500);
	} else {
		try {
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
			// 延时3秒后跳转
			setTimeout(() => {
				goExam2();
			}, 200);
		} catch (error) {
			Toast(error);
		}
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
	width: 100%;
	z-index: 999;

	.left {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #ffcf30;
		color: #383838;
		.close-icon2 {
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

.answer {
	min-height: 100vh;
	background: #fff url('../../../../assets/images/bg_base.png') repeat;
	background-size: 1.6rem;
	color: #666;
	position: relative;
}

.popup-content {
	width: 90%;
	position: absolute;
	top: 100px;
	left: 5%;
	// margin-top: 80px;
	background: #fff;
	// margin: 100px 20px 0 20px;
	border-radius: 10px;
	border: 2px solid #f5f5f5;
	padding-bottom: 40px;

	.title {
		font-size: 22px;
		text-align: center;
		font-weight: bold;
		color: #333;
		padding-top: 40px;
		margin-bottom: 20px;
	}

	p {
		font-size: 12px;
		color: #666;
		text-align: center;
		margin-top: 5px;
	}

	.options {
		display: flex;
		justify-content: center;
		padding: 30px 0;

		.item {
			width: 110px;
			height: 110px;
			border-radius: 50%;
			background-color: #fff;
			// padding: 30px;
			border: 3px solid #f5f5f5;
			.align-center();
			flex-direction: column;
			position: relative;

			.img {
				width: 100%;
				height: 110px;
				border-radius: 50%;
			}

			.icon {
				width: 30px;
				height: 30px;
				position: absolute;
				right: 0;
				top: 75px
			}

			p {
				font-size: @font-size-lg;
				padding-top: 18px;
			}
		}

		.active {
			border-color: #f4ea2a;
		}
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

.centerName {
	font-size: 14px;
	text-align: center;
	color: #666;
	line-height: 24px;
}
</style>