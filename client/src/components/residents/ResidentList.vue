<script>
  import { defineComponent, ref, inject, watch } from 'vue';
  import ResidentListCard from './ResidentListCard.vue';

  export default defineComponent({
    name: 'ResidentList',
    components: {ResidentListCard},
    props: {},
    setup() {
      let $feathersClient = inject('$feathersClient');
      let residents = ref([]);
      let filteredResidents = ref([]);
      let searchStr = ref('');

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      watch(() => searchStr.value, () => {
        filteredResidents.value = residents.value.filter(resident => {
          return resident.name.toLowerCase().includes(searchStr.value.toLowerCase());
        });
      });

      $feathersClient.service('residents').find({})
        .then((res) => {
          residents.value = res.data;
          filteredResidents.value = res.data;
        })
        .catch((err) => {
          console.error(err);
        });

      return {
        residents,
        filteredResidents,
        formatDate,
        searchStr,
      };
    },
  });
</script>


<template>
  <div class="" v-if="residents">
    <q-input autofocus standout="bg-secondary text-white" style="margin-bottom: 15px; min-width: 400px;" v-model="searchStr" label="search">
      <template v-slot:prepend>
        <q-icon name="person" />
      </template>
    </q-input>
    <div class="flex-col" v-if="filteredResidents.length > 0">
      <ResidentListCard v-for="resident in filteredResidents" :key="resident" :resident="resident" />
    </div>
    <span class="text-h6 faded" style="margin-left: 25px;" v-else>No results</span>
  </div>
  <div v-else>
    <span class="text-h6 faded">No resident records yet!</span>
  </div>
</template>



<style scoped>
  .flex-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .faded {
    opacity: .6;
  }
</style>