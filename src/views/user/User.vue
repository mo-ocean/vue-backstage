<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" >
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
      <el-input placeholder="请输入内容" v-model="input5"  class="search-input">
      <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>

        <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>

   
    <el-table
      class="margin-20"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showGrantDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </div>
  </div>
</template>
<script>
import {getUserList} from "@/api"
 export default {
     data() {
        return {
          input5: '',
          userList: []
        }
     },
     created() {
         this.initList()
     },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        initList (){
            getUserList({
              params: {
                query: "",
                pagenum: "1",
                pagesize: "5"
              }
            }).then(res => {
                console.log(res)
                this.userList = res.data.users
            })
        }
    }
 }
</script>
<style  scoped>

 .user .margin-20 {
    margin: 20px 0;
  }
 .user .search-input {
    width: 300px;
  }
 .user  .page {
    padding: 5px 0;
    background-color: #D3DCE6;
  }
</style>
