<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchValue" suffix-icon="el-icon-search" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="initData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading" style="width: 100%;"
                  @sort-change="handleSort">
            <el-table-column prop="id" label="ID" width="80" sortable fixed="left"></el-table-column>
            <el-table-column prop="realname" label="显示名称" width="120" sortable></el-table-column>
            <el-table-column prop="userName" label="用户名" width="120" sortable></el-table-column>
            <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus" sortable
                             :filters="[{ text: '正常', value: '0' }, { text: '禁用', value: '1' }]"
                             :filter-method="filterStatus" filter-placement="bottom-end"></el-table-column>
            <el-table-column prop="mobilephone" label="手机" width="120"></el-table-column>
            <el-table-column prop="insertTime" label="添加时间" width="170" sortable></el-table-column>
            <el-table-column prop="descr" label="备注" min-width="100"></el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleRepwd(scope.$index, scope.row)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="sizes, prev, pager, next,total" @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
                         :current-page.sync='page' :page-size="pageSize" :page-sizes="pageSizes" :total="total"
                         style="float:right;">
          </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog :title="editFormTitle" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="显示名称" prop="realname">
                    <el-input v-model="editForm.realname" placeholder="请输入显示名称"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="0">正常</el-radio>
                        <el-radio class="radio" :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="editForm.mobilephone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.descr"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="editForm.roleIds" multiple placeholder="请选择角色">
                        <el-option v-for="item in roleList" :label="item.name" :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {URI_SYSUSER, URI_SYSROLE} from '../../const/uri';

    export default {
        name: 'SysUserList',
        data() {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100],
                orderName: 'id',
                orderType: 'DESC',
                searchValue: '',
                loading: false,
                arrList: [],
                arrAllList: [],
                roleList: [],
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {},
                editFormTitle: '编辑',
                editFormRules: {
                    realname: [
                        {required: true, message: '请输入真实用户名', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
            this.initData();
            this.initRoles();
        },
        watch: {
            searchValue: function (newValue) {
                this.filterData();
            }
        },
        methods: {
            //状态显示转换
            formatStatus(row, column) {
                return row.status == 1 ? '禁用' : row.status == 0 ? '正常' : '未知' + row.status;
            },
            //初始化角色
            initRoles() {
                this.$http.get(URI_SYSROLE, {
                    params: {
                      reqPageSize: 9999,
                    }
                }).then((res) => {
                    this.roleList = res.data.data.data;
                });
            },
            //获取列表
            initData() {
                this.searchValue = '';
                this.loading = true;
                this.$http.get(URI_SYSUSER, {
                    params: {
                      reqPage: this.page,
                      reqPageSize: this.pageSize,
                      reqOrderName: this.orderName,
                      reqOrderType: this.orderType,
                    }
                }).then((res) => {
                    this.arrList = res.data.data.data;
                    this.arrAllList = this.arrList;
                    this.loading = false;
                    this.total = res.data.data.total;
                }).catch((error) => {
                    this.loading = false;
                });
            },
            //过滤状态
            filterStatus(value, row) {
                return row.status == value;
            },
            //过滤数据
            filterData() {
                if (this.searchValue) {
                    this.arrList = this.arrAllList.filter((row) => {
                        if (row.id && row.id.toString().indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.userName && row.userName.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.realname && row.realname.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.mobilephone && row.mobilephone.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.descr && row.descr.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        return false;
                    })
                } else {
                    this.arrList = this.arrAllList;
                }
            },
            //重置密码
            handleRepwd(index, row) {
                this.$confirm('确认重置[' + row.realname + ']的密码吗?', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post(URI_SYSUSER + '/resetPwd/' + row.id, {}).then((res) => {
                        this.$alert(res.data.message);
                        this.initData();
                    });
                }).catch(() => {
                    // 取消了
                });
            },
            //显示编辑界面
            handleEdit(index, row) {
                if (this.$refs['editForm']) {
                    this.$refs['editForm'].clearValidate();
                }
                // 这里不能直接这样读取，因为列表里面没有角色相关的信息
                // this.editForm = Object.assign({}, row);
                this.$http.get(URI_SYSUSER + '/' + row.id, {
                    params: {}
                }).then((res) => {
                    this.editFormTitle = '编辑ID: ' + row.id;
                    this.editForm = res.data.data;
                    this.editFormVisible = true;
                });
            },
            //显示新增界面
            handleAdd() {
                if (this.$refs['editForm']) {
                  this.$refs['editForm'].clearValidate();
                }
                this.editForm = {status: 0,roleIds:[]};
                //this.editForm = {status: 0};
                this.editFormTitle = '新增';
                this.editFormVisible = true;
            },
            //提交
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if (this.editForm.id) {
                            this.$http.put(URI_SYSUSER + '/' + this.editForm.id, this.editForm).then((res) => {
                                this.$message.success(res.data.message);
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.initData();
                            });
                        } else {
                            this.$http.post(URI_SYSUSER, this.editForm).then((res) => {
                                this.$alert(res.data.message);
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.initData();
                            });
                        }
                    } else {
                        this.$message.error('表单验证失败!');
                    }
                });
            },
            handleCurrentChange(page) {
              this.page = page;
              this.initData();
            },
            handleSizeChange(pageSize) {
              this.pageSize = pageSize;
              this.page = 1;
              this.initData();
            },
            handleSort(column, prop, order) {
              // console.log(column, prop, order)
              this.orderName = column.prop;
              if (column.order === 'ascending') {
                this.orderType = 'ASC';
              } else if (column.order === 'descending') {
                this.orderType = 'DESC';
              }
              this.page = 1;
              this.initData();
            },
        }
    }
</script>

<style scoped>
</style>
