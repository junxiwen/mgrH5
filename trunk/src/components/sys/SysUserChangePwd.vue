<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="原密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="rePassword">
                <el-input type="password" v-model="form.rePassword" placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {URI_CHANGEPWD} from '../../const/uri';
    import SHA256 from 'crypto-js/sha256';

    export default {
        name: 'SysUserChangePwd',
        data() {
            var validateRePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {},
                rules: {
                    password: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {type: 'string', min: 5, max: 20, message: '密码长度5-20之间', trigger: 'blur'}
                    ],
                    rePassword: [
                        { validator: validateRePassword, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post(URI_CHANGEPWD, {
                            password: SHA256(this.form.password).toString(),
                            newPassword: SHA256(this.form.newPassword).toString(),
                            rePassword: SHA256(this.form.rePassword).toString()
                        }).then((res) => {
                            window.localStorage.setItem('qqlgjf4ief34fww1', '');
                            window.localStorage.setItem('qqlgjf4ief34fww2', '');
                            this.$message.success("修改成功请重新登录");
                            this.$router.push('/login');
                        });
                    } else {
                        this.$message.error('表单验证失败!');
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
