<script>
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: { stay: Object },
    setup(props) {
      const $feathersClient = inject('$feathersClient');
      const router = useRouter();
      const stayRecord = ref(props.stay);
      const resident = ref(null);
      const overdue = ref(false);

      function daysSinceCheckin(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return Math.floor(diffDays) + 1;
      }

      if (daysSinceCheckin(stayRecord.value.checkinDate) > 7) {
        overdue.value = true;
      }

      $feathersClient.service('residents').get(props.stay.residentId)
        .then((res) => {
          resident.value = res;
          // console.log('RETURN: ', res);
        })
        .catch(err => {
          console.error('ERROR IN THE ACTIVE CHECKIN CARD: ', err);
        });

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      function handleClick() {
        router.push({ name: 'residentProfilePage', params: { id: resident.value._id } });
      }


      return {
        resident,
        formatDate,
        stayRecord,
        overdue,
        handleClick,
      };
    },
  };
</script>


<template>
  <q-btn @click="handleClick" flat class="no-caps">
    <div class="spread">
      <span class="text-h5">{{ resident?.name + ' ' }}</span>
      <span v-if="overdue" class="red bold">Overdue</span>
    </div>
  </q-btn>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.border {
  border: 1px solid green;
}

.red {
  color: red;
}

.bold {
  font-weight: bold;
}

.no-caps {
  text-transform: none;
}

.spread {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  margin: 5px;
}
</style>