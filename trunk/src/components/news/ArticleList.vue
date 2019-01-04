<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filterForm" label-width="80px" ref="filterForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="filterForm.title" placeholder="模糊查询标题"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="请选择文章类型">
                        <el-option label="技术文章" value="1"></el-option>
                        <el-option label="逸闻趣事" value="2"></el-option>
                    </el-select>
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
            <el-table-column prop="type" label="类型" sortable>
                <template slot-scope="scope">
                        {{scope.row.type2 }}
                </template>
            </el-table-column>
            <el-table-column prop="insertTime" label="时间"/>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button @click="handleDel(scope.row)">删除</el-button>
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
                    <el-input type="textarea" v-model="editForm.content"/>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="1">技术文章</el-radio>
                        <el-radio class="radio" :label="2">逸闻趣事</el-radio>
                    </el-radio-group>
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
    import {URI_ARTICLE, URI_ARTICLE_ADD_UPDATE,URI_ARTICLE_DEL} from '../../const/uri';
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
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            //获取列表
            initData() {
                this.$http.post(URI_ARTICLE, {
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
            handleEdit(row) {
                if (this.$refs['editForm']) {
                    this.$refs['editForm'].clearValidate();
                }
                this.editForm = Object.assign({}, row);
                this.editFormTitle = '更新';
                this.editFormVisible = true;
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$http.post(URI_ARTICLE_ADD_UPDATE, {
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
            handleDel(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.$http.get(URI_ARTICLE_DEL + '/' + row.id, {}).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.initData();
                    }).catch((error) => {
                        this.loading = false;
                    });
                })
            },
            closeDialog(){
                this.editFormVisible = false;
                this.editForm = {};
            }
        }
    }
</script>

