import { ref } from 'vue'

/// AUTH store
import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()

/// FIREBASE
import { AUTH } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export const firstLoad = () => {
  const userStore = useUserStore()
  const loading = ref(true)

  onAuthStateChanged(AUTH, async (user) => {
    if (user) {
      await userStore.autoSignIn(user.id)
    }
    loading.value = false
  })
  return loading
}
