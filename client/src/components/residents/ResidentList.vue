<script>
  import { defineComponent, ref, inject, computed } from 'vue';

  export default defineComponent({
    name: 'ResidentList',
    components: {},
    props: {},
    setup() {
      let $feathersClient = inject('$feathersClient');
      let residents = ref([]);

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      $feathersClient.service('residents').find({})
        .then((res) => {
          residents.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      const residentList = computed(() => residents.value);

      return {
        residentList,
        residents,
        formatDate,
      };
    },
  });
</script>


<template>
  <div>
    <h1>Resident List</h1>
    <h3 v-for="person in residentList" :key="person.id">{{ person.name + ', ' + formatDate(person.birthday) }}</h3>
  </div>
</template>



<style scoped>
  div {
    border: 2px solid lightgreen;
    padding: 15px;
  }
</style>