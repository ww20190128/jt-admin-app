import { getToken, setToken } from "@/utils/auth";
import { getUserInfo } from "@/api/admin";
import { storage } from "@/utils/tools";
const state = {
  token: getToken(), //token
  userInfo: storage().get("userInfo") || {}, // 用户信息
  config: storage().get("config") || {}, // 个人中心页配置
  hasUserInfo: !!storage().get("hasUserInfo"), // 是否有用户信息
};

const mutations = {
  // 更新token
  SET_TOKEN: (state, token) => {
    state.token = token;
    setToken(token);
  },
  // 更新用户信息
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
    storage().set("userInfo", userInfo);
  },
  // 更新是否有用户信息
  SET_HASUSERINFO: (state, hasUserInfo) => {
    state.hasUserInfo = hasUserInfo;
    storage().set("hasUserInfo", hasUserInfo);
  },
};

const actions = {
  // 获取用户信息
  setUserToken({ commit }, data) {
    commit("SET_TOKEN", "Bearer " + data.token);
    return new Promise(async (resolve, reject) => {
      try {
        const { data, requestId } = await getUserInfo(data);
        data.requestId = requestId;
        commit("SET_USERINFO", data);
        commit("SET_HASUSERINFO", true);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
