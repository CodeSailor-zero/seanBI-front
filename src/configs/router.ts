import AddChartView from "../views/AddChartView.vue";
import MyChartView from "../views/MyChartView.vue";
import AddCharAsynctView from "../views/AddCharAsynctView.vue";
import LoginView from "../views/user/LoginView.vue";
import RegisterView from "../views/user/RegisterView.vue";
import userLayout from "../components/userLayout.vue";
import MyView from "../views/user/MyView.vue";
import SignView from "../views/user/SignView.vue";
import UserEditView from "../views/user/UserEditView.vue";
import UserPrizeView from "../views/user/UserPrizeView.vue";
import UserAvatarEditView from "../views/user/UserAvatarEditView.vue";
import ManageMyChartView from "../views/Manager/ManageMyChartView.vue";
import AdminManageChartView from "../views/Manager/AdminManageChartView.vue";
import accessEnum from "../access/accessEnum";
import NoAuthView from "../views/NoAuth/NoAuthView.vue";


const routes = [
    {
        path: '/user', component: userLayout, children: [
            {path: '/user/login', name: 'login', component: LoginView},
            {path: '/user/register', name: 'register', component: RegisterView},
            {
                path: '/user/sign',
                component: SignView,
                meta: {
                    access: accessEnum.USER
                }
            },
            {
                path: '/user/edit',
                component: UserEditView,
                meta: {
                    access: accessEnum.USER
                }
            },
            {
                path: '/user/avatar/edit',
                component: UserAvatarEditView,
                meta: {
                    access: accessEnum.USER
                }
            },
            {
                path: '/user/exchange',
                component: UserPrizeView,
                meta: {
                    access: accessEnum.USER
                }
            },
        ]
    },
    {
        path: '/my',
        component: MyView,
        meta: {
            access: accessEnum.USER
        }
    },
    {
        path: '/add/chart',
        component: AddChartView,
        name: "生成图表",
        meta: {
            access: accessEnum.USER
        }
    },
    {
        path: '/add/async/chart',
        component: AddCharAsynctView,
        name: "异步生成图表",
        meta: {
            access: accessEnum.USER
        }
    },
    {
        path: '/my/chart',
        component: MyChartView,
        name: "我的图表",
        meta: {
            access: accessEnum.USER
        }
    },
    {
        path: '/manage/my/chart',
        component: ManageMyChartView,
        name: "管理我的图表",
        meta: {
            access: accessEnum.USER
        }
    },
    {
        path: '/admin/manage/chart',
        component: AdminManageChartView,
        name: "管理图表(管理员)",
        meta: {
            isHidden: true,
            access: accessEnum.ADMIN
        }
    },
    {
        path: '/noAuth',
        component: NoAuthView,
        meta: {
            isHidden: true,
            access: accessEnum.USER
        }
    },
]
export default routes;