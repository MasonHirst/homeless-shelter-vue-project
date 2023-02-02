<template>
  <q-page id="RegisterPage" class="flex flex-center">
    <register></register>
  </q-page>
</template>

<script>
  import {defineComponent} from 'vue';
  import Register from 'components/profile/Register/Register.vue';

  export default defineComponent({
    name: 'RegisterPage',
    components: {
      Register
    },
  });
</script>

<style scoped lang="scss">
</style>
