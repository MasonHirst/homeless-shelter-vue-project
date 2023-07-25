<script>
  import { inject, ref } from 'vue';
  import ActiveCheckinCard from 'src/components/home/ActiveCheckinCard.vue';
  import BlackList from 'src/components/home/BlackList.vue';

  export default {
    components: {
      ActiveCheckinCard,
      BlackList,
    },
    props: {},
    setup() {
      const $feathersClient = inject('$feathersClient');
      const activeStays = ref([]);
      const dueCheckouts = ref([]);

      $feathersClient.service('checkins').find({
        query: {checkoutDate: null}
      })
        .then((res) => {
          activeStays.value = res.data;
          for (let i = 0; i < activeStays.value.length; i++) {
            if (daysSinceCheckin(activeStays.value[i].checkinDate) > 7) {
              dueCheckouts.value.push(activeStays.value[i]);
            }
          }
        })
        .catch(err => {
          console.error('ERROR IN INDEX PAGE: ', err);
        });

      function daysSinceCheckin(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return Math.floor(diffDays) + 1;
      }
      
      return {
        activeStays,
        dueCheckouts,
      };
    },
  };
</script>


<template>
  <q-page class=" flex-row q-pa-md">
    <div>
      <span class="text-h4" style="margin-bottom: 15px;">Staying Residents: <span class="bold">{{ activeStays.length }}</span></span>
      <div class="line" />
      <div v-if="activeStays" class="flex-col">
        <ActiveCheckinCard v-for="stay in activeStays" :key="stay" :stay="stay" />
      </div>
    </div>

  
    <BlackList />
    
    
  </q-page>
</template>


<style scoped>
  .flex-row {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    padding-top: 50px;
  }

.red-text {
  color: red;
}

.bold {
  font-weight: bold;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.line {
  border-bottom: 1px dashed black;
  width: 100%;
}
</style>

