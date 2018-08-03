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
        <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id">
            <el-col :span="4">
                <el-tag closable @close="deleteRight(scope.row,firstChildren.id)">{{firstChildren.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row  v-for="secondChildren in firstChildren.children" :key="secondChildren.id">
                    <el-col :span="4">
                         <el-tag closable type="success"  @close="deleteRight(scope.row,secondChildren.id)">{{secondChildren.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row >
                            <el-tag closable 
                            v-for="thirdChildren in secondChildren.children" 
                            :key="thirdChildren.id"
                            type="warning"  @close="deleteRight(scope.row,thirdChildren.id)">
                                {{thirdChildren.authName}}
                            </el-tag>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
            <el-row v-if="scope.row.children.length === 0">
                <el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
            </el-row>
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
          <el-button size="mini" type="warning" plain icon="el-icon-check" title="授权角色" @click="showDialog(scope.row)"></el-button>
        </template>
    </el-table-column>
    
  </el-table>
        <el-dialog title="授权角色" :visible.sync="dialogFormVisible">
            <div class="tree-container">
                <el-tree
                :data="rightList"
                show-checkbox
                ref="tree"
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="selectedRights"
                :props="defaultProps">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
            </div>
        </el-dialog>
    </div>    
</template>
<script>
import { getRoleList,deleteRoleRight,getRightList,grantRoleRight } from "@/api";
   export default {
    data() {
      return {
        roleList: [],
        rightList:[],
        dialogFormVisible:false,
        defaultProps: {
            children: 'children',
            label: 'authName'
        },
        selectedRights: [],//保存默认选中的权限id
        currentRole:{}//保存当前被点击的角色
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
        },
        deleteRight(row,rightId) {
            deleteRoleRight({roleId:row.id,rightId:rightId}).then(res => {
                if (res.meta,status === 200) {
                    console.log(res.data);
                    
                    row.children = res.data
                }else {
                     this.$message({
                        type: 'error',
                        message: res.meta.msg
                    })
                }
            })
        },
        showDialog(row) {
            this.dialogFormVisible = true
            this.currentRole = row
            getRightList({type:'tree'}).then(res => {
                if (res.meta.status === 200) {
                console.log(res.data)
                this.rightList = res.data
                } else {
                this.$message({
                    type: 'error',
                    message: res.meta.msg
                })
            }
            })
            // 默认选中
            //遍历之前先让数组清空
            this.selectedRights.length = 0
            //将当前被点击角色的所有权限id取出来，放到selectedRights中
            this.currentRole.children.forEach(first => {
                if (first.children && first.children.length !== 0) {
                    first.children.forEach(second => {
                        if (second.children && second.children.length !== 0) {
                            second.children.forEach(third => {
                                this.selectedRights.push(third.id)
                            })
                        }
                    }) 
                }
            })

        },
        //提交授权
        getCheckedNodes() {
            let nodeArr = this.$refs.tree.getCheckedNodes()
            console.log(nodeArr);
            let rids=[]
            nodeArr.forEach(item => {
                rids.push(item.id + ',' + item.pid)
            })
             console.log(rids);
            console.log(rids.join(','))
            let newArr = rids.join(',').split(',')

            //es6数组去重 new Set(new Arr)
            let idArr = [...new Set(newArr)]
            console.log(idArr);
            grantRoleRight(this.currentRole.id,{rids:idArr.join(',')}).then(res => {

                if (res.meta.status === 200) {
                    this.$message({
                        type:"success",
                        message:res.meta.msg
                    })
                    this.dialogFormVisible = false
                    this.initList()
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
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
   .tree-container {
    height: 300px;
    overflow: auto;
  }
</style>

