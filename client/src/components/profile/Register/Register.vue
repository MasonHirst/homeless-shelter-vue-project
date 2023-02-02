<template>
  <q-card id="Register" class="flex column">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Register
      </q-toolbar-title>
    </q-toolbar>

    <q-card-section style="flex: 1; max-height: 70vh; overflow: auto;">
      <q-form ref="qForm" no-error-focus>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="user.email"
                     rounded
                     standout="bg-secondary text-white"
                     label="Email"
                     :rules="emailRules"/>
          </div>

          <div class="col-12">
            <q-input v-model="user.password"
                     type="password"
                     rounded
                     standout="bg-secondary text-white"
                     label="Password"
                     :rules="passwordRules"/>
          </div>

          <div class="col-12">
            <q-input v-model="confirmPassword"
                     type="password"
                     rounded
                     standout="bg-secondary text-white"
                     label="Confirm Password"
                     :rules="confirmPasswordRules"
                     @keyup.enter="register"/>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-separator/>

    <q-card-actions>
      <q-btn flat dense label="login" :to="{name: 'login'}" />
      <q-space/>

      <q-btn :disable="!valid" color="primary" @click="register">
        Register
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
  import {defineComponent, ref, nextTick, watch, onMounted} from 'vue';
  import {useQuasar} from 'quasar';

  import useUsersStore from 'stores/services/users';

  export default defineComponent({
    name: 'Register',
    setup() {
      const $q = useQuasar();
      const usersStore = useUsersStore();

      const user = ref(new usersStore.Model());
      const confirmPassword = ref(undefined);
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
      const confirmPasswordRules = ref([
        val => {
          return val === user.value.password || 'Must match password';
        },
      ]);

      onMounted(() => {
        watch([user, confirmPassword], () => {
          nextTick(async () => {
            if (qForm.value) {
              valid.value = await qForm.value.validate();
            }
          });
        }, {deep: true});
      });

      function register() {
        user.value.create()
          .then((res) => {
            user.value = new usersStore.Model();

            $q.notify({
              type: 'positive',
              message: `Successfully registered ${res.email}`,
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
        user,
        confirmPassword,
        emailRules,
        passwordRules,
        confirmPasswordRules,
        register,

        qForm,
        valid,
      };
    },
  });
</script>

<style scoped lang="scss" src="./_Register.scss">
</style>
