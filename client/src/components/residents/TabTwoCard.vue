<script>
  import { ref } from 'vue';
  export default {
    props: {

    },
    setup() {
      

      return {}
    },
    methods: {},
  }

</script>


<template>
  <div v-if="stays" style="padding: 15px;">
    <div v-for="stay in stays" :key="stay">
      <div class="text-h6 gap" v-if="stay.checkoutDate">
        <span>{{ formatDate(stay.checkinDate) }}</span> 
        <span>-</span>
        <span>{{ formatDate(stay.checkoutDate) }}</span>
        <q-btn @click="editHandler" flat rounded color="primary" label="edit" v-if="editTab" />
      </div>

      <div class="text-h6 gap" v-else>
        <span>{{ formatDate(stay.checkinDate) }}</span>
        <span>-</span>
        <span style="color: red; font-weight: bold;">current</span>
        <q-btn flat rounded color="primary" label="edit" v-if="editTab" />
      </div>
    </div>
  </div>

  <div v-else>
    <span class="text-h6 faded">This resident has no stay history</span>
    <div class="spacer-div"></div>
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>

</style>