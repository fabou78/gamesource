import { defineStore } from 'pinia'

// We need to redirect user so importing the instance of the router
import router from '@/router'

/// Firebase
import { AUTH, FireDB } from '@/utils/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import errorCodes from '@/utils/fbcodes'

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
  getters: {
    getUserData(state) {
      return state.user
    },
  },
  actions: {
    setUserState(user) {
      this.user = { ...this.user, ...user }
      this.isAuthenticated = true
    },
    async logOut() {
      await signOut(AUTH)
      this.user = DEFAULT_USER
      this.isAuthenticated = false
      router.push({ name: 'home' })
    },
    async autoSignIn(uid) {
      try {
        const userData = await this.getUserProfile(uid)
        /// Update local state
        this.setUserState(userData)
        return true
      } catch {
        // console.log(error)
      }
    },
    async getUserProfile(uid) {
      try {
        const userProfile = await getDoc(doc(FireDB, 'users', uid))
        if (!userProfile.exists()) {
          throw new Error('User not found !!')
        }
        return userProfile.data()
      } catch (error) {
        throw new Error(errorCodes(error.code))
      }
    },
    async signIn(formData) {
      try {
        this.loading = true

        /// Sign in user
        const response = await signInWithEmailAndPassword(AUTH, formData.email, formData.password)

        // Get user data from DB
        const userData = await this.getUserProfile(response.user.uid)

        /// Update local state
        this.setUserState(userData)

        /// Redirect user
        router.push({ name: 'dashboard' })
      } catch (error) {
        throw new Error(errorCodes(error.code))
      } finally {
        this.loading = false
      }
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
        throw new Error(errorCodes(error.code))
      } finally {
        this.loading = false
      }
    },
  },
})
