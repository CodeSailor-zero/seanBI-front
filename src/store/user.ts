// getters
import {StoreOptions} from "vuex";
import {UserControllerService} from "../../generated";

const getters = {};
export default {
    namespaced: true,
    state: () => ({
        loginUser: {
            userAccount: "",
            isLogin: false
        }
    }),
    getters,
    actions: {
        async getLoginUser({commit, state},playload) {
            const res = await UserControllerService.getLoginUserUsingGet();
            if (res.code === 0) {
                commit("updateLoginUser", res.data);
                state.loginUser.isLogin = true;
                console.log("测试拦截器",state.loginUser);
            } else {
                commit("updateLoginUser", {
                    ...state.loginUser,
                });
            }
        }
    },
    mutations: {
        updateLoginUser(state, payload) {
            state.loginUser = payload;
        },
        updateLoginUserScore(state, score) {
            state.loginUser.score = score;
        },
        updateLoginUserRole(state, userRole) {
            state.loginUser.userRole = userRole;
        },
        updateLoginUserAvatar(state, userAvatar) {
            state.loginUser.userRole = userAvatar;
        },
    },
} as StoreOptions<any>;