<template>
    <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="userInfoForm" ref="userInfoForm">

                <el-form-item>
                    <el-input v-model="userInfoForm.id"
                              placeholder="搜索ID"/>
                </el-form-item>

                <el-form-item>
                    <el-input type="numBer" v-model="userInfoForm.phoneNum" placeholder="精确搜索手机号"
                              prefix-icon="el-icon-mobile-phone"/>
                </el-form-item>
                <el-form-item>
                    <el-select clearable class="filter-item" style="width: 130px" v-model="userInfoForm.type"
                               placeholder="注册类型">
                        <el-option v-for="item in  calendarTypeOptions" :key="item.key"
                                   :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select clearable class="filter-item" style="width: 130px" v-model="userInfoForm.canIssuance"
                               placeholder="发布类型">
                        <el-option v-for="item in  calendarCanIssuance" :key="item.key"
                                   :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select clearable class="filter-item" style="width: 130px" v-model="userInfoForm.userProperty"
                               placeholder="发布广告类型">
                        <el-option v-for="item in  calendarUserProperty" :key="item.key"
                                   :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                        v-model="userInfoForm.reqDateStart"
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="yyyy-MM-dd"
                        clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="userInfoForm.reqDateEnd"
                        type="datetime"
                        placeholder="选择结束时间"
                        value-format="yyyy-MM-dd"
                        clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="handleEmp">清空</el-button>
                    <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                </el-form-item>
            </el-form>
        </el-col>

        <!--表格-->
        <el-table :data="arrList" size="medium" stripe highlight-current-row v-loading="loading" border fit
                  style="width: 100%">

            <el-table-column
                prop="id"
                label="ID"
                width="155"
                sortable fixed="left">
            </el-table-column>

            <el-table-column
                prop="phoneNum"
                fixed
                width="135"
                label="手机">
                <template slot-scope="scope">
                    <i class="el-icon-mobile-phone"></i>
                    <span style="margin-left: 10px">{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>

            <el-table-column
                width="80"
                label="用户性别">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.sex == 1 ? 'primary' : scope.row.sex == 2 ? 'danger':'info'" circle>
                        {{scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : '未选择'}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                width="165"
                label="广告发布">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.canIssuance == 0 ? 'danger' :'success'" circle>
                        {{scope.row.canIssuance == 0 ? "不能发布" : '可以发布'}}
                    </el-tag>
                    <el-tag v-if="scope.row.canIssuance == 1"
                            :type="scope.row.userProperty == 1 ? 'success' : 'warning'"
                            circle>{{scope.row.userProperty == 1 ? "个人广告" : "企业广告"}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                width="230"
                label="用户昵称">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit">
                        <el-input class="edit-input" size="small" v-model="scope.row.nickName"></el-input>
                        <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning"
                                   @click="cancelEdit(scope.row)">返回
                        </el-button>
                    </template>
                    <span v-else>{{ scope.row.nickName }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="用户头像"
                width="100">
                <template slot-scope="scope">
                    <img :src="scope.row.headImage2" width="65" height="65 "/>
                </template>
            </el-table-column>

            <el-table-column
                label="用户生日"
                width="185">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.birthday }}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="address"
                label="用户地址">
            </el-table-column>

            <el-table-column prop="type"
                             label="注册状态"
                             width="120"
                             :formatter="formatStatus"
                             :filters="[{ text: '注册用户', value: '1' }, { text: '未注册用户', value: '2' }]"
                             :filter-method="filterStatus"
                             filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.type == 1 ? 'success' : 'warning'">
                        {{scope.row.type == 1 ? "注册用户" : "未注册用户"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="platform"
                             label="设备系统"
                             width="90"
                             :formatter="formatPlat"
                             :filters="[{ text: 'IOS', value: '1' }, { text: 'Android', value: '2' }]"
                             :filter-method="filterPlat"
                             filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.platform == 1 ? 'info' : 'success'">
                        {{scope.row.platform == 1 ? 'IOS' : 'Android'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="注册时间"
                width="180"
                sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="devId"-->
            <!--label="设备信息">-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="small"
                               icon="el-icon-circle-check-outline">修改
                    </el-button>
                    <el-button v-else type="primary" @click='scope.row.edit = !scope.row.edit' size="small"
                               icon="el-icon-edit">昵称
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="page" :page-sizes="[10,20,30,50,100]" :page-size="limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-col>

    </div>
</template>

<script>
    import {URI_USERINFO, URI_MODIFYUSER} from '../../const/uri';
    import ElTag from "../../../node_modules/element-ui/packages/tag/src/tag";

    const calendarTypeOptions = [
        {key: '1', display_name: '注册用户'},
        {key: '2', display_name: '未注册用户'}
    ];
    const calendarCanIssuance = [
        {key: '0', display_name: '不能发布'},
        {key: '1', display_name: '可以发布'}
    ];
    const calendarUserProperty = [
        {key: '1', display_name: '个人广告'},
        {key: '2', display_name: '企业广告'}
    ];

    export default {
        components: {ElTag},
        data() {
            return {
                loading: false,
                arrList: [],
                arrAllList: [],
                total: null,
                userInfoForm: {},
                page: 1,
                limit: 10,
                list: null,
                type: null,
                calendarTypeOptions,
                calendarCanIssuance,
                calendarUserProperty
            }
        },
        mounted() {
            this.initData();
        },
        watch: {},
        methods: {
            showFundArticle(row){
                //实现菜单跳转，重定向
//                this.$router.push("/welcome");
//                this.$router.push({path: '/showFundArticle',query:{'row':row}});
            },

            confirmEdit(row){
                row.edit = false
                row.originalNickName = row.nickName;
                this.$http.post(URI_MODIFYUSER, {
                    nickName: row.originalNickName,
                    id: row.id
                }).then((res) => {
                    this.$message.success("昵称已修改");
                });
            },

            cancelEdit(row){
                row.nickName = row.originalNickName;
                row.edit = false;
                this.$message({
                    message: '昵称未保存已还原',
                    type: 'warning'
                })
            },

            //状态显示转换
            formatStatus(row, column) {
                return row.type == 1 ? '注册用户' : '未注册用户';
            },
            formatPlat(row, column){
                return row.platform == 1 ? 'IOS' : 'Android';
            },
            //获取列表
            initData() {
                if (this.$route.query.row) {
                    this.userInfoForm.id = this.$route.query.row;
                }
                this.loading = true;
                this.$http.post(URI_USERINFO, {
                    reqPage: this.page,
                    reqPageSize: this.pageSize,
                    reqOrderName: this.orderName,
                    reqOrderType: this.orderType,
                    ...this.userInfoForm,
                }).then((res) => {
                    this.arrList = res.data.data.data;
                    this.arrAllList = this.arrList;
                    this.total = res.data.data.total;
                    const items = res.data.data.data;
                    this.list = items.map(v => {
                        this.$set(v, 'edit', false);
                        v.originalNickName = v.nickName;
                        return v;
                    });
                    this.loading = false;
                }).catch((error) => {
                    this.loading = false;
                });
            },
            //过滤状态
            filterStatus(value, row) {
                return row.type == value;
            },
            filterPlat(value, row){
                return row.platform == value;
            },
            handleSearch(){
                this.initData();
            },
            handleEmp(){
                this.userInfoForm = {};
                this.$router.push({path: '/userInfo'});
                this.initData();
            },
            handleSizeChange(limit) {
                this.limit = limit
                this.initData()
            },
            handleCurrentChange(page) {
                this.page = page
                this.initData()
            },
        }
    }
</script>

<style scoped>

    /**
    此处为click的点击样式、如果不加此样式 click不显示可点击的手
     */
    .link-type {
        color: #4db3ff;
        cursor: pointer;
    }

    .edit-input {
        padding-right: 100px;
    }

    .cancel-btn {
        position: absolute;
        right: 30px;
        top: 30px;
    }

</style>
