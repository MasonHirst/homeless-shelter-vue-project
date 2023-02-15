<script>
  import { ref, inject, } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: { record: Object },
    setup(props) {
      const resident = ref({});
      const residentStay = ref([]);
      const $feathersClient = inject('$feathersClient');
      const router = useRouter();


      $feathersClient.service('residents').get(props.record.residentId)
        .then(async (res) => {
          resident.value = res;
          let stayRecord = await $feathersClient.service('checkins').find({
            query: {residentId: resident.value._id}
          });
          residentStay.value = stayRecord.data;
        })
        .catch(err => {
          console.error('ERROR IN THE BLACK LIST CARD: ', err);
        });

      function handleClick() {
        router.push({ name: 'residentProfilePage', params: { id: resident.value._id } });
      }

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      return {
        resident,
        residentStay,
        handleClick,
        formatDate,
      };
    },
  };
</script>


<template>
  <div class="">
    <q-btn @click="handleClick" flat class="no-caps">
      <div class="flex-col">
        <span class="text-h5">{{ resident.name + ' ' }}</span>
        <div class="flex-row">
          <span class="subtitle faded">last checkout: </span>
          <span class="subtitle faded">{{ formatDate(residentStay[0]?.checkoutDate) }}</span>
        </div>
      </div>
    </q-btn>
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.border {
  border: 1px solid green;
}

.no-caps {
  text-transform: none;
}

.faded {
  opacity: .6;
}

.flex-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-left: 10px;
  position: relative;
  bottom: 5px;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
}
</style>