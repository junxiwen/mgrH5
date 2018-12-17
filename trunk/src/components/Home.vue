<template>
    <el-row class="container">
        <!-- 头部 -->
        <el-col :span="24" class="header">
            <el-col :span="3" class="logo">
                <img src="static/img/logo.png"/>
                管理平台
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="el-icon-menu"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                    <span class="el-dropdown-link userInfoName-inner">
                         {{realName}}
                     </span>
                <el-dropdown trigger="click"
                             @command='setDialogInfo'>
                     <span class="el-dropdown-link userinfo-inner">
                          <i class="el-icon-caret-bottom el-icon--right"></i>
                     </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='info'>我的消息</el-dropdown-item>
                        <el-dropdown-item command='pass' @click.native="resetPwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command='logout' divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <i class="fa fa-sign-out logout" @click='logout'></i>
            </el-col>
        </el-col>

        <!-- 主体 -->
        <el-col :span="24" class="main">
            <!--导航菜单-->
            <aside :class="collapsed ? 'menu-collapsed' : 'menu-expanded'">

                <!--<el-menu :default-active="$route.path" :unique-opened="true" class="el-menu-vertical-demo"-->
                <!--@open="handleopen"-->
                <!--@close="handleclose" @select="handleselect" router :collapse="collapsed"-->
                <!--background-color="#545c64"-->
                <!--text-color="#fff"-->
                <!--active-text-color="#ffd04b">-->
                <!--<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">-->
                <!--<el-submenu :index="index+''" v-if="!item.leaf">-->
                <!--<template slot="title">-->
                <!--<i :class="item.iconCls"></i>-->
                <!--<span slot="title">{{item.name}}</span>-->
                <!--</template>-->
                <!--<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"-->
                <!--v-if="!child.hidden">{{child.name}}-->
                <!--</el-menu-item>-->
                <!--</el-submenu>-->
                <!--<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">-->
                <!--<i :class="item.iconCls"></i>{{item.children[0].name}}-->
                <!--</el-menu-item>-->
                <!--</template>-->
                <!--</el-menu>-->

                <el-menu :unique-opened="true" class="el-menu-vertical-demo"
                         @open="handleopen"
                         @close="handleclose" @select="handleselect" router :collapse="collapsed"
                         background-color="#545c64"
                         text-color="#fff"
                         active-text-color="#ffd04b">
                    <template v-for="(item,index) in resources">
                        <el-submenu :index="index+''">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span slot="title">{{item.title}}</span>
                            </template>
                            <el-menu-item v-for="child in item.children" :index="child.url" :key="child.url"
                            >{{child.title}}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </aside>
            <!-- 内容区域 -->
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import {URI_LOGOUT} from '../const/uri';
    import {URI_SYSROLE_RESOURCE, URI_GETROLEIDBYUSERID} from '../const/uri';
    export default {
        name: 'Home',
        data() {
            return {
                collapsed: false,
                sysUserName: 'UserName',
                resources: [],
                resources0: [],
            }
        },
        computed: {
            realName() {
                return window.sessionStorage.getItem('zthMgrRealName');
            },
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData(){
                this.userId = window.sessionStorage.getItem('zthMgrUserId');
                this.$http.get(URI_GETROLEIDBYUSERID, {
                    params: {
                        userId: this.userId
                    }
                }).then((res) => {
                    let roleId = res.data.data.roleId;
                    window.sessionStorage.setItem('zthMgrSysRoleId', res.data.data.roleId);
                    window.sessionStorage.setItem('zthMgrSysUserId', res.data.data.userId);
                    this.$http.get(URI_SYSROLE_RESOURCE + '/' + roleId, {}).then((res) => {
                        this.resources = res.data.data;
                    });
                });
            },
            setDialogInfo(cmditem) {
                if (!cmditem) {
                    this.$message('菜单选项缺少command属性');
                    return;
                }
                switch (cmditem) {
                    case 'info':
                    case 'pass':
                        this.resetPwd();
                        break;
                    case 'logout':
                        this.logout();
                        break;
                }
            },

            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect(a, b) {
                //console.log('handleselect');
            },
            resetPwd() {
                this.$router.push('/sysUserChangePwd');
            },
            logout() {
                var _this = this;
                this.$confirm('确认退出吗?', {
                    type: 'warning'
                }).then(() => {
                    this.$http.get(URI_LOGOUT).then((res) => {
                        window.sessionStorage.removeItem('zthMgrAccessToken');
                        window.sessionStorage.removeItem('zthMgrUserId');
                        window.sessionStorage.removeItem('zthMgrUserName');
                        window.sessionStorage.removeItem('zthMgrRealName');
                        _this.$router.push('/login');
                    });

                }).catch(() => {
                    // console.log('取消退出登录操作');
                });
            },
            collapse() {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        }
    }
</script>

<style scoped>

    .title {
        font-size: 20px;
        font-family: cursive;
        letter-spacing: 3px;
    }

    .logout {
        vertical-align: middle;
        cursor: pointer;
    }

    .container .header .realName {
        text-align: right;
        padding-right: 35px;
        float: right;
    }

    .container .header .userinfo .realName-inner {
        cursor: pointer;
        color: #4db3ff;
    }

    .userName {
        cursor: pointer;
        margin-right: 5px;
    }

    .el-dropdown {
        color: #FFF;
    }

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .container .header {
        height: 60px;
        line-height: 60px;
        background: #545c64;
        color: #bebebe;
    }

    .container .header .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
    }

    .container .header .userinfo .userinfo-inner {
        cursor: pointer;
        color: #4db3ff;
    }

    .container .header .userinfo .userInfoName-inner {
        color: #ff5f76;
    }

    .container .header .userinfo .userinfo-inner img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: left;
    }

    .container .header .logo {
        height: 60px;
        font-size: 20px;
        padding-left: 20px;
        padding-right: 20px;
        /*border-color: rgba(238, 241, 146, 0.3);*/
        /*border-right-width: 1px;*/
        /*border-right-style: solid;*/
    }

    .container .header .logo img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px -10px;
    }

    .container .header .logo .txt {
        color: #bebebe;
    }

    .container .header .logo-width {
        width: 180px;
    }

    .container .header .logo-collapse-width {
        width: 64px;
    }

    .container .header .tools {
        padding: 0px 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
    }

    .container .main {
        display: flex;
        position: absolute;
        top: 60px;
        bottom: 0px;
        overflow: hidden;
    }

    .container .main aside {
        flex: 0 0 180px;
        width: 180px;
        overflow-y: auto;
    }

    .container .main aside .el-menu {
        height: 100%;
    }

    .container .main aside .collapsed {
        width: 60px;
    }

    .container .main aside .collapsed .item {
        position: relative;
    }

    .container .main aside .collapsed .submenu {
        position: absolute;
        top: 0px;
        left: 60px;
        z-index: 99999;
        height: auto;
        display: none;
    }

    .container .main .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
    }

    .container .main .menu-expanded {
        flex: 0 0 180px;
        width: 180px;
    }

    .container .main .content-container {
        flex: 1;
        overflow-y: scroll;
        padding: 20px;
    }

    .container .main .content-container .breadcrumb-container .title {
        width: 200px;
        float: left;
        color: #bebebe;
    }

    .container .main .content-container .breadcrumb-container .breadcrumb-inner {
        float: right;
    }

    .container .main .content-container .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
    }

    .el-submenu .el-menu-item {
        height: 36px;
        line-height: 36px;
        padding: 0 20px;
        min-width: 180px;
    }

    .el-submenu__title {
        height: 45px;
        line-height: 45px;
    }

</style>
