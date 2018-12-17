<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    角色ID： {{roleId}} ; 角色名称： {{roleName}}；
                    <el-button type="primary" @click="editSubmit">选定提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading"
                  style="width: 100%;" @selection-change="handleSelectionChange" ref="multipleTable" @sort-change="handleSort">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable></el-table-column>
            <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="orderNum" label="排序" sortable></el-table-column>
            <el-table-column prop="url" label="URL" sortable></el-table-column>
            <el-table-column prop="method" label="方法"></el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {URI_SYSRESOURCE, URI_SYSROLE_RESOURCE, URI_SYSROLE_RESOURCELIST} from '../../const/uri';
    export default {
        name: 'SysResourceList',
        data() {
            return {
                orderName: 'name',
                orderType: 'ASC',
                roleId: '',
                roleName: '',
                loading: false,
                arrList: [],
                selectedResourcesIds: [],
                multipleSelection: []
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            //获取列表
            initData() {
                this.roleId = this.$route.params.roleId;
                this.roleName = this.$route.params.roleName;
                this.loading = true;
                this.$http.get(URI_SYSRESOURCE, {
                    params: {
                      reqOrderName: this.orderName,
                      reqOrderType: this.orderType,
                      reqPageSize: 9999,
                    }
                }).then((res) => {
                    this.arrList = res.data.data.data;
                    this.initSelected();
                    this.loading = false;
                }).catch((error) => {
                    this.loading = false;
                });
            },
            initSelected() {
                this.loading = true;
                this.$http.get(URI_SYSROLE_RESOURCELIST + '/' + this.roleId, {
                    params: {}
                }).then((res) => {
                    this.selectedResourcesIds = res.data.data;
                    this.loading = false;
                    this.arrList.forEach((item, index) => {
                        if (this.selectedResourcesIds.indexOf(item.id) > -1) {
                            this.$refs.multipleTable.toggleRowSelection(item);
                        }
                    });
                }).catch((error) => {
                    this.loading = false;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //提交
            editSubmit() {
                let checkedResourceId = [];
                let userId = window.sessionStorage.getItem('zthMgrUserId');
                this.multipleSelection.forEach((item, index) => {
                    checkedResourceId.push(item.id);
                });
                this.$http.put(URI_SYSROLE_RESOURCE + '/' + this.roleId, {
                    selectedResourceIds: checkedResourceId,
                    mgrUserId: userId
                }).then((res) => {
                    this.$message.success(res.data.message);
                    this.$router.push("/sysRole");
                });
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
