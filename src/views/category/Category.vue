<template>
    <div class="category">
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button type="success" plain @click="addCategory">添加分类</el-button>
            </el-col>
        </el-row>
        <tree-grid
        :treeStructure="true"
        :columns="columns"
        :data-source="dataSource"
        @deleteCate="deleteCategory"
        @editCate="editCategory"
        >
        </tree-grid>
        <div class="page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>    
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid'
import { getCategories } from "@/api";
    export default {
        data () {
            return {
                dataSource: [],
                columns: [{
                text: '分类名称',
                dataIndex: 'cat_name',
                width: ''
                }, {
                text: '是否有效',
                dataIndex: 'cat_deleted',
                width: ''
                }, {
                text: '排序',
                dataIndex: 'cat_level',
                width: ''
                }],
                total: 0,
                dataSource: [],
                pagesize:10,
                pagenum:1
            }
        },
        components:{
            TreeGrid
        },
        created () {
            this.initList()
        },
        methods: {
            deleteCategory (cid) {
                console.log(cid)
            },
            editCategory (cid) {
                console.log(cid)
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
                this.pagesize = val
                this.initList()
            },
                handleCurrentChange (val) {
                console.log(`当前页: ${val}`)
                this.pagenum = val
                this.initList()
            },
            initList() {
                getCategories({type: '3', pagenum: this.pagenum, pagesize: this.pagesize}).then(res=>{
                    if (res.meta.status === 200) {
                        this.total = res.data.total
                        this.dataSource = res.data.result
                    }
                })
            },
            addCategory() {

            }
        }
    }
</script>
<style scoped>
    .category  .page {
    padding: 5px 0;
    background-color: #D3DCE6;
  }
</style>

