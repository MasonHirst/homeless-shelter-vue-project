<template>
  <q-card id="Login" class="flex column">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Login
      </q-toolbar-title>
    </q-toolbar>

    <q-card-section style="flex: 1; max-height: 70vh; overflow: auto;">
      <q-form ref="qForm" no-error-focus>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="email"
                     rounded
                     standout="bg-secondary text-white"
                     label="Email"
                     :rules="emailRules"/>
          </div>

          <div class="col-12">
            <q-input v-model="password"
                     type="password"
                     rounded
                     standout="bg-secondary text-white"
                     label="Password"
                     @keyup.enter="login"
                     :rules="passwordRules"/>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-separator/>

    <q-card-actions>
      <q-btn flat dense label="register" :to="{name: 'register'}"/>

      <q-space/>

      <q-btn :disable="!valid" color="primary" @click="login">
        login
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
  import {defineComponent, nextTick, onMounted, ref, watch} from 'vue';
  import {useQuasar} from 'quasar';
  import {useRouter} from 'vue-router';

  import useAuthStore from 'stores/store.auth';

  export default defineComponent({
    name: 'Login',
    setup() {
      const $q = useQuasar();
      const authStore = useAuthStore();
      const router = useRouter();

      const email = ref(null);
      const password = ref(null);

      const qForm = ref(null);
      const valid = ref(false);

      const emailRules = ref([
        val => {
          return val && val.length > 0 || 'Email can\'t be empty';
        },
        val => {
          let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
          return reg.test(val) || 'Must be valid email';
        },
      ]);
      const passwordRules = ref([
        val => {
          return val && val.length > 0 || 'Password can\'t be empty';
        },
        val => {
          return val && val.length >= 8 || 'Password must be at least 8 characters';
        },
      ]);

      onMounted(() => {
        watch([email, password], () => {
          nextTick(async () => {
            if (qForm.value) {
              valid.value = await qForm.value.validate();
            }
          });
        }, {deep: true});
      });

      function login() {
        authStore.authenticate({
          strategy: 'local',
          email: email.value,
          password: password.value,
        })
          .then((res) => {
            router.push('/');

            $q.notify({
              type: 'positive',
              message: `Successfully logged in "${res?.user?.email}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          })
          .catch((err) => {
            $q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      }

      return {
        email,
        password,
        login,

        qForm,
        valid,
        emailRules,
        passwordRules,
      };
    },
  });
</script>

<style scoped lang="scss" src="./_Login.scss">
</style>
