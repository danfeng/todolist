<template>
  <div class="login">
    <div class="box">
      <h2>登录</h2>
      <el-form
          size="small"
          ref="formRef"
          :model="ruleFormModel"
          status-icon
          :rules="rules"
          label-width="40px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleFormModel.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleFormModel.password" type="password" autocomplete="off" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
          <el-button @click="resetForm(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组合式 api
import { reactive, ref, onMounted } from 'vue'

// 导入 element-plus 的类型
import type { FormInstance, FormRules } from 'element-plus'

import {$GetUserInfo, $Login} from "../api/admin.ts";

// 导入路由
import { useRouter } from 'vue-router'
// 返回路由器对象
let router = useRouter()

import useUserStore from '../store/user.ts'
const userStore = useUserStore()

// 定义一个 ref 对象，绑定表单
const formRef = ref<FormInstance>()

// 定义表单数据
const ruleFormModel = reactive({
  username: 'admin',
  password: '123456'
})

// 验证账号
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

// 验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

// 验证规则
const rules = reactive<FormRules<typeof ruleFormModel>>({
  username: [{ validator: validateAccount, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleFormModel)
      let ret = await $Login(ruleFormModel)
      if (ret) {
        let user = await $GetUserInfo()
        userStore.setUser(user)
        // {"code":200,"message":"获取用户信息成功","data":{"id":1,"username":"admin","phone":"66666","name":"管理员","photo":"http://dalong.local:8081/static/image1701632006885.jpg"}}

        router.push('/index')
      } else {
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
}

onMounted(() => {
  if (userStore.user.id) {
    router.push('/index')
  }
})

</script>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  // background-color: #142334;
  background: linear-gradient(to bottom, #142334, #6894c7);
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    width: 400px;
    border: 1px solid #fff;
    padding: 20px;
    h2 {
      color: #fff;
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
      font-family: my-font;
    }
  }
  ::v-deep .el-form-item__label {
    color: #fff !important;
  }
}
</style>
<!-- 中国色： http://zhongguose.com -->