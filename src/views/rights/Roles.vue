<template>
    <div class="roles">
          <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
                 </el-breadcrumb>
            </el-col>
        </el-row>
        <el-table
    :data="roleList"
    border 
    class="mt-20"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
          <div>haha</div>
      </template>
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="roleDesc">
    </el-table-column>
    <el-table-column
      label="操作" >
     
      <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" title="授权角色" ></el-button>
        </template>
    </el-table-column>
  </el-table>
    </div>    
</template>
<script>
import { getRoleList } from "@/api";
   export default {
    data() {
      return {
        roleList: []

      }
    },
    created () {
        this.initList()
    },
    methods: {
        initList() {
             getRoleList().then(res => {
                if (res.meta.status === 200) {
                console.log(res)
                this.roleList = res.data
                }
            })
        }
    }
  }
</script>
<style scoped>
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

