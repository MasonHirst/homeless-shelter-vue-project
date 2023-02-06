
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


  <template>
    <q-page id="LoginPage" class="flex flex-center">
      <login></login>
    </q-page>
  </template>


<style scoped lang="scss">
</style>
