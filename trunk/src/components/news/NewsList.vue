<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filterForm" label-width="80px" ref="filterForm">
                <el-form-item label="备注" prop="content">
                    <el-input v-model="filterForm.content" placeholder="模糊查询备注"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                    <el-button type="add" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading"
                  @sort-change="handleSort"
                  style="width: 100%;">
            <el-table-column prop="id" label="id" width="150px" sortable fixed="left"/>
            <el-table-column prop="title" label="标题"/>
            <el-table-column prop="url" label="url">
                <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="备注"/>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 0 ? 'primary' : 'danger'" circle>
                        {{scope.row.status2 }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="insertTime" label="时间"/>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button :type="scope.row.status == 0 ? 'danger' : 'primary'" size="mini"
                               @click="handleUpdate(scope.row)">{{scope.row.status === 0 ? '设为失效' : '设为正常'}}</el-button>
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


        <!--新增新闻-->
        <el-dialog :title="editFormTitle" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="editFormRules">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editForm.title"/>
                </el-form-item>
                <el-form-item label="url" prop="url">
                    <el-input v-model="editForm.url"/>
                </el-form-item>
                <el-form-item label="备注" prop="content">
                    <el-input v-model="editForm.content"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="closeDialog">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {URI_NEWS_LIST, URI_NEWS_ADD,URI_NEWS_UPDATE} from '../../const/uri';
    export default {
        data() {
            return {
                loading: false,
                total: 0,
                page: 1,
                pageSize: 10,
                orderName: 'id',
                orderType: 'DESC',
                pageSizes: [10, 20, 30, 50, 100],
                arrList: [],
                filterForm: {},
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {},
                editFormTitle: '',
                editFormRules: {
//                    id: [
//                        {required: true, message: '请输入用户id', trigger: 'blur'}
//                    ],
//                    code: [
//                        {required: true, message: '请输入邀请码', trigger: 'blur'}
//                    ],
//                    name: [
//                        {required: true, message: '请输入姓名', trigger: 'blur'}
//                    ]
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            //获取列表
            initData() {
                this.$http.post(URI_NEWS_LIST, {
                    reqPage: this.page,
                    reqPageSize: this.pageSize,
                    ...this.filterForm,
                    reqOrderName: this.orderName,
                    reqOrderType: this.orderType
                }).then((res) => {
                    this.arrList = res.data.data.data;
                    this.total = res.data.data.total;
                    this.loading = false;
                }).catch((error) => {
                    this.loading = false;
                });
                this.loading = true;
            },
            handleSearch() {
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
            handleReset() {
                this.filterForm = {};
                this.page = 1;
                this.initData();
            },
            handleCurrentChange(page) {
                this.page = page;
                this.initData();
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.page = 1;
                this.initData();
            },//新增
            handleAdd() {
                if (this.$refs['editForm']) {
                    this.$refs['editForm'].clearValidate();
                }
                this.editForm = {};
                this.editFormTitle = '新增';
                this.editFormVisible = true;
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$http.post(URI_NEWS_ADD, {
                            ...this.editForm
                        }).then((res) => {
                            this.$message.success(res.data.message);
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                            this.initData();
                        });
                    } else {
                        this.$message.error('表单验证失败!');
                    }
                });
            },
            handleUpdate(row) {
                this.$http.get(URI_NEWS_UPDATE + '/' + row.id, {

                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '更新成功!'
                    });
                    this.initData();
                }).catch((error) => {
                    this.loading = false;
                });
            },
            closeDialog(){
                this.editFormVisible = false;
                this.editForm = {};
            }
        }
    }
</script>

