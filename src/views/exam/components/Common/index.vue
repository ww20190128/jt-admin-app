<template>
	<div class="tips1" @click="handleLookResult" v-if="lastTestOrderInfo?.status === 2" v-show="tipsShow">
		<div class="left">
			<van-icon name="close" style="	font-size: 24px;margin: 0 6px;" @click.stop="tipsShow = false" />
			你已经购买了该评测报告
		</div>
		<div class="right">查看报告</div>
	</div>

	<template v-if="!loading">
		<!-- 盖洛普 -->
		<Gallup v-if="testPaperInfo.questionStypeType == 5" :testPaperInfo="testPaperInfo"
			:questionGroup="questionGroup" :questionList="questionList" :currentIndex="currentIndex"
			:animation="!animate" :answerList="answerList" :showNextButton="showNext" @option="handleOption"
			@last="handleLast" @next="handleNext" @result="handleLookReport" />
		<!-- <van-config-provider :theme-vars="themeVars"> -->
		<div v-else class="content-warp" ref="contentRef"
			:class="{ 'no-step': !questionGroup.length || questionGroupIndex <= 0 }">
			<!-- 顶部进度条计时器 -->

			<div class="header-content">
				<Steps v-if="questionGroup.length" :activeIndex="questionGroupIndex" :questionGroup="questionGroup" />

				<div class="header">
					<!-- <p>{{ percentage }}</p> -->
					<!-- 进度条 -->
					<div class="question-progress-wrapper" v-if="questionGroup.length">
						<van-progress class="progress-item" :percentage="getGroupPercentage" stroke-width="8"
							:show-pivot="true" :pivot-text="`${groupCurrentIndex + 1} / ${getCurrentGroupToal}`" />
					</div>
					<div class="question-progress-wrapper" v-else>
						<van-progress class="progress-item" :percentage="percentage" stroke-width="8" :show-pivot="true"
							:pivot-text="`${currentIndex + 1} / ${questionList.length}`" />
					</div>
					<div class="question-time-wraper">
						<van-icon name="clock-o" class="clock-icon" />
						<van-count-down :time="time" class="time" :auto-start="false" ref="countDown" />
						<!-- 是否有提示信息 -->
						<div v-if="testPaperInfo?.noticeTitle && testPaperInfo?.notice" class="notice-icon"
							@click="questionVisible = true">
							<i class="fa fa-question"></i>
						</div>
					</div>

				</div>
			</div>

			<!-- 题目区域 questionStypeType ->paper_info.type-->
			<div class="exam-list" :class="{
				'animate-next': animate, 'exam-index': testPaperInfo.questionStypeType == 4,
			}">

				<!-- 题干 -->
				<div class="matter">{{ currentIndex + 1 }}、{{ current.matter }}</div>
				<!-- 题干图片 -->
				<div v-if="current.matterImg" class="title-img"
					:style="{ width: testPaperInfo.questionStypeType == 3 ? '100%' : '80%' }">
					<!-- <img :src="current.matterImg" /> -->

					<van-image :src="current.matterImg" class="img"
						:radius="testPaperInfo.questionStypeType == 1 || testPaperInfo.questionStypeType == 3 || testPaperInfo.questionStypeType == 5 ? 15 : 0">
						<template #loading>
							<van-loading type="spinner" size="20" />
						</template>
					</van-image>
				</div>

				<div class="item-list" :class="{
					'wrap-list': isImgSubject,
					'spce-between': testPaperInfo.questionStypeType == 4 && isImgSubject,
				}">
					<div :class="{ active: isActive(index), 'item': testPaperInfo.questionStypeType == 2 || testPaperInfo.questionStypeType == 4, 'item2': testPaperInfo.questionStypeType == 1 || testPaperInfo.questionStypeType == 3 || testPaperInfo.questionStypeType == 5 }"
						v-for="(item, index) in current.selections" :key="index" @click="handleOption(index)">
						<span class="option" v-if="!isImgSubject">{{
							optionNames[index]
						}}</span>
						<span class="option2">{{ item.name }}</span>
						<img :src="item.img" v-if="isImgSubject" />
					</div>
				</div>
			</div>

			<footer class="footer">
				<div class="footer-item" v-if="currentIndex < 12 && testPaperInfo.questionStypeType == 4">
					<div class="tips" v-html="testPaperInfo.extend?.bottomHtml"></div>

				</div>
				<div class="actions">
					<div class="last-next" v-show="!isLast">
						<div v-if="currentIndex !== 0" class="button" @click="handleLast">
							上一题
						</div>
						<div v-if="showNext" class="button" @click="handleNext">下一题
						</div>
					</div>
					<div class="last-next" v-show="isLast">
						<div class="button" @click="handleLast">上一题
						</div>
						<div v-if="!disabled" class="button animation-button" @click="handleLookReport">
							查看报告
						</div>
					</div>
				</div>

			</footer>
		</div>
	</template>
	<!-- 用户需知 -->
	<InstructionsDialog v-model:show="questionVisible" :testPaperInfo="testPaperInfo" />
	<ToCustomer v-if="testPaperInfo?.customerUrl" :link="testPaperInfo?.customerUrl" />
	<HistoricalOrders v-if="historyOrderButtonShow" @confirm="historicalOrders" />
