<script setup>
  import { Field, Form } from 'vee-validate'
  import * as yup from 'yup'
  import { ref } from 'vue'

  /// Toast
  import { useToast } from 'vue-toast-notification'
  const $toast = useToast()

  /// AUTH store
  import { useUserStore } from '@/stores/user'
  const userStore = useUserStore()

  const isResgister = ref(false)
  const formSchema = yup.object({
    email: yup.string().required('The email is required').email('Not a valid email'),
    password: yup.string().required('The password is required'),
  })

  function onSubmit(values, { resetForm }) {
    if (isResgister.value) {
      // Register the user
      userStore.register(values)
    } else {
      //sign in
      userStore.signIn(values)
    }
  }

  /// Subscribe to an error
  userStore.$onAction(({ name, after, onError }) => {
    if (name === 'register' || name === 'signIn') {
      after(() => {
        $toast.success('Welcome back!')
      })
      onError((error) => {
        $toast.error(error.message)
      })
    }
  })
</script>

<template>
  <div class="signin_container">
    <!-- loader -->
    <div class="text-center" v-show="userStore.loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <Form @submit="onSubmit" :validation-schema="formSchema" v-show="!userStore.loading">
      <h1 v-text="!isResgister ? 'Sign in' : 'Register'"></h1>
      <div class="form-group">
        <Field name="email" :value="'fabrice@gmail.com'" v-slot="{ field, errors, errorMessage }">
          <input
            type="text"
            class="form-control"
            placeholder="Enter your email"
            v-bind="field"
            :class="{ 'is-invalid': errors.length !== 0 }"
          />
          <div class="input_alert" v-if="errors.length !== 0">{{ errorMessage }}</div>
        </Field>
      </div>
      <div class="form-group">
        <Field name="password" :value="'testing123'" v-slot="{ field, errors, errorMessage }">
          <input
            type="password"
            class="form-control"
            placeholder="Enter your password"
            v-bind="field"
            :class="{ 'is-invalid': errors.length !== 0 }"
          />
          <div class="input_alert" v-if="errors.length !== 0">{{ errorMessage }}</div>
        </Field>
      </div>
      <button
        type="submit"
        class="btn mb-3 btn-block"
        v-text="!isResgister ? 'Sign in' : 'Register'"
      ></button>
      <hr />
      <div class="form_swap" @click="isResgister = !isResgister">
        <span v-if="isResgister">I want to Sign in</span>
        <span v-else>I want to register</span>
      </div>
    </Form>
  </div>
</template>
