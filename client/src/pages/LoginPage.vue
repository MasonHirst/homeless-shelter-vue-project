<template>
  <q-page id="LoginPage" class="flex flex-center">
    <login></login>
  </q-page>
</template>

<script>
  import {defineComponent} from 'vue';
  import Login from 'components/profile/Login/Login.vue';

  export default defineComponent({
    name: 'LoginPage',
    components: {
      Login,
    },
  });
</script>

<style scoped lang="scss">
</style>
