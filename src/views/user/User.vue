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
      <el-input placeholder="请输入内容" v-model="query"  class="search-input" @keydown.native.enter="initList">
      <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
  </el-input>

        <el-button type="success" plain @click="dialogFormVisible=true">添加用户</el-button>
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
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="addForm"  label-width="80px" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
         <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editForm"  label-width="80px" :rules="rules" ref="editUserForm">
        <el-form-item label="用户名" prop="username" :disabled="true">
          <el-input v-model="editForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="grantdialogFormVisible">
      <el-form :model="grantForm"  label-width="120px" >
        <el-form-item label="当前用户" prop="username" >
          <el-tag>{{grantForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="选择角色：">
          <el-select v-model="roleId" placeholder="选择角色">
            <el-option 
            v-for="(role,index) in roleList"
            :key="index"
            :label="role.roleName" 
            :value="role.id">
             
            </el-option>
            
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getUserList,changeUserState,addUser,queryUserId,editUser,delUser,getRoleList,grantUserRole} from "@/api"
 export default {
     data() {
        return {
          userList: [],
          query:'',
          total:0,
          pagesize:10,
          pagenum:1,
          dialogFormVisible:false,
          addForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
          },
          editForm: {
            username: '',
            email: '',
            mobile: '',
            id:0
          },
          editdialogFormVisible:false,
          grantdialogFormVisible:false,
          grantForm:{
            username:"",
          },
          roleList:'',
          roleId:'',
           // 添加用户的表单验证
          rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
            ],  
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            mobile: [
                { required: true, message: '电话不能为空' }
            ]
          }
         
        }
     },
     created() {
         this.initList()
     },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.initList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.initList()

        },
        initList (){
            getUserList({
              params: {
                query:this.query,
                pagenum: this.pagenum,
                pagesize: this.pagesize
              }
            }).then(res => {
                console.log(res)
                this.userList = res.data.users
                this.total = res.data.total
            })
        },
        // 改变用户状态
        changeUserState(row) {
          // console.log(row)
          changeUserState({
            uid:row.id,
            type:row.mg_state
          }).then(res =>{
            if (res.meta.status === 200) {
              this.$message({
                message: '成功了哦',
                center: true,
                type: 'success'
              })
            }else {
              this.$message({
                message: res.meta.msg,
                center: true,
                type: 'warning'
              })
            }
          })
        },
        // 添加用户
        addUserSubmit() {
          // console.log(this.$refs);
          
          this.$refs.addUserForm.validate(valide =>{
            if (valide) {
              addUser(this.addForm).then(res =>{
                // console.log(res);
                if (res.data.status === 201) {
                    this.$message({
                      message: '用户添加成功了哦',
                      center: true,
                      type: 'success'
                  })
                }
                this.dialogFormVisible = false
                this.initList()                
              })
            }
          })
        },
        //编辑用户
        // 显示编辑用户对话框
        showEditDialog(row) {
          this.editdialogFormVisible = true
          queryUserId(row.id).then(res=>{
            if (res.meta.status === 200) {
              this.editForm.username = res.data.username
              this.editForm.email = res.data.email
              this.editForm.mobile = res.data.mobile
              this.editForm.id = res.data.id
            }
          })
        },
        editUserSubmit() {
          console.log( this.editForm);
          
          this.$refs.editUserForm.validate(vilide => {
            if (vilide) {
              editUser(this.editForm).then(res=>{
                if (res.meta.status === 200) {
                 
                    this.$message({
                      message: '用户编辑成功了哦',
                      center: true,
                      type: 'success'
                    })
                  
                  this.editdialogFormVisible = false
                  
                  this.initList()
                }
              })
            }
          })
        },
         // 显示删除对话框
        showDeleteDialog (row) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 执行删除用户操作
            delUser(row.id).then(res => {
              if (res.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.initList()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        // 选择角色
        showGrantDialog(row) {
          this.grantForm = row
          this.grantdialogFormVisible = true
          getRoleList().then(res=>{
            console.log(res);
            
            if (res.meta.status === 200) {
              this.roleList = res.data
            }
          })
        },
        //分配角色
        grantUserSubmit() {
          if (!this.roleId) {
            this.$message({
              type:'warning',
              message:'角色不能为空'
            })
          }else {
            grantUserRole({id:this.grantForm.id, rid:this.roleId}).then(res=>{
              if (res.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '设置角色成功'
                })
                 this.grantdialogFormVisible = false
              }else {
                 this.$message({
                  type: 'error',
                  message: res.meta.msg
                })
              }
            }) 
          }
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
