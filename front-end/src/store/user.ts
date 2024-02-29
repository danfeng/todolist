import { defineStore } from 'pinia'

export default defineStore('user', {
    state() {
        return {
            user: {
                id: ''
            }
        }
    },
    actions: {
        setUser(user: object) {
            this.user = user
        },
        clearUserInfo() {
            this.user = {
                id: ''
            }
        }
    },
    persist: true
})