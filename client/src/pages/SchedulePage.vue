
<script>
  import { defineComponent } from 'vue';
  import Schedule from 'src/components/schedule/Schedule.vue';

  export default defineComponent({
    name: 'SchedulePage',
    components: {Schedule},
    setup() {

      return {};
    },
  });
</script>


<template>
  <q-page class="q-pa-md">
    <Schedule />
  </q-page>
</template>


<style scoped>
  
</style>