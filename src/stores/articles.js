import { defineStore } from 'pinia'
import router from '@/router'
import { useUserStore } from '@/stores/user'

/// Firebase
import { FireDB } from '@/utils/firebase'
import {
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'

// import errorCodes from '@/utils/fbcodes'

let articlesColl = collection(FireDB, 'articles')

export const useArticleStore = defineStore('article', {
  state: () => ({
    homeArticles: '',
    adminArticles: '',
    adminLastVisible: '',
  }),
  getters: {},
  actions: {
    async addArticle(formData) {
      try {
        // Get user profile
        const userStore = useUserStore()
        const user = userStore.getUserData

        // Post doc in DB
        const newArticle = doc(articlesColl)
        await setDoc(newArticle, {
          timestamp: serverTimestamp(),
          owner: {
            uid: user.uid,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          ...formData,
        })
        router.push({ name: 'view_articles', query: { reload: true } })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
  },
})
