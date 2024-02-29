<template>
  <el-drawer
      v-model="drawer"
      :title="formModel.id ? '编辑用户' : '添加用户'"
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
      <el-form-item label="账号" prop="username">
        <el-input v-model="formModel.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password" type="password">
        <el-input v-model="formModel.password" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formModel.phone" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
            v-model="formModel.roleId"
            placeholder="请选择角色"
            size="small"
            style="width: 240px">
          <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="userPic">
        <el-upload
            class="avatar-uploader"
            :action="baseURL + 'my/upload'"
            name="image"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="formModel.userPic" :src="imageFullUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">
          {{ formModel.id ? '编辑' : '添加' }}
        </el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

// 导入 element-plus 的类型
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { ElMessage, ElNotification } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { baseURL } from '../../config/baseurl.ts'
import { $AddUser, $UpdateUser } from '../../api/admin'
import { $GetRoleList } from '../../api/role'

const drawer = ref(false)
const handleClose = () => {
  // 关闭抽屉
  drawer.value = false
  // 重置表单
  formRef.value?.resetFields()
  // 清空表单数据
  formModel.value = { username: '', password: '', name: '', roleId: '', phone: '', userPic: '' }
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
// 定义表单数据：username，password,name,roleId,Phone,userPic
const formModel = ref({
  username: '',
  password: '',
  name: '',
  roleId: '',
  phone: '',
  userPic: ''
})

// 验证账户
const validateUserName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账户名称'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!/^\d{6}$/.test(value)) {
    callback(new Error('必须是 6 位数字'))
  } else {
    callback()
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入姓名'))
  } else {
    callback()
  }
}
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入电话'))
  } else {
    callback()
  }
}
const validateRole = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

// 验证规则
const rules = reactive<FormRules<typeof formModel>>({
  username: [{ validator: validateUserName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  roleId: [{ validator: validateRole, trigger: 'change' }]
})

let headers = ref({ Authorization: '' })
const imageFullUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // {"code":200,"msg":"上传成功","imageUrl":"/static/image1708936065994.png"}
  // http://127.0.0.1:8081/static/image1708936491551.png
  let { code, msg, imageUrl } = response
  if (code === 200) {
    ElNotification({ title: '提示', message: msg, type: 'success' })
    formModel.value.userPic = imageUrl
    imageFullUrl.value = (baseURL + imageUrl).replaceAll('//', '/').replaceAll(':/', '://')
  } else {
  }
  // formModel.value.userPic = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  let imageTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!imageTypes.includes(rawFile.type)) {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  headers.value = {
    Authorization: sessionStorage.getItem('x-token')
  }
  return true
}
// 角色列表
let roleList = ref([]) // 角色列表
const loadRoleList = async () => {
  roleList.value = await $GetRoleList()
}
onMounted(() => {
  loadRoleList()
})
// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是修改还是添加操作
      if (formModel.value.id) {
        console.log(formModel.value)

        ret = await $UpdateRole(formModel.value)
      } else {
        ret = await $AddUser(formModel.value)
      }
      if (ret && ret.code === 200) {
        ElNotification({ title: '提示', message: ret.msg, type: 'success' })
        emit('refresh-data', formModel.value)
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
  formModel.value = { username: '', password: '', name: '', roleId: '', phone: '', userPic: '' }
}
// 暴露属性
defineExpose({
  drawer,
  formModel
})
const emit = defineEmits(['refresh-data'])
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>