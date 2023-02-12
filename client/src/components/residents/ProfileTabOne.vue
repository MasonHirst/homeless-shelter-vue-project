<script>
  import { ref, watch } from 'vue';
  export default {
    props: { 
      resident: Object,
      editTab: Boolean,
    },
    setup(props) {
      const residentRef = ref(props.resident);

      watch(() => props.resident, () => {
        residentRef.value = props.resident;
      });

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      

      return {
        residentRef,
        formatDate,
      };
    },
  };
</script>


<template>
  <div class="overflow relative">
    
    <div class="absolute-top-right flex-col">
      <span class="text-h6">Gender: <span class="text-subtitle1 faded">{{ residentRef.gender }}</span></span>
     
      <span class="text-h6">Birthday: <span class="text-subtitle1 faded">{{ formatDate(residentRef.birthday) }}</span></span>
      
    </div>

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
    
    <div v-if="residentRef.notes">
      <div v-if="residentRef.notes[0] !== null">
        <p class="bold text-h6">Notes</p>
        <ul dense bordered padding class="rounded-borders">
          <li v-for="note in residentRef.notes" :key="note" >{{ note }}</li>
        </ul>
      </div>

      <div class="text-h6" v-else>Notes: <span style="opacity: .5;">none</span></div>
    </div>
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.bold {
  font-size: large;
  font-weight: bold;
}

.overflow {
  overflow: auto;
  min-height: 200px;
  max-height: calc(100vh - 400px);
}

.relative {
  position: relative;
}

.absolute-top-right {
  position: absolute;
  top: 0px;
  right: 5px;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.faded {
  opacity: .6;
}
</style>
