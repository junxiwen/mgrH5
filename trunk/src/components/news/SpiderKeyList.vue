<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filterForm" label-width="80px" ref="filterForm">
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                    <el-button type="add" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading" @sort-change="handleSort" style="width: 100%;">
            <el-table-column prop="id" label="id" width="150px" sortable fixed="left"></el-table-column>
            <el-table-column prop="spiderKey" label="关键字" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="insertTime" label="记录时间" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="deleteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="sizes, prev, pager, next,total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                           :current-page.sync='page' :page-size="pageSize" :page-sizes="pageSizes" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


        <!--新增pid-->
        <el-dialog :title="editFormTitle" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="editFormRules">
                <el-form-item label="关键字" prop="spiderKey">
                    <el-input v-model="editForm.spiderKey"></el-input>
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
    import {URI_SPIDER_KEY,URI_SPIDER_KEY_ADD,URI_SPIDER_KEY_DEL} from '../../const/uri';
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
                editFormTitle:'',
                editFormRules: {
                    spiderKey: [
                        {required: true, message: '请输入关键字', trigger: 'blur'}
                    ],
                },
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            //获取列表
            initData() {
                this.$http.post(URI_SPIDER_KEY, {
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
            //删除
            deleteById(row) {
                this.$confirm('确定删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(URI_SPIDER_KEY_DEL + '/' + row.id).then((res) => {
                        this.$message.success(res.data.message);
                        this.initData();
                    }).catch((error) => {
                        this.loading = false;
                    });
                }).catch(() => {
                    //已取消删除
                });
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$http.post(URI_SPIDER_KEY_ADD ,{
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
            closeDialog(){
                this.editFormVisible = false;
                this.editForm = {};
            }
        }
    }
</script>

