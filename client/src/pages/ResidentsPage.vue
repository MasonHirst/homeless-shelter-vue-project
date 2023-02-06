
<script>
  import { defineComponent } from 'vue';
  import ResidentList from 'src/components/residents/ResidentList.vue';
  import AddResident from 'src/components/residents/AddResident.vue';

  export default defineComponent({
    name: 'ResidentsPage',
    components: { ResidentList, AddResident },
    setup() {

      return {

      };
    },
  });
</script>


<template>
  <q-page style="" class="q-pa-md">
    <div class="div-1">

      <ResidentList />
      <AddResident />
    </div>
  </q-page>
</template>


<style scoped>
  .div-1 {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 50px;
  }
</style>