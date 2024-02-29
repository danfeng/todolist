<template>
  <div class="index">
    <div class="left">
      <h2>Home 页面</h2>
      <h5 class="mb-2">Custom colors</h5>
      <el-menu
          router
          active-text-color="#ffd04b"
          background-color="#142334"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            <span>账户管理</span>
          </template>
          <el-menu-item index="/index/role">角色管理</el-menu-item>
          <el-menu-item index="/index/user">用户管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><DishDot /></el-icon>
            <span>客房管理</span>
          </template>
          <el-menu-item index="/index/roomtype">房型管理</el-menu-item>
          <el-menu-item index="/index/room">房间管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/index/livein">入住管理</el-menu-item>
          <el-menu-item index="/index/order">客户订单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/index/sysmenu">菜单管理</el-menu-item>
          <el-menu-item index="/index/sysdict">字典订单</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="right">
      <div class="top">
        <el-menu
            router
            :ellipsis="false"
            mode="horizontal"
            background-color="#142334"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item index="/index">
            <el-icon><HomeFilled /></el-icon>
            首页
          </el-menu-item>
          <el-menu-item index="/index/mail">
            <el-icon><ChatDotSquare /></el-icon>
            邮件
          </el-menu-item>
          <el-menu-item index="/index/message">
            <el-icon><Message /></el-icon>
            消息
          </el-menu-item>
          <el-sub-menu index="">
            <template #title>
              <el-icon><Avatar /></el-icon>
              管理员
            </template>
            <el-menu-item index="/index/mine">个人中心</el-menu-item>
            <el-menu-item index="/index/setpwd">修改密码</el-menu-item>
            <el-menu-item index="" @click="exitLogin">退出系统</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import {
  User,
  DishDot,
  Avatar,
  Setting,
  HomeFilled,
  ChatDotSquare,
  Message
} from '@element-plus/icons-vue'
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import useUserStore from '../store/user.ts'
const userStore = useUserStore()

// 退出登录
let exitLogin = () => {
  ElMessageBox.confirm('确定退出系统吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        userStore.clearUserInfo()
        router.push('/')
      })
      .catch(() => {})
}

onMounted(() => {
  if (!userStore.user.id) {
    router.push('/')
  }
})
</script>

<style scopedlang="scss">
.index {
  width: 100vw;
  height: 100vh;
  display: flex;
  .left {
    width: 200px;
    background-color: #142334;
    color: #fff;
    padding-right: 10px;
    .el-menu {
      border-right: none;
    }
    h2 {
      font-size: 18px;
      font-family: my-font;
      text-align: center;
      height: 60px;
      line-height: 60px;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      height: 60px;
      background-color: #142334;
      color: #fff;
      display: flex;
      justify-content: right;
      .el-menu {
        border-bottom: none;
      }
    }
    .content {
      flex: 1;
      padding: 5px;
    }
  }
}
</style>