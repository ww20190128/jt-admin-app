import { RouterView, createRouter, createWebHistory } from "vue-router";
import { createRouterGuards } from "./routerGuards";

/* 
meta 参数说明
showTabBar : 是否显示底部导航栏 true显示  false或不填隐藏
backTopHidden : 是否隐藏返回顶部按钮 true隐藏 false或不填显示
*/
export const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/agent",
    component: () => import("@/layout/index"),
    children: [
      {
        path: "/agent",
        name: "agent",
        component: () => import("@/views/agent/index"),
        meta: {
          title: "代理",
          showTabBar: true,
        },
      },
      {
        path: "/agent/topUp",
        name: "agent/topUp",
        component: () => import("@/views/agent/topUp"),
        meta: {
          title: "充值",
          showTabBar: false,
        },
      },
      {
        path: "/agent/info",
        name: "agentInfo",
        component: () => import("@/views/agent/info"),
        meta: {
          title: "代理详情",
          showTabBar: false,
        },
      },
      {
        path: "/account",
        name: "account",
        component: () => import("@/views/account/index"),
        meta: {
          title: "账号",
          showTabBar: true,
        },
      },
      {
        path: "/account/info",
        name: "account-info",
        component: () => import("@/views/account/info"),
        meta: {
          title: "账号详情",
          showTabBar: false,
        },
      },

      {
        path: "/account/trainSettings",
        name: "account-trainSettings",
        component: () => import("@/views/account/trainSettings"),
        meta: {
          title: "训练设置",
          showTabBar: false,
        },
      },
      {
        path: "/account/create",
        name: "account-create",
        component: () => import("@/views/account/create"),
        meta: {
          title: "新增账号",
          showTabBar: false,
        },
      },
      {
        path: "/mine",
        name: "mine",
        component: () => import("@/views/mine/index"),
        meta: {
          title: "个人中心",
          showTabBar: true,
        },
      },
      {
        path: "/login",
        name: "login",
        component: () => import("@/views/mine/login"),
        meta: {
          title: "登录",
        },
      },
    ],
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
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  // const targetPath = router.history.pending.fullPath;
  const targetPath = router.history.pending
    ? router.history.pending.fullPath
    : "";
  if (isChunkLoadFailed && targetPath) {
    router.replace(targetPath);
  }
});

export const setupRouter = (app) => {
  app.use(router);
  createRouterGuards(router);
};
