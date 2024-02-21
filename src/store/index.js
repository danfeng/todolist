import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有任务列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 下一个 id
    nextId: 5,
    // 视图key
    viewKey: 'all',
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    setInputValue(state, value) {
      state.inputValue = value
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false,
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除任务事项
    removeItem(state, id) {
      const i = state.list.findIndex((x) => x.id === id)
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, param) {
      const i = state.list.findIndex((x) => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    cleanDone(state) {
      state.list = state.list.filter((x) => x.done === false)
    },
    // 切换视图
    changeViewKey(state, key) {
      state.viewKey = key
    },
  },
  actions: {
    getToDoList(context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    },
  },
  getters: {
    unDoneLen(state) {
      return state.list.filter((x) => x.done === false).length
    },
    doneLen(state) {
      return state.list.filter((x) => x.done === true).length
    },
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'unDone') {
        return state.list.filter((x) => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter((x) => x.done)
      }
      return state.list
    },
  },
  modules: {},
})
