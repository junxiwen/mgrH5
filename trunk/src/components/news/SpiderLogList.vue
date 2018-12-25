<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filterForm" label-width="80px" ref="filterForm">
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading" @sort-change="handleSort" style="width: 100%;">
            <el-table-column prop="id" label="id" width="150px" sortable fixed="left"></el-table-column>
            <el-table-column prop="content" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="insertTime" label="记录时间" :show-overflow-tooltip="true" ></el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="sizes, prev, pager, next,total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                           :current-page.sync='page' :page-size="pageSize" :page-sizes="pageSizes" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </div>
</template>

<script>
    import {URI_SPIDER_LOG} from '../../const/uri';
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
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            //获取列表
            initData() {
                this.$http.post(URI_SPIDER_LOG, {
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
            }
        }
    }
</script>

