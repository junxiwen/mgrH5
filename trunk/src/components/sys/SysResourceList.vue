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
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column prop="id" label="ID" sortable></el-table-column>
            <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="simpleName" label="简写" sortable></el-table-column>
            <el-table-column prop="orderNum" label="排序" sortable></el-table-column>
            <el-table-column prop="url" label="URL" sortable></el-table-column>
            <el-table-column prop="method" label="方法"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="简写" prop="simpleName">
                    <el-input v-model="editForm.simpleName" placeholder="请输入简写"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input type="number" v-model="editForm.orderNum" placeholder="排序"></el-input>
                </el-form-item>
                <el-form-item label="URL" prop="url">
                    <el-input v-model="editForm.url" placeholder="请输入URL"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="1">按钮</el-radio>
                        <el-radio class="radio" :label="0">菜单</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="父级列表">
                    <el-select v-model="editForm.parentId" filterable clearable >
                        <el-option v-for="item in arrList" :value="item.id" :key="item.id"
                                   :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="editForm.icon" placeholder="请输入图标"></el-input>
                </el-form-item>
                <el-form-item label="方法" prop="method">
                    <el-radio-group v-model="editForm.method">
                        <el-radio class="radio" label="GET">GET</el-radio>
                        <el-radio class="radio" label="POST">POST</el-radio>
                        <el-radio class="radio" label="PUT">PUT</el-radio>
                        <el-radio class="radio" label="DELETE">DELETE</el-radio>
                    </el-radio-group>
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
    import {URI_SYSRESOURCE} from '../../const/uri';
    export default {
        name: 'SysRoleResourceList',
        data() {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100],
                orderName: 'name',
                orderType: 'ASC',
                searchValue: '',
                loading: false,
                arrList: [],
                arrAllList: [],
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {},
                editFormTitle: '编辑',
                editFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    simpleName: [
                        {required: true, message: '请输入简写', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'}
                    ],
                    method: [
                        {required: true, message: '请输入方法', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请输入缩写', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted() {
            this.initData();
        },
        watch: {
            searchValue: function (newValue) {
                this.filterData();
            }
        },
        methods: {
            //获取列表
            initData() {
                this.searchValue = '';
                this.loading = true;
                this.$http.get(URI_SYSRESOURCE, {
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
            //过滤数据
            filterData() {
                if (this.searchValue) {
                    this.arrList = this.arrAllList.filter((row) => {
                        if (row.id && row.id.toString().indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.name && row.name.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.url && row.url.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.orderNum && row.orderNum.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        if (row.method && row.method.indexOf(this.searchValue) !== -1) {
                            return true;
                        }
                        return false;
                    })
                } else {
                    this.arrList = this.arrAllList;
                }
            },
            //删除
            handleDel(index, row) {
                this.$confirm('确认删除[' + row.name + ']吗?', {
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(URI_SYSRESOURCE + '/' + row.id).then((res) => {
                        this.$message.success(res.data.message);
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
                this.editForm = Object.assign({}, row);
                this.editFormTitle = '编辑ID: ' + row.id;
                this.editFormVisible = true;
            },
            //显示新增界面
            handleAdd() {
                this.editForm = {status: 0, type: 1, method: 'GET',};
                this.editFormTitle = '新增';
                this.editFormVisible = true;
                if (this.$refs['editForm']) {
                    this.$refs['editForm'].clearValidate();
                }
            },
            //提交
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if (this.editForm.id) {
                            this.$http.put(URI_SYSRESOURCE + '/' + this.editForm.id, this.editForm).then((res) => {
                                this.$message.success(res.data.message);
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.initData();
                            });
                        } else {
                            this.$http.post(URI_SYSRESOURCE, this.editForm).then((res) => {
                                this.$message.success(res.data.message);
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
