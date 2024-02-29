<template>
  <div class="user">
    <div class="search">
      <el-button type="primary" size="small" @click="editRef.drawer = true">添加</el-button>
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="username" label="账号" width="150" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="userPic" label="头像" width="100">
        <template #default="scope">
          <el-image
              style="width: 60px; height: 60px"
              :src="
              scope.row.userPic.startsWith('http://') || scope.row.userPic.startsWith('https://')
                ? scope.row.userPic
                : (baseURL + scope.row.userPic).replaceAll('//', '/').replaceAll(':/', '://')
            "
              fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="100" />
      <el-table-column prop="role.roleName" label="角色" width="150  " />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="margin-top: 10px"
        small
        background
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="pageIndex" />
    <EditUser ref="editRef" @refresh-data="refreshList"></EditUser>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { ElMessageBox, ElNotification } from 'element-plus'

import EditUser from '../../components/user/EditUser.vue'
import { $GetUserList } from '../../api/admin'
import { baseURL } from '../../config/baseurl.ts'

// 用户列表
let list = ref([])
// 总数量
let total = ref(0)
// 加载用户列表
const loadList = async () => {
  let { data, total, page, pageSize } = await $GetUserList({ roleId: '0' })
  console.log({ data, page, pageSize })
  list.value = data
  total.value = total
}

const refreshList = (newRoleName) => {
  //  TODO：此处可以做假刷新
  console.log('=====', newRoleName)
  loadList()
}
onMounted(() => {
  loadList()
})
const handleEdit = async (index: number, row: User) => {
  console.log(index, row)
  let ret = row //await $GetRole({ roleId: row.roleId })
  console.log(ret)

  editRef.value.formModel = ret
  editRef.value.drawer = true
}

const handleDelete = (index: number, row: User) => {
  ElMessageBox.confirm('确定删除吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async () => {
        let ret = await $DelRole({ roleId: row.roleId })
        if (ret && ret.code === 200) {
          ElNotification({ title: '提示', message: ret.msg, type: 'success' })
          loadRoleList()
        } else {
          ElNotification({ title: '提示', message: ret.msg, type: 'error' })
        }
      })
      .catch(() => {})
}

// 定义子组件 ref 对象
let editRef = ref(null)

</script>

<style scoped lang="scss">
.user {
  .search {
    margin-bottom: 5px;
  }
}
</style>