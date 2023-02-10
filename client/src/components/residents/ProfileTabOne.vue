<script>
  import { watch, ref } from 'vue';
  export default {
    props: { resident: Object },
    setup(props) {
      const residentRef = ref(props.resident);

      watch(() => props.resident, () => {
        residentRef.value = props.resident;
      });
      

      return {
        residentRef
      };
    },
  };
</script>


<template>
  <div v-if="residentRef.illnesses !== null" >
    <p class="bold text-h6">Illnesses</p>
    <ul dense bordered padding class="rounded-borders">
      <li v-for="illness in residentRef.illnesses" :key="illness" >{{ illness }}</li>
    </ul>
  </div>
  <div class="text-h6" v-else >Illnesses: <span style="opacity: .5;">none</span></div>

  <div v-if="residentRef.medications !== null">
    <p class="bold text-h6">Medications</p>
    <ul dense bordered padding class="rounded-borders">
      <li v-for="medication in residentRef.medications" :key="medication" >{{ medication }}</li>
    </ul>
  </div>
  <div class="text-h6" v-else>Medications: <span style="opacity: .5;">none</span></div>

  <div v-if="residentRef.notes !== null">
    <p class="bold text-h6">Notes</p>
    <ul dense bordered padding class="rounded-borders">
      <li v-for="note in residentRef.notes" :key="note" >{{ note }}</li>
    </ul>
  </div>
  <div class="text-h6" v-else>Medications: <span style="opacity: .5;">none</span></div>
  
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.bold {
  font-size: large;
  font-weight: bold;
}
</style>