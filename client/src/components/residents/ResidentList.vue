<script>
  import { defineComponent, ref, inject, computed } from 'vue';

  export default defineComponent({
    name: 'ResidentList',
    components: {},
    props: {},
    setup() {
      let residents = ref([]);

      let $feathersClient = inject('$feathersClient');

      $feathersClient.service('residents').find({})
        .then((res) => {
          residents.value = res.data;
          console.log('residents:', residents.value);
        })
        .catch((err) => {
          console.log(err);
        });

      const residentList = computed(() => residents.value);

      return {
        residentList,
        residents,
      };
    },
  });
</script>


<template>
  <div>
    <h1>Resident List</h1>
    <h3 v-for="person in residentList" :key="person.id">{{ person.text }}</h3>
  </div>
</template>



<style scoped>
  div {
    border: 2px solid lightgreen;
    padding: 15px;
  }
</style>