<template>
  <el-drawer
      v-model="drawer"
      :title="formModel.roleId ? '编辑角色' : '添加角色'"
      direction="rtl"
      size="30%"
      :before-close="handleClose">
    <el-form
        size="small"
        ref="formRef"
        :model="formModel"
        status-icon
        :rules="rules"
        label-width="70px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formModel.roleName" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="formModel.roleDesc" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">
          {{ formModel.roleId ? '编辑' : '添加' }}
        </el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 导入 element-plus 的类型
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox, ElNotification } from 'element-plus'

import { $AddRole, $UpdateRole } from '../../api/role'

const drawer = ref(false)
const handleClose = () => {
  // 关闭抽屉
  drawer.value = false
  // 重置表单
  formRef.value?.resetFields()
  // 清空表单数据
  formModel.value = { roleId: '', roleName: '', roleDesc: '' }
}
// const handleClose1 = (done: () => void) => {
//   ElMessageBox.confirm('Are you sure you want to close this?')
//     .then(() => {
//       formRef.value?.resetFields()
//       done()
//     })
//     .catch(() => {
//       // catch error
//     })
// }
// 定义一个 ref 对象，绑定表单
const formRef = ref<FormInstance>()
// 定义表单数据
const formModel = ref({
  roleId: '',
  roleName: '',
  roleDesc: ''
})

// 验证角色名称
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入角色名称'))
  } else {
    callback()
  }
}

// 验证规则
const rules = reactive<FormRules<typeof formModel>>({
  roleName: [{ validator: validateRoleName, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是修改还是添加操作
      if (formModel.value.roleId) {
        console.log(formModel.value)

        ret = await $UpdateRole(formModel.value)
      } else {
        ret = await $AddRole(formModel.value)
      }
      if (ret && ret.code === 200) {
        ElNotification({ title: '提示', message: ret.msg, type: 'success' })
        emit('refresh-data', formModel.value.roleName)
        // 关闭抽屉
        drawer.value = false
        formRef.value?.resetFields()
      } else {
        ElNotification({ title: '提示', message: ret.msg, type: 'error' })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  // 清空表单数据
  formModel.value = { roleId: '', roleName: '', roleDesc: '' }
}

// 暴露属性
defineExpose({
  drawer,
  formModel
})

const emit = defineEmits(['refresh-data'])
</script>

<style scoped lang="scss">

</style>