</template>

<script>
import {
	reactive,
	toRefs,
	computed,
	onBeforeUnmount,
	ref,
	nextTick,
	unref,
	watch,
	h,
} from "vue";

import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import InstructionsDialog from "./components/InstructionsDialog";
import { Notify, Toast } from "vant";
// api 接口
import {
	getTestPaperInfo,
	getTestOrderInfo,
	getAnswerRecord,
	submitAnswers,
	submitTest,
	showHistoryOrderButton
} from "@/api/testPaper";
import {
	getPromotionInfo,
} from "@/api/promotion";

import { checkTestOrderPay } from "@/api/order";
import { useEventListener } from "@/hooks/useEventListener";
import { Dialog } from "vant";
import { loadingToast } from "@/plugins/vant";

import { optionNames } from "../letter";
import { shareWx } from "@/hooks/shareWx";
import Steps from "./components/Steps2/index.vue";
import followCover from "@/assets/images/follow-cover.png";
import Gallup from "../../template/gallup";
import { useCreate } from "../useCreate";
import { useAuth } from "@/hooks/useAuth";
import ToCustomer from "../customer";
import HistoricalOrders from "../historicalOrders";
import { keys } from "lodash";

export default {
	name: "exam",
	components: {
		InstructionsDialog,
		Steps,
		Gallup,
		ToCustomer,
		HistoricalOrders
	},

	setup() {
		const router = useRouter();
		const route = useRoute();
		const contentRef = ref(null);
		const { testOrderId, testPaperId, promotionId, couponId } = route.query;
		window.localStorage.setItem("testOrderId", testOrderId);
		// 计时器ref
		const countDown = ref(null);
		const state = reactive({
			questionGroup: [],
			questionList: [], // 题目列表
			testPaperInfo: {}, // 测评信息
			testOrderId: '',
			lastTestOrderInfo: {},
			optionNames,
			questionVisible: false, // 评测须知显示隐藏
			currentIndex: 0, // 当前题目索引
			answerList: [], // 已回答的题目
			animate: true, // 动画显示
			promotionInfo: {}, // 推广商品信息
			notify: null,
			isReplace: false,
			tipList: {},
			showNext: false,
			loading: true,
			tipsShow: false,
			historyOrderButtonShow: false, // 是否显示 历史订单按钮
		});

		const isStop = ref(true);

		onBeforeRouteLeave((to, from, next) => {
			if (!isStop.value) {
				next();
			} else {
				if (state.lastTestOrderInfo?.status != 1) {
					setTimeout(() => {
						Dialog.confirm({
							title: "答题尚未结束",
							message: h('div', { class: 'dialog-tips' }, [
								h('img', { class: 'icon', src: followCover }),
								h('p', { class: 'text' }, '只需几分钟即可获取您的专属报告，是否确认退出?')
							]),
							theme: "round-button",
							showCancelButton: true,
							confirmButtonText: "继续答题",
							cancelButtonText: "退出",
							cancelButtonColor: "lightgray",
							className: "dialog-tips-content",
						})
							.then(() => { })
							.catch(() => {
								isStop.value = false;
								router.back();
							});
					}, 100);
					next(false);
				} else {
					next();
				}
			}
		});
		function historicalOrders() {
			isStop.value = false;
			// ww注释20240420
			// router.push({
			// 	path: "/order",
			// 	query: {
			// 		promotionId: promotionId,
			// 		testPaperId: state.testPaperInfo?.id
			// 	},
			// });
		}

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

		// 当前题目
		const current = computed(() => state.questionList[state.currentIndex] || {});
		// 当前题目答案
		const currentOptionAnswer = computed(() =>
			state.answerList.find((v) => v.id === current.value.id)
		);
		// 最后一题是否回答完毕
		const disabled = computed(
			() => state.answerList.length < state.questionList.length
		);
		// 是否已经是最后一题
		const isLast = computed(
			() => state.currentIndex === state.questionList.length - 1
		);

		// 进度条当前进度
		const percentage = computed(() => {
			if (!state.questionList.length) return 0;
			if (state.currentIndex == 0) {
				return 0;
			}

			const value = ((state.currentIndex + 1) / state.questionList.length) * 100;
			if (value >= 100) {
				return 100;
			}
			return value;
		});

		// 根据订单号 获取已经答过的答案
		async function getAnswer() {
			if (!testOrderId) {
				return;
			}
			const { answerList } = await getAnswerRecord({ testOrderId });

			if (answerList.length > 0) { // 有作答记录
				state.currentIndex = answerList.length - 1;
				state.answerList = answerList;
				if (route.path !== "/exam") {
					return;
				}
				state.notify = Notify({
					message: `已经加载${state.answerList.length}道答题记录，点此重新做题`,
					background: "#2196F3",
					duration: 0,
					onClick: () => {
						state.answerList = [];
						state.currentIndex = 0;
						state.notify?.close();
					},
				});
			} else { // 无作答记录

				// 需要选择年龄
				if (state.testPaperInfo?.ageSet && Object.keys(state.testPaperInfo?.ageSet).length) {
					if (state.testPaperInfo?.ageSet?.location !== 'end') {
						goChooseYear();
					}
					
				}
			}
		}

		// 题目点击
		async function handleOption(index) {
			if (!state.animate) {
				return;
			}
			state.notify?.close();
			if (currentOptionAnswer.value) { // 判断已回答列表中是否有该题目 没有则将答案及试卷id push进去
				const val = state.answerList.find((v) => v.id === current.value.id); // 有该条答案 则修改该答案
				val.answer = index;
			} else {
				state.answerList.push({
					id: current.value.id,
					answer: index,
				});
			}
			if (isLast.value) { // 判断最后一题是否回答完毕
				Notify({
					message: "答题完毕，请点击下方“查看报告”按钮",
					background: "#07c160",
				});
			} else {
				handleNext();
			}
			if ((state.currentIndex + 1) % 5 === 0 || isLast.value) {
				if (testOrderId) {
					await submitAnswers({
						testOrderId,
						answerList: state.answerList,
					});
				}
			}
		}
		// 题目是否已选择
		function isActive(index) {
			return currentOptionAnswer.value?.answer === index;
		}
		watch(
			() => state.currentIndex,
			() => {
				nextTick(() => {
					window.scrollTo(0, 0);
				});
			}
		);

		// 下一题按钮
		function handleNext() {
			if (!state.animate) return;
			if (!currentOptionAnswer.value) {
				return Toast("请选择您的答案");
			}

			state.animate = false;
			window.setTimeout(() => {
				state.currentIndex += 1;
				state.animate = true;
				state.tipList[state.currentIndex] &&
					Dialog.alert({
						message: state.tipList[state.currentIndex],
						theme: "round-button",
					}).then(() => { });
				if (!currentOptionAnswer.value) {
					state.showNext = false;
				}
			}, 300);
			state.notify?.close();
		}
		// 上一题按钮
		function handleLast() {
			if (state.currentIndex === 0) {
				return Toast("没有上一题了");
			}
			state.showNext = true;
			state.currentIndex += -1;
			state.notify?.close();
		}

		// 查看报告按钮
		async function handleLookReport() {
			if (disabled.value) return Toast("请选择最后一题的答案");
			window.loading = loadingToast();
			if (state.testPaperInfo?.ageSet && Object.keys(state.testPaperInfo?.ageSet).length > 1) {
				goChooseYear();
			} else {
				handleReport();
			}
		}
		// 获取测评数据
		async function loadTestPaperInfo() {
			if (promotionId) {
				const { promotionInfo, testPaperInfo, testOrderInfo } = await getPromotionInfo({ promotionId });
				state.promotionInfo = promotionInfo;

				try {
					const testOrderId = window.localStorage.getItem(`testPaperId_${testPaperInfo?.id}`)
						? window.localStorage.getItem(`testPaperId_${testPaperInfo?.id}`)
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
			} else {
				const { testPaperInfo } = await getTestPaperInfo({ promotionId, testPaperId });
				state.testPaperInfo = testPaperInfo;
			}
			// 是否显示历史订单按钮
			const { showButton } = await showHistoryOrderButton({ testPaperId: state.testPaperInfo?.id, promotionId: state.promotionInfo?.id })
			state.historyOrderButtonShow = showButton
		}
		// 获取订单详情
		async function getTestOrderInfoById() {
			const {
				testOrderInfo
			} = await getTestOrderInfo({ testOrderId: state.testOrderId });
			state.tipsShow = true
			state.lastTestOrderInfo = testOrderInfo;
		}

		// 查看报告
		const [create] = useCreate();
		async function handleReport() {
			isStop.value = false;
			try {
				setTimeout(() => {
					window.loading?.clear?.();
				}, 5000);
				if (!testOrderId) { // 直接答题的情况
					const { testOrderId } = await create({
						answerList: state.answerList,
					});
					state.testOrderId = testOrderId;
					router.replace({
						path: "/pay",
						query: {
							testOrderId: state.testOrderId,
							testPaperId,
							promotionId,
							couponId,
						},
					});

					window.localStorage.setItem(
						"test_order_last",
						JSON.stringify({
							testPaperId,
							testOrderId: state.testOrderId,
						})
					);
				} else { // 从测评详情页进入的情况
					await submitTest({
						testOrderId,
						answerList: state.answerList,
					});
					// 检查是否需要付费
					const { testComplete, needPay } = await checkTestOrderPay({ testOrderId });
					const path = needPay === 1 ? "/pay" : "/report";
					router.replace({
						path,
						query: {
							testOrderId,
							testPaperId,
							promotionId,
							couponId,
						},
					});
					// 保存最近一次测试记录
					window.localStorage.setItem(
						"test_order_last",
						JSON.stringify({
							testPaperId,
							testOrderId: testOrderId,
						})
					);
				}
			} catch (error) {
				Toast(error.message || "网络错误，请重试~");
			}
		}
		async function holdback() { }
		const { on, off } = useEventListener();

		onBeforeUnmount(() => {
			state.notify?.close();
			off(window, "popstate", holdback);
		});

		// 检查订单状态
		function checkStatus() {
			const { testOrderId, testPaperId, promotionId, type } = route.query;
			if (!testOrderId) {
				return;
			}
			return new Promise(async (resolve, reject) => {
				if (type === "reset") { // 重测订单 则不检测 并清除重测参数
					resolve();
					return;
				}
				try {
					const { testComplete, needPay } = await checkTestOrderPay({ testOrderId });
					if (testComplete == 1 && needPay === 0) { // 测试完成并且不需要支付
						router.replace({
							path: "/report",
							query: {
								testPaperId,
								promotionId,
								testOrderId,
							},
						});
					} else {
						resolve();
					}
				} catch (error) {
					reject();
				}
			});
		}

		useAuth(
			{
				authType: 2,
			},
			async () => {
				shareWx({ testPaperId, promotionId });
				try {
					checkStatus();
					await loadTestPaperInfo(); // 获取页面信息
					await init();
					getAnswer();
				} catch (error) {
					isStop.value = false;
					if (testPaperId || promotionId) {
						router.replace({
							path: "/detail",
							query: {
								testPaperId,
								promotionId,
							},
						});
					} else {
						router.replace("/");
					}
				}
			}
		);

		const goChooseYear = async () => {
			if (testOrderId) {
				await submitTest({
					testOrderId,
					answerList: state.answerList,
				});
			} else {
				const { testOrderId } = await create({
					answerList: state.answerList,
				});
				state.testOrderId = testOrderId;
			}
			window.localStorage.setItem(
				"order_info",
				JSON.stringify({
					testPaperId,
					testOrderId: state.testOrderId,
				})
			);
			localStorage.setItem("answerList", JSON.stringify(state.answerList));

			isStop.value = false;
			router.push({
				path: "/chooseYear",
				query: {
					...route.query,
					testOrderId: testOrderId || state.testOrderId,
				},
			});
		};
		const isImgSubject = computed(() => {
			const isImg = unref(current).selections?.find((item) => item.img);
			return !!isImg;
		});

		const questionGroupIndex = ref(-1);
		function setQuestionGroupIndex(currentIndex) {
			const index = state.questionGroup.findIndex((item) => {
				return currentIndex < item.end;
			});
			if (index >= 0) questionGroupIndex.value = index;
		}
		watch(
			() => state.currentIndex,
			(currentIndex) => {
				if (state.questionGroup.length) {
					setQuestionGroupIndex(currentIndex);
					setGroupCurrentIndex(currentIndex);
				}
			}
		);
		const time = ref(0);
		const getCurrentGroupToal = computed(() => {
			const currentGroup = state.questionGroup[questionGroupIndex.value];
			if (!currentGroup) return 0;
			const startIndex = currentGroup.start - 1;
			return state.questionList.slice(startIndex, currentGroup.end).length;
		});

		const groupCurrentIndex = ref(0);

		function setGroupCurrentIndex(currentIndex) {
			if (questionGroupIndex.value === 0) { // 如果当前组索引为0，则将组当前索引设置为当前索引
				groupCurrentIndex.value = state.currentIndex;
			} else {
				const currentGroup = state.questionGroup[questionGroupIndex.value]; // 获取当前组
				const startIndex = currentGroup.start - 1; // 计算当前组开始索引
				const index = currentIndex - startIndex; // 计算当前索引与开始索引的差值
				if (index <= 0) { // 如果差值小于等于0，则将组当前索引设置为0
					groupCurrentIndex.value = 0;
				} else { // 否则将组当前索引设置为差值
					groupCurrentIndex.value = index;
				}
			}
		}

		const getGroupPercentage = computed(() => {
			if (!state.questionList.length) return 0;
			const value =
				((groupCurrentIndex.value + 1) / getCurrentGroupToal.value) * 100;
			if (value >= 100) {
				return 100;
			}
			return value;
		});

		async function init() { // 初始化试卷
			state.loading = true;
			const data = {};
			if (!testOrderId) { // 推广没有订单号
				const response = await getPromotionInfo2({ promotionId, version: 1 });
				Object.assign(data, response);
			} else { // 通过订单号查询
				const response = await getTestOrderInfo({ testOrderId });
				Object.assign(data, response);
			}
			const {
				testOrderInfo,
				questionList, //  题目
				testPaperInfo, // 测评信息
				questionGroup,
				tipList,
			} = data;


			state.questionList = questionList;
			state.testPaperInfo = testPaperInfo;
			state.lastTestOrderInfo = testOrderInfo;

			if (tipList && tipList.length) {
				state.tipList = Object.fromEntries(
					tipList.map((e) => [e.paper_detail_no, e.tips])
				);
			}

			document
				.querySelector('meta[name="description"]')
				?.setAttribute("content", testPaperInfo?.subhead);
			document.title = testPaperInfo.name;
			state.questionGroup = questionGroup;
			if (state.testPaperInfo.answerTimeLimit > 0) {
				time.value = state.testPaperInfo.answerTimeLimit * 60 * 1000; // 倒计时
				nextTick(() => countDown.value?.start());
			}
			if (questionGroup.length) {
				questionGroupIndex.value = 0;
			}
			state.loading = false;
			if (route.query.dev) {
				state.answerList.push(
					...state.questionList
						.map((item) => ({
							id: item.id,
							answer: 1,
						}))
						.slice(0, state.answerList.length - 1)
				);
				state.currentIndex = state.answerList.length - 1;
			}
		}
		return {
			handleNext,
			handleLast,
			handleOption,
			isActive,
			handleLookReport,
			handleLookResult,
	 		isLast,
			disabled,
			percentage,
			current,
			countDown,
			...toRefs(state),
			isImgSubject,
			contentRef,
			questionGroupIndex,
			time,
			getCurrentGroupToal,
			groupCurrentIndex,
			getGroupPercentage,
			historicalOrders
		};
	},
};
</script>
<style lang="less">
.dialog-tips {
	.icon {
		width: 50%;
	}
	.text {
		padding: 0 30px;
		text-align: center;
		line-height: 30px;	
	}
}

.dialog-tips-content {
	.van-dialog__confirm {
		flex: 2 !important;
	}
}
</style>
<style lang="less" scoped>
.tips1 {
	width: 100%;
	height: 55px;
	font-size: 16px;
	display: flex;
	position: absolute;
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

::v-global(.van-action-bar-button--danger) {
	background: #ff5d7d !important;

}

.animate-next {
	animation-duration: 0.3s;
	animation-fill-mode: both;
	animation-name: next;
}

@keyframes next {
	0% {
		transform: translateX(375px);
		opacity: 0.7;
	}

	80% {
		transform: translateX(0);
		opacity: 0.7;
	}

	to {
		opacity: 1;
	}
}

@keyframes scale {
	0% {
		transform: scale(1);
	}

	25% {
		transform: scale(1.1);
	}

	50% {
		transform: scale(1);
	}

	75% {
		transform: scale(1.1);
	}
}

.content-warp {
	position: relative;
	// background-color:  linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
	// background: url(../../../../assets/images/bg_base.png);
	width: 100%;

	padding-bottom: 60px;
	overflow-x: hidden;
	padding-top: 108px;
	transition: all 0.28s;

	// min-height: 100vh;

	&.no-step {
		padding-top: 48px !important;
	}

	&.no-step2 {
		padding-top: 18px !important;
	}

	.header-content {
		// position: fixed;

		// position: sticky;
		//
		// left: 0;
		position: fixed;
		width: 100%;

		top: 0;
		z-index: 997;
		// box-shadow: 0 1px 6px rgba(#000, 0.1);

		.full-fixed();


		.header {
			width: 100%;
			background-color: #fff;
			.space-between();
			.align-center();
			color: @gray-color;


		}
	}

	.exam-index {
		position: relative;
		z-index: 20;
		background-color: #f9f9f9;
	}

	.exam-list {
		padding: 10px @padding-base 5px @padding-base;
		z-index: 1;
		// 题干
		.matter {
			margin: 10px 0;
			width: 100%;
			min-height: 90px;
			font-weight: bold;
			font-size: 18px;
			line-height: 28px;
			background-color: @bg-color;
			padding: 10px 10px;
			border-radius: 10px;
		}

		.item-list {
			margin-top: 10px;

			.item {
				position: relative;
				-moz-user-select: none;
				-webkit-user-select: none;
				-ms-user-select: none;
				-khtml-user-select: none;
				-o-user-select: none;
				user-select: none;
				background-color: #fff;
				border-radius: 5px;
				padding: 12px @padding-base;
				line-height: 25px;
				font-size: @font-size-base;
				display: flex;
				margin-bottom: 2%;
				cursor: pointer;

				position: relative;

				.option {
					.align-center();
					padding-right: @padding-sm;
				}

				&.active {
					background-color: @theme-color;
					color: #fff;

				}



			}

			.item2 {
				border-radius: 10px;
				-moz-user-select: none;
				/* Firefox */
				-webkit-user-select: none;
				/* WebKit内核 */
				-ms-user-select: none;
				/* IE10及以后 */
				-khtml-user-select: none;
				/* 早期浏览器 */
				-o-user-select: none;
				/* Opera */
				user-select: none;
				background-color: #fff;
				// border-radius: 5px;
				padding: 12px 20px 12px @padding-base;
				line-height: 25px;
				font-size: @font-size-base;
				display: flex;
				margin-bottom: 12px !important;
				cursor: pointer;
				border: 1px solid #131415;
				// box-shadow: 3px 3px 0 #fff2c3, 3px 3px 0 0.5px #131415;
				box-shadow: 3px 3px 0 #b8b8e4, 3px 3px 0 0.5px #131415;

				.option {
					.align-center();
					padding-right: @padding-sm;
					font-weight: bold;
				}

				.option2 {
					font-size: 16px;

				}

				&.active {
					// background-color: @theme-color;
					background-color: #849ce0;
					color: #fff;
					box-shadow: 4px 4px 0 #7198fb, 4px 4px 0 0.5px #131415;

					&::after {
						background-color: #f09819;
						border: 1px solid #fff;
					}
				}

				position: relative;

				&::after {
					margin-left: 20px;
					position: absolute;
					right: 10px;
					top: 50%;
					content: "";
					display: inline-block;
					width: 10px;
					height: 10px;
					border: 1px solid #9daddb;
					/* 默认空心圆点的颜色 */
					border-radius: 50%;
					margin-left: 10px;
					transform: translateY(-50%);
				}
			}

			&.wrap-list {
				display: flex;
				flex-wrap: wrap;

				.item {
					width: 49%;
					padding: 5px @padding-base;
					margin-right: 2%;

					img {
						height: 50px;
						margin: 0 auto;
					}

					&:nth-child(2n) {
						margin-right: 0;
					}
				}
			}

			&.spce-between {
				justify-content: space-between;
				margin-top: 5px;

				.item {
					width: 31%;
					padding: 8px 10px;
					margin: 0 0 2% 0;

					img {
						height: 56px;
					}
				}
			}
		}
	}

	.footer {
		// padding: 5px 0 10px 0;
		z-index: 3;
		margin-bottom: 10px;
		.fixed-bottom();
		background: transparent;
		height: auto;

		.footer-item {
			position: relative;
			
			margin-top: 30px;
		}

		.tips {
			text-align: center;
			line-height: 20px;
			color: #7e7e7e;
			font-size: 12px;

			padding: 0 15px;

			.tips-title {
				font-weight: bold;
				font-size: 14px;
			}

			.tips-text {
				span {
					padding: 0 12px;
				}
			}
		}

		:deep(.tips) {
			text-align: center;
			line-height: 20px;
			color: #7e7e7e;
			font-size: 12px;


			.tips-title {
				font-weight: bold;
				font-size: 14px;
			}

			.tips-text {
				span {
					padding: 0 12px;
				}
			}

			ul {
				display: flex;
				flex-wrap: wrap;
				// padding-left: 30px;
				line-height: 24px;
				text-align: center;

				li {
					list-style: disc;
					width: 50%;
					list-style: none;
				}
			}
		}


		.actions {
			height: 60px;
			justify-content: center;
			.align-center();
			z-index: 1;
			.last-next {
				
				width: 100%;
				padding: 0 15px;
				.space-between();
				.align-center();
			}

			.footer-button() {
				height: 38px;
				line-height: 38px;
				text-align: center;
				border-radius: 5px;
				// color: #fff;
				font-size: @font-size-base;
			}

			.button {
				-moz-user-select: none;
				/* Firefox */
				-webkit-user-select: none;
				/* WebKit内核 */
				-ms-user-select: none;
				/* IE10及以后 */
				-khtml-user-select: none;
				/* 早期浏览器 */
				-o-user-select: none;
				/* Opera */
				user-select: none;
				/* CSS3属性 */
				width: 150px;
				background-color: @theme-color;

				cursor: pointer;
				color: #fff;
				.footer-button();

				&.animation-button {
					animation: scale 3s infinite;
					background-image: linear-gradient(-60deg, #f09819 0%, #f09819 100%);
					color: #fff;
				}
			}

			// .to-view {
			// 	width: 95%;
			// 	height: 38px;
			// 	margin-bottom: 20px;
			// 	.footer-button();
			// 	background-color: @theme-color;
			// }

			.disabled {
				background-color: #cccccc;
			}
		}
	}

	.footerBottom {
		bottom: auto !important;
	}
}

.title-img {
	width: 80%;
	margin: 0 auto;
	padding-top: @padding-sm;

	.img {
		width: 100%;
	}
}

:root {
	--van-action-bar-button-danger-color: #ff5d7d;
}
</style>
