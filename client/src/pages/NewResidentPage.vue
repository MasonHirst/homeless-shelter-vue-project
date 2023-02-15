<script>
  import { defineComponent } from 'vue';
  import AddResident from 'src/components/residents/AddResident.vue';

  export default defineComponent({
    name: 'NewResidentPage',
    components: {AddResident},
    setup() {

      return {};
    },
  });
</script>


<template>
  <q-page class="page q-pa-md">
    <AddResident />
  </q-page>
</template>


<style scoped>
.page {
  display: flex;
  justify-content: center;
  padding-top: 25px;
}
  
</style>