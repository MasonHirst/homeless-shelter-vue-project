
<script>
  import { defineComponent } from 'vue';
  import ResidentList from 'src/components/residents/ResidentList.vue';

  export default defineComponent({
    name: 'ResidentsPage',
    components: { ResidentList },
    setup() {

      return {

      };
    },
  });
</script>


<template>
  <q-page class="q-pa-md">
    <div class="div-1">

      <ResidentList />

      <RouterLink style="text-decoration: none; height: 35px;" to="residents/new">
        <q-btn color="secondary" label="New Resident"></q-btn>
      </RouterLink>
    </div>
  </q-page>
</template>


<style scoped>
.div-1 {
  display: flex;
  gap: 15px;
  justify-content: space-evenly;
  margin-top: 50px;
}

.btn-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>