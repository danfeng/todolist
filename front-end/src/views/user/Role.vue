<template>
  <div class="role">
    <div class="search">
      <el-button type="primary" size="small" @click="editRef.drawer = true">添加</el-button>
    </div>
    <el-table :data="showRoles" style="width: 100%">
      <el-table-column prop="roleId" label="编号" width="100" />
      <el-table-column prop="roleName" label="名称" width="250" />
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
        :total="roles.length"
        v-model:current-page="pageIndex" />
    <EditRole ref="editRef" @refresh-data="refreshList"></EditRole>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EditRole from '../../components/user/EditRole.vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { $GetRoleList, $DelRole, $GetRole } from '../../api/role'

let roles = ref([]) // 角色列表
const loadRoleList = async () => {
  roles.value = await $GetRoleList()
}

// 前端分页
let pageIndex = ref(1)
let showRoles = computed(() => {
  return roles.value.slice((pageIndex.value - 1) * 10, pageIndex.value * 10)
})

const refreshList = (newRoleName) => {
  //  TODO：此处可以做假刷新
  console.log('=====', newRoleName)
  loadRoleList()
}

const handleEdit = async (index: number, row: User) => {
  console.log(index, row)
  let ret = await $GetRole({ roleId: row.roleId })
  console.log(ret)

  editRef.value.formModel = ret
  editRef.value.drawer = true
}

const handleDelete = (index: number, row: User) => {
  console.log(index, row)
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

onMounted(() => {
  loadRoleList()
})

</script>

<style scoped lang="scss">
.role {
  .search {
    margin-bottom: 5px;
  }
}
</style>