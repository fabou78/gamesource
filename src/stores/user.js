import { defineStore } from 'pinia'

// We need to redirect user so importing the instance of the router
import router from '@/router'

/// Firebase
import { AUTH, FireDB } from '@/utils/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'

const DEFAULT_USER = {
  uid: null,
  email: null,
  firstname: null,
  lastname: null,
  isAdmin: null,
}

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    user: DEFAULT_USER,
    isAuthenticated: false,
  }),
  getters: {},
  actions: {
    setUserState(user) {
      console.log(this.user, user)
      this.user = { ...user, ...this.user }
      console.log(this.user)
      this.isAuthenticated = true
    },
    async register(formData) {
      try {
        this.loading = true
        /// Register User
        const response = await createUserWithEmailAndPassword(
          AUTH,
          formData.email,
          formData.password,
        )

        /// Add user to DB
        const newUser = {
          uid: response.user.uid,
          email: response.user.email,
          isAdmin: false,
        }
        await setDoc(doc(FireDB, 'users', response.user.uid), newUser)

        /// Update local state
        this.setUserState(newUser)

        /// Redirect user
        router.push({ name: 'dashboard' })
      } catch (error) {
        throw new Error(error.code)
      } finally {
        this.loading = false
      }
    },
  },
})
