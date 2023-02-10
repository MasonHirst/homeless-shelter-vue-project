<script>
  import { ref } from 'vue';
  import ResidentProfile from 'src/components/residents/ResidentProfile.vue';
  import { useRoute } from 'vue-router';

  export default {
    components: {ResidentProfile},
    setup() {
      let route = useRoute();
      let userIdRef = ref(route.params.id);
      
      return {
        userIdRef,
      };
    },
    methods: {},
  };

</script>


<template>
  <q-page id="RegisterPage" class="q-page-main q-pa-md">
    <ResidentProfile :userId="userIdRef" />
  </q-page>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.q-page-main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 50px;
  overflow: auto;
}

</style>