<template>
  <div class="user">
    <div class="search">
      <el-button type="primary" size="small" @click="editRef.drawer = true"
        >添加</el-button
      >
    </div>
    <el-table
      ref="tableRef"
      :data="list"
      style="width: 100%"
      @filter-change="filterChanged"
    >
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="username" label="账号" width="150" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="userPic" label="头像" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="
              scope.row.userPic &&
              (scope.row.userPic.startsWith('http://') ||
                scope.row.userPic.startsWith('https://'))
                ? scope.row.userPic
                : (baseURL + scope.row.userPic)
                    .replaceAll('//', '/')
                    .replaceAll(':/', '://')
            "
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="100" />
      <el-table-column
        prop="role.roleName"
        label="角色"
        width="150"
        column-key="role"
        :filters="roleList"
        :filter-method="filterHandler"
        :filter-multiple="false"
      />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px"
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      :default-page-size="pageSize"
      small="small"
      background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <EditUser ref="editRef" @refresh-data="refreshList"></EditUser>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { TableColumnCtx, TableInstance } from 'element-plus';

import { ElMessageBox, ElNotification } from 'element-plus';
import { Picture as IconPicture } from '@element-plus/icons-vue';

import EditUser from '../../components/user/EditUser.vue';
import { $GetUserList } from '../../api/admin';
import { baseURL } from '../../config/baseurl.ts';
import { $GetRoleList } from '../../api/role.ts';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  phone: string;
  userPic: string;
  roleId: number;
  role: Role;
}

interface Role {
  roleId: number;
  roleName: string;
}

// 用户列表
let list = ref([]);
// 后端分页：总数量
let totalCount = ref(0);
// 后端分页：页码
let pageNum = ref(1);
// 后端分页：页大小
let pageSize = ref(10);

const handleSizeChange = (val: number) => {
  pageNum.value = 1;
  pageSize.value = val;
  loadList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  loadList();
};
// 列表筛选：属性
let roleId = ref('0');

// 角色列表
let roleList = ref([]); // 角色列表
const loadRoleList = async () => {
  const array = await $GetRoleList();
  roleList.value = array.map((x) => ({ text: x.roleName, value: x.roleId }));
};

const filterHandler = (
  value: string,
  row: User,
  column: TableColumnCtx<User>,
) => {
  // console.log('property ====== ')
  // console.log(row.role.roleId)
  // console.log(value)
  return row.role.roleId === Number(value);
};

const filterChanged = (filters) => {
  const condition = Object.values(filters.role).join(',');
  roleId.value = condition || '0';
  loadList();
};

// 加载用户列表
const loadList = async () => {
  let { data, total } = await $GetUserList({
    roleId: roleId.value,
    page: pageNum.value,
    pageSize: pageSize.value,
  });
  list.value = data;
  totalCount.value = total;
};

const refreshList = (newRoleName) => {
  //  TODO：此处可以做假刷新
  console.log('=====', newRoleName);
  loadList();
};
onMounted(() => {
  loadRoleList();
  loadList();
});
const handleEdit = async (index: number, row: object) => {
  console.log(index, row);
  let ret = row; //await $GetRole({ roleId: row.roleId })
  console.log(ret);

  editRef.value.formModel = ret;
  editRef.value.drawer = true;
};

const handleDelete = (index: number, row: object) => {
  ElMessageBox.confirm('确定删除吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ret = await $DelRole({ roleId: row.roleId });
      if (ret && ret.code === 200) {
        ElNotification({ title: '提示', message: ret.msg, type: 'success' });
        loadRoleList();
      } else {
        ElNotification({ title: '提示', message: ret.msg, type: 'error' });
      }
    })
    .catch(() => {});
};

// 定义子组件 ref 对象
let editRef = ref(null);
</script>

<style scoped lang="scss">
.user {
  .search {
    margin-bottom: 5px;
  }
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}
</style>
