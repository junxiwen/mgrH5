<template>
    <!-- form增加一个Enter事件 -->
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
             class="login-container" @keyup.enter.native="handleSubmit2">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="userName">
            <el-input type="text" v-model="ruleForm2.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="savePwd" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">
                登录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {URI_LOGIN} from '../const/uri';
    import SHA256 from 'crypto-js/sha256';

    export default {
        name: 'Login',
        data() {
            return {
                logining: false,
                ruleForm2: {
                    userName: '',
                    password: ''
                },
                rules2: {
                    userName: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                savePwd: true
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            handleSubmit2(e) {
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        this.$http.post(URI_LOGIN, {
                            userName: this.ruleForm2.userName,
                            password: SHA256(this.ruleForm2.password).toString()
                        }).then((res) => {
                            if (this.savePwd) {
                                window.localStorage.setItem('qqlgjf4ief34fww1', this.compile(this.ruleForm2.userName));
                                window.localStorage.setItem('qqlgjf4ief34fww2', this.compile(this.ruleForm2.password));
                            } else {
                                window.localStorage.setItem('qqlgjf4ief34fww1', '');
                                window.localStorage.setItem('qqlgjf4ief34fww2', '');
                            }
                            window.sessionStorage.setItem('zthMgrAccessToken', res.data.data.accessToken);
                            window.sessionStorage.setItem('zthMgrUserId', res.data.data.id);
                            window.sessionStorage.setItem('zthMgrUserName', res.data.data.userName);
                            window.sessionStorage.setItem('zthMgrRealName', res.data.data.realname);
                            this.logining = false;
                            this.$router.push('/welcome');
                        }).catch((error) => {
                            this.logining = false;
                        });
                    }
                });
            },
            initData() {
                this.ruleForm2.userName = this.uncompile(window.localStorage.getItem('qqlgjf4ief34fww1')) || '';
                this.ruleForm2.password = this.uncompile(window.localStorage.getItem('qqlgjf4ief34fww2')) || '';

                if (this.ruleForm2.userName && this.ruleForm2.password && this.ruleForm2.userName.length > 0) {
                    this.savePwd = true;
                } else {
                    this.savePwd = false;
                }
            },
            compile(code) {
                if (code && code.length > 0) {
                    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
                    for (var i = 1; i < code.length; i++) {
                        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
                    }
                    return encodeURI(c);
                }
                return code;
            },
            uncompile(code) {
                if (code && code.length > 0) {
                    code = decodeURI(code);
                    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
                    for (var i = 1; i < code.length; i++) {
                        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
                    }
                    return c;
                }
                return code;
            }
        }
    }
</script>

<style scoped>
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .remember {
        margin: 0px 0px 35px 0px;
    }
</style>
