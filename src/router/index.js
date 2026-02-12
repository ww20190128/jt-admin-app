import { RouterView, createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './routerGuards'
import qs from "qs";
import { useAgent } from '@/hooks/useAgent'
import { getToken } from "@/utils/auth";
import { store } from '@/store'
const { isWeChat } = useAgent()


function authBeforeEnter(to, from, next, path) {
	const { code } = to.query;
	// 逻辑同 我的评测
	if (isWeChat) {
		if (code) {
			next()
		} else {
			if (!getToken()) {
				const search = qs.stringify(to.query);
				store.dispatch("user/auth", {
					authType: 1,
					redirectUrl: `${window.location.origin}${path}?${search}`
				});
			} else {
				next()
			}
		}
	} else {
		next()
	}


}
/* 
meta 参数说明
showTabBar : 是否显示底部导航栏 true显示  false或不填隐藏
backTopHidden : 是否隐藏返回顶部按钮 true隐藏 false或不填显示
*/
export const routes = [
	{
		path: '/',
		name: 'Layout',
		redirect: '/home',
		component: () => import('@/layout/index'),
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index'),
				meta: {
					title: '首页',
					showTabBar: true,
				}
			},
			{
				path: '/classify',
				name: 'classify',
				component: () => import('@/views/classify/index'),
				meta: {
					title: '分类',
					showTabBar: true
				}
			},

			// ww注释
			// {
			// 	path: '/wodebaogao',
			// 	name: 'wodebaogao',
			// 	component: () => import('@/views/wodebaogao/index'),
			// 	meta: {
			// 		title: '我的报告',
			// 		showTabBar: true,
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { code } = to.query;
			// 		// 微信环境下做跳转拦截
			// 		if (isWeChat) {
			// 			// 授权回调过来带有code 进入路由
			// 			// if (code) {
			// 			//   next()
			// 			// } else {
			// 			//   // 未登录 或者未弹窗授权 跳转授权页
			// 			//   if (!getToken() || !store.getters.userInfo.headimgurl) {
			// 			//     await store.dispatch("user/auth", {
			// 			//       auth_type: 2,
			// 			//       self_redirect: `${window.location.origin}/wodebaogao`
			// 			//     });
			// 			//   } else {
			// 			//     next()
			// 			//   }

			// 			// }
			// 			next()
			// 		} else {
			// 			store.commit('app/SET_WECHATQRSHOW', true)
			// 			next(from.fullPath)
			// 		}

			// 	}
			// },
			{
				path: '/user',
				name: 'user',
				component: () => import('@/views/user/index'),
				meta: {
					title: '个人中心',
					showTabBar: true,
				},
				beforeEnter: async (to, from, next) => {
					const { code } = to.query;
					// 微信环境下做跳转拦截
					if (isWeChat) {
						// 授权回调过来带有code 进入路由
						// if (code) {
						//   next()
						// } else {
						//   // 未登录 或者未弹窗授权 跳转授权页
						//   if (!getToken() || !store.getters.userInfo.headimgurl) {
						//     await store.dispatch("user/auth", {
						//       auth_type: 2,
						//       self_redirect: `${window.location.origin}/user`
						//     });
						//   } else {
						//     next()
						//   }

						// }
						next()
					} else {
						store.commit('app/SET_WECHATQRSHOW', true)
						next(from.fullPath)
					}

				}
			},
			// ww注释
			// {
			// 	path: '/about',
			// 	name: 'about',
			// 	component: () => import('@/views/about/index'),
			// 	meta: {
			// 		title: '关于我们',
			// 	}
			// },
			// ww注释
			// {
			// 	path: '/downloadImage',
			// 	name: 'downloadImage',
			// 	component: () => import('@/views/downloadImage/index'),
			// 	meta: {
			// 		title: '瑞文智力专业评估报告',
			// 	}
			// },
			{
				path: '/vipCenter',
				name: 'vipCenter',
				component: () => import('@/views/vipCenter/index'),
				meta: {
					title: 'VIP会员中心',
					showTabBar: true,
				},
			},
			{
				path: '/detail',
				name: 'detail',
				component: () => import('@/views/detail/index'),
				meta: {
					title: '测评详情',
				},
				beforeEnter: async (to, from, next) => {
					const { promotionId, code } = to.query;
					// 逻辑同 我的评测
					if (isWeChat) {
						// if (promotionId || code) {
						if (code) {
							next()
						} else {
							if (!getToken()) {
								const search = qs.stringify(to.query)
								await store.dispatch("user/auth", {
									authType: 2,
									redirectUrl: `${window.location.origin}/detail?${search}`
								});
							} else {
								next()
							}

						}
					} else {
						next()
					}

				}
			},
			{
				path: '/chooseGender',
				name: 'chooseGender',
				component: () => import('@/views/detail/components/chooseGender'),
				meta: {
					title: '选择性别',
					backTopHidden: true
				},
			},
			{
				path: '/chooseGender2',
				name: 'chooseGender2',
				component: () => import('@/views/detail/components/chooseGender2'),
				meta: {
					title: '选择性别',
					backTopHidden: true
				},
				beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/chooseGender2')
			},
			// {
			//   path: '/mbti',
			//   name: 'mbti',
			//   component: () => import('@/views/goods/components/mbti'),
			//   meta: {
			//     title: 'MBTI',
			//     backTopHidden: true
			//   },
			// },
			{
				path: '/exam',
				name: 'exam',
				component: () => import('@/views/exam/index'),
				meta: {
					title: '答题',
					backTopHidden: true
				},
				beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/exam')
			},
			{
				path: '/exam2',
				name: 'exam2',
				component: () => import('@/views/exam2/index'),
				meta: {
					title: '答题',
					backTopHidden: true
				},
				beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/exam2')
			},
			// ww 注释
			// {
			// 	path: '/goodsExam',
			// 	name: 'goodsExam',
			// 	component: () => import('@/views/goodsExam/index'),
			// 	meta: {
			// 		title: '答题',
			// 		backTopHidden: true
			// 	},
			// 	beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/goodsExam')
			// },

			{
				path: '/chooseYear',
				name: 'chooseYear',
				component: () => import('@/views/exam/chooseYear'),
				meta: {
					title: '选择年龄',
					backTopHidden: true
				},
			},

			{
				path: '/vipOpened',
				name: 'vipOpened',
				component: () => import('@/views/vipOpened/index'),
				meta: {
					title: '会员开通',
				}
			},
			{
				path: '/vipOpenedSuccess',
				name: 'vipOpenedSuccess',
				component: () => import('@/views/vipOpenedSuccess/index'),
				meta: {
					title: '会员开通成功',
				}
			},
			{
				path: '/search',
				name: 'search',
				component: () => import('@/views/search/index'),
				meta: {
					title: '搜索',
					showTabBar: true
				}
			},
			{
				path: '/pay',
				name: 'pay',
				component: () => import('@/views/pay/index'),
				meta: {
					title: '支付',
				},
				beforeEnter: async (to, from, next) => {
					const { code } = to.query;
					// 逻辑同 我的评测
					if (isWeChat) {
						if (code) {
							next()
						} else {
							if (!getToken()) {
								const search = qs.stringify(to.query);
								await store.dispatch("user/auth", {
									authType: 1,
									redirectUrl: `${window.location.origin}/pay?${search}`
								});
							} else {
								next()
							}

						}
					} else {
						next()
					}

				}
			},
			{
				path: '/PaymentReminder',
				name: 'PaymentReminder',
				component: () => import('@/views/pay/components/PaymentReminder'),
				meta: {
					title: '支付提示页',
				},
			},
			{
				path: '/PaymentReminder2',
				name: 'PaymentReminder2',
				component: () => import('@/views/pay/components/PaymentReminder2'),
				meta: {
					title: '支付提示页',
				},
			},
			{
				path: '/report',
				name: 'report',
				component: () => import('@/views/report/index'),
				meta: {
					title: '报告',
				},
				beforeEnter: (to, from, next) => {
					// 微信环境下判断
					if (isWeChat) {
						const { promotionId, testPaperId } = to.query
						// 无token跳转商品详情页
						if (!getToken()) {
							next({
								path: "/detail",
								query: {
									promotionId, testPaperId
								},
								replace: true
							})
						} else {
							next()
						}
					} else {
						next()
					}
				}
			},
			// ww注释
			// {
			// 	path: '/reportView',
			// 	name: 'reportView',
			// 	component: () => import('@/views/reportView/index'),
			// 	meta: {
			// 		title: '报告',
			// 	},
			// 	beforeEnter: (to, from, next) => {
			// 		// 微信环境下判断
			// 		if (isWeChat) {
			// 			const { puid, guid } = to.query
			// 			// 无token跳转商品详情页
			// 			if (!getToken()) {
			// 				next({
			// 					path: "/goods",
			// 					query: {
			// 						puid, guid
			// 					},
			// 					replace: true
			// 				})
			// 			} else {
			// 				next()
			// 			}
			// 		} else {
			// 			next()
			// 		}
			// 	}
			// },
			{
				path: '/report-admin',
				name: 'report-admin',
				component: () => import('@/views/report/index'),
				meta: {
					title: '报告',
				},
			},

			{
				path: '/mbi_career',
				name: 'mbi_career',
				component: () => import('@/views/report/mbi_career'),
				meta: {
					title: '您的MBTI职业报告',
				},
				beforeEnter: async (to, from, next) => {
					const { promotionId, code } = to.query;
					// 逻辑同 我的评测
					if (isWeChat) {
						// if (promotionId || code) {
						if (code) {
							next()
						} else {
							if (!getToken()) {
								const search = qs.stringify(to.query)
								await store.dispatch("user/auth", {
									authType: 2,
									selfRedirect: `${window.location.origin}/detail?${search}`
								});
							} else {
								next()
							}

						}
					} else {
						next()
					}

				}
			},
			// ww注释
			// {
			// 	path: '/mbi_career2',
			// 	name: 'mbi_career2',
			// 	component: () => import('@/views/report/mbi_career2'),
			// 	meta: {
			// 		title: '您的MBTI职业报告',
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { puid, code } = to.query;
			// 		// 逻辑同 我的评测
			// 		if (isWeChat) {
			// 			// if (puid || code) {
			// 			if (code) {
			// 				next()
			// 			} else {
			// 				if (!getToken()) {
			// 					const search = qs.stringify(to.query)
			// 					await store.dispatch("user/auth", {
			// 						auth_type: 2,
			// 						self_redirect: `${window.location.origin}/goods?${search}`
			// 					});
			// 				} else {
			// 					next()
			// 				}

			// 			}
			// 		} else {
			// 			next()
			// 		}

			// 	}
			// },
			// ww注释
			// {
			// 	path: '/bawei_pay',
			// 	name: 'bawei_pay',
			// 	component: () => import('@/views/report/bawei_pay'),
			// 	meta: {
			// 		title: '您的八维测试报告',
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { puid, code } = to.query;
			// 		// 逻辑同 我的评测
			// 		if (isWeChat) {
			// 			// if (puid || code) {
			// 			if (code) {
			// 				next()
			// 			} else {
			// 				if (!getToken()) {
			// 					const search = qs.stringify(to.query)
			// 					await store.dispatch("user/auth", {
			// 						auth_type: 2,
			// 						self_redirect: `${window.location.origin}/goods?${search}`
			// 					});
			// 				} else {
			// 					next()
			// 				}

			// 			}
			// 		} else {
			// 			next()
			// 		}

			// 	}
			// },
			// ww注释
			// {
			// 	path: '/bawei_pay2',
			// 	name: 'bawei_pay2',
			// 	component: () => import('@/views/report/bawei_pay2'),
			// 	meta: {
			// 		title: '您的八维测试报告',
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { puid, code } = to.query;
			// 		// 逻辑同 我的评测
			// 		if (isWeChat) {
			// 			// if (puid || code) {
			// 			if (code) {
			// 				next()
			// 			} else {
			// 				if (!getToken()) {
			// 					const search = qs.stringify(to.query)
			// 					await store.dispatch("user/auth", {
			// 						auth_type: 2,
			// 						self_redirect: `${window.location.origin}/goods?${search}`
			// 					});
			// 				} else {
			// 					next()
			// 				}

			// 			}
			// 		} else {
			// 			next()
			// 		}

			// 	}
			// },
			// ww注释
			// {
			// 	path: '/love_pay',
			// 	name: 'love_pay',
			// 	component: () => import('@/views/report/love_pay'),
			// 	meta: {
			// 		title: '您的恋爱测试报告',
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { puid, code } = to.query;
			// 		// 逻辑同 我的评测
			// 		if (isWeChat) {
			// 			// if (puid || code) {
			// 			if (code) {
			// 				next()
			// 			} else {
			// 				if (!getToken()) {
			// 					const search = qs.stringify(to.query)
			// 					await store.dispatch("user/auth", {
			// 						auth_type: 2,
			// 						self_redirect: `${window.location.origin}/goods?${search}`
			// 					});
			// 				} else {
			// 					next()
			// 				}

			// 			}
			// 		} else {
			// 			next()
			// 		}

			// 	}
			// },
			// ww注释
			// {
			// 	path: '/love_pay2',
			// 	name: 'love_pay2',
			// 	component: () => import('@/views/report/love_pay2'),
			// 	meta: {
			// 		title: '您的恋爱测试报告',
			// 	},
			// 	beforeEnter: async (to, from, next) => {
			// 		const { puid, code } = to.query;
			// 		// 逻辑同 我的评测
			// 		if (isWeChat) {
			// 			// if (puid || code) {
			// 			if (code) {
			// 				next()
			// 			} else {
			// 				if (!getToken()) {
			// 					const search = qs.stringify(to.query)
			// 					await store.dispatch("user/auth", {
			// 						auth_type: 2,
			// 						self_redirect: `${window.location.origin}/goods?${search}`
			// 					});
			// 				} else {
			// 					next()
			// 				}

			// 			}
			// 		} else {
			// 			next()
			// 		}

			// 	}
			// },

			// ww注释
			// {
			// 	path: '/reportCoupon',
			// 	name: 'reportCoupon',
			// 	component: () => import('@/views/report/reportCoupon'),
			// 	meta: {
			// 		title: '结果页优惠券',
			// 	},
			// },
			// ww 注释
			// {
			// 	path: '/errorRecordPay',
			// 	name: 'errorRecordPay',
			// 	component: () => import('@/views/report/errorRecordPay'),
			// 	meta: {
			// 		title: '错题记录支付',
			// 	},
			// 	beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/errorRecordPay')
			// },
			{
				path: '/errorRecord',
				name: 'errorRecord',
				component: () => import('@/views/report/errorRecord'),
				meta: {
					title: '错题记录',
					showTabBar: isWeChat,
				},
				beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/errorRecord')
			},
			{
				path: '/collect',
				name: 'collect',
				component: () => import('@/views/collect/index'),
				meta: {
					title: '已收藏的测评',
					showTabBar: true,
				}
			},
			// ww注释

			// ww注释
			// {
			// 	path: '/order',
			// 	name: 'order',
			// 	component: () => import('@/views/order/index.vue'),
			// 	meta: {
			// 		title: '历史订单',
			// 	},
			// },
			// ww注释
			// {
			// 	path: '/myReport',
			// 	name: 'myReport',
			// 	component: () => import('@/views/myReport/index'),
			// 	meta: {
			// 		title: '我的报告',
			// 	}
			// },
			{
				path: '/giveManage',
				name: 'giveManage',
				component: () => import('@/views/giveManage/index'),
				meta: {
					title: '赠送管理',
					showTabBar: true
				}
			},
			{
				path: '/giveDetail',
				name: 'giveDetail',
				component: () => import('@/views/giveDetail/index'),
				meta: {
					title: '赠送详情',
				}
			},
			{
				path: '/article',
				name: 'article',
				component: () => import('@/views/article/index'),
				meta: {
					title: '文章详情',
				}
			},
			{
				path: '/wechatQr',
				name: 'wechatQr',
				component: () => import('@/views/wechatQr/index'),
				meta: {
					title: '微信公众号',
				}
			},
			// ww注释
			// {
			// 	path: '/topic',
			// 	name: 'topic',
			// 	component: () => import('@/views/topic/index'),
			// 	meta: {
			// 		title: '专题页',
			// 	},

			// 	beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/topic')
			// },

			{
				path: '/coupon',
				name: 'coupon',
				component: () => import('@/views/coupon/index'),
				meta: {
					title: '我的优惠券',
					showTabBar: true
				},

				beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/coupon')
			},
			// ww注释
			// {
			// 	path: '/get-coupon',
			// 	name: 'get-coupon',
			// 	component: () => import('@/views/get-coupon/index'),
			// 	meta: {
			// 		title: '领取优惠券',
			// 	},

			// 	beforeEnter: async (to, from, next) => authBeforeEnter(to, from, next, '/get-coupon')
			// },

			{
				path: '/coupon/couponUse',
				name: 'couponUse',
				component: () => import('@/views/coupon/couponUse'),
				meta: {
					title: '优惠券使用',
					showTabBar: true
				},
			},
			{
				path: '/mindfulness',
				name: 'mindfulness',
				component: () => import('@/views/mindfulness/index'),
				meta: {
					title: '正念',
					showTabBar: true,
				},
			},
			{
				path: '/mindfulness/detail',
				name: 'mindfulnessDetail',
				component: () => import('@/views/mindfulness/detail'),
				meta: {
					title: '正念详情',
					showTabBar: true,
				},
			},
			{
				path: '/mindfulness/play',
				name: 'mindfulnessPlay',
				component: () => import('@/views/mindfulness/play'),
				meta: {
					title: '播放页面',
					showTabBar: false,
				},
			},
			{
				path: '/brokerage',
				name: 'brokerage',
				component: () => import('@/views/brokerage/index'),
				meta: {
					title: '佣金',
					showTabBar: true,
				},
			},
			{
				path: '/yieldRecord',
				name: 'yieldRecord',
				component: () => import('@/views/brokerage/yieldRecord'),
				meta: {
					title: '收益明显',
					showTabBar: false,
				},
			},
			{
				path: '/withdrawRecord',
				name: 'withdrawRecord',
				component: () => import('@/views/brokerage/withdrawRecord'),
				meta: {
					title: '提现记录',
					showTabBar: false,
				},
			},
			{
				path: '/business',
				name: 'business',
				component: () => import('@/views/brokerage/business'),
				meta: {
					title: '商务合作',
					showTabBar: false,
				},
			},
			{
				path: '/businessStep',
				name: 'businessStep',
				component: () => import('@/views/brokerage/businessStep'),
				meta: {
					title: '分享-步骤',
					showTabBar: false,
				},
			},
			{
				path: '/privacyPolicy',
				name: 'privacyPolicy',
				component: () => import('@/views/user/privacyPolicy'),
				meta: {
					title: '隐私政策',
					showTabBar: false,
				},
			},
		]
	},
	// {
	// 	path: '/gallup/exam',
	// 	component: () => import('@/views/gallup/exam/index'),
	// },
	// {
	// 	path: '/gallup/:type?/report',
	// 	component: () => import('@/views/gallup/report/index'),
	// },
	// 404 直接重定向到首页
	{
		path: '/:pathMatch(.*)*',
		redirect: '/home',
	},
]


export const router = createRouter({
	history: createWebHistory(),
	routes,
})

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	// const targetPath = router.history.pending.fullPath;
	const targetPath = router.history.pending ? router.history.pending.fullPath : '';
	if (isChunkLoadFailed && targetPath) {
		router.replace(targetPath);
	}
})


export const setupRouter = (app) => {
	app.use(router)
	createRouterGuards(router)
}