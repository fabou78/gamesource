<script setup>
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
</script>

<template>
  <header>
    <div class="container header_container">
      <div class="logo">
        <router-link :to="{ name: 'home' }"> GameSource </router-link>
      </div>

      <div>
        <ul>
          <li v-show="!userStore.isAuthenticated">
            <router-link :to="{ name: 'signin' }"> Sign in </router-link>
          </li>
          <span v-show="userStore.isAuthenticated">
            <li @click="userStore.logOut()">
              <span>Logout</span>
            </li>
            <li><router-link :to="{ name: 'dashboard' }">Dashboard</router-link></li>
          </span>
        </ul>
      </div>
    </div>
  </header>
</template>
