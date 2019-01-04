import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login.vue'
import Welcome from '../components/Welcome.vue'
import Home from '../components/Home.vue'
import Loading from '../components/Loading.vue'

import SysResourceList from '../components/sys/SysResourceList.vue'
import SysUserList from '../components/sys/SysUserList.vue'
import SysRoleList from '../components/sys/SysRoleList.vue'
import SysRoleResourceList from '../components/sys/SysRoleResourceList.vue'
import SysUserChangePwd from '../components/sys/SysUserChangePwd.vue'

//用户列表
import UserInfoList from '../components/web/UserInfoList.vue'
import NewsList from '../components/news/NewsList.vue'
import SpiderKeyList from '../components/news/SpiderKeyList.vue'
import SpiderLogList from '../components/news/SpiderLogList.vue'
import ArticleList from '../components/news/ArticleList.vue'


Vue.use(Router)

export default new Router({
    scrollBehavior: () => ({y: 0}), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    routes: [
        {path: '*', redirect: '/login', hidden: true},
        {path: '/login', component: Login, name: 'Login', hidden: true},
        {path: '/loading', component: Loading, name: 'Loading', hidden: true},
        {
            path: '/',
            component: Home,
            name: '用户管理',
            iconCls: 'el-icon-mobile-phone',//图标样式class
            children: [
                {path: '/welcome', component: Welcome, name: '欢迎页', hidden: true},
                {path: '/userInfo', component: UserInfoList, name: '用户列表'},
                {path: '/sysUser', component: SysUserList, name: '系统用户'},
                {path: '/sysRole', component: SysRoleList, name: '系统角色'},
                {path: '/sysResource', component: SysResourceList, name: '系统权限'},
                {path: '/sysRoleResourceList/:roleId/:roleName',component: SysRoleResourceList,name: '设置权限',hidden: true},
                {path: '/sysUserChangePwd', component: SysUserChangePwd, name: '修改密码', hidden: true},
                {path: '/news', component: NewsList, name: '新闻列表'},
                {path: '/spiderKey', component: SpiderKeyList, name: '爬虫关键字'},
                {path: '/spiderLog', component: SpiderLogList, name: '爬虫日志'},
                {path: '/article', component: ArticleList, name: '文摘'},
            ]
        },
    ]
})
