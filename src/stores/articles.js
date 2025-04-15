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

// Toast
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

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
    async updateArticle(id, formData) {
      try {
        const docRef = doc(FireDB, 'article', id)
        await updateDoc(docRef, { ...formData })
        $toast.success('Updated !!')
      } catch (error) {
        $toast.error(error.message)
        throw new Error(error)
      }
    },
    async getArticleById(id) {
      try {
        const docRef = await getDoc(doc(FireDB, 'articles', id))
        if (!docRef.exists()) {
          throw new Error('Could not find document')
        }
        return docRef.data()
      } catch {
        router.push({ name: '404' })
      }
    },
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
    async adminViewAticles(docLimit) {
      try {
        const myQuery = query(articlesColl, orderBy('timestamp', 'desc'), limit(docLimit))
        const querySnapshot = await getDocs(myQuery)

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        /// Update admin article state
        this.adminArticles = articles
        this.adminLastVisible = lastVisible
      } catch (error) {
        $toast.error(error.message)
        throw new Error(error)
      }
    },
  },
})
