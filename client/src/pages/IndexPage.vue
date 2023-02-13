<script>
  import { inject, ref } from 'vue';

  export default {
    components: {},
    props: {},
    setup() {
      let $feathersClient = inject('$feathersClient');
      let activeStays = ref([]);

      $feathersClient.service('checkins').find({
        query: {checkoutDate: null}
      })
        .then((res) => {
          console.log('here are the results bro', res.data);
          activeStays.value = res.data;
          console.log(activeStays.value);
        })
        .catch(err => {
          console.error('ERROR IN INDEX PAGE: ', err);
        });
      
      return {
        activeStays,
      };
    },
  };
</script>


<template>
  <q-page class=" flex-row q-pa-md">
    <div>
      <h1>Home</h1>
    </div>

    <div>
      Due for checkout: {{  }}
    </div>
    
  </q-page>
</template>


<style scoped>
  .flex-row {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    padding-top: 50px;
  }

</style>

