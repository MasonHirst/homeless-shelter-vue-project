<script>
  import { inject, ref } from 'vue';
  import BlackListCard from './BlackListCard.vue';

  export default {
    components: { BlackListCard },
    props: {},
    setup() {
      const $feathersClient = inject('$feathersClient');
      const blackList = ref([]);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 35);

      $feathersClient.service('checkins').find({
        query: {
          checkinDate: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
        .then((res) => {
          let uniqueArray = new Set();
          uniqueArray = res.data.filter((item) => {
            if (uniqueArray.has(item.residentId)) {
              return false;
            }
            if (!item.checkoutDate) {
              return false;
            }
            else uniqueArray.add(item.residentId);
            return true;
          });
          blackList.value = uniqueArray;

          const filterCheckins = async (checkins) => {
            // Get a list of residentIds that have a stay record within the last 30 days with a checkoutDate value of null
            const stayQuery = {
              query: {
                $or: [
                  {
                    checkoutDate: null,
                    checkinDate: {
                      $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                    }
                  }
                ]
              }
            };
            const stayResults = await $feathersClient.service('checkins').find(stayQuery);
            const residentIdsToRemove = stayResults.data.map((stay) => stay.residentId);

            // Remove any checkin records that have a residentId that is in the residentIdsToRemove array
            const filteredCheckins = checkins.filter((checkin) => !residentIdsToRemove.includes(checkin.residentId));

            blackList.value = filteredCheckins;
          };
          filterCheckins(blackList.value);
        })
        .catch(err => {
          console.error('ERROR IN THE BLACK LIST: ', err);
        });

      return {
        blackList,
      };
    },
  };
</script>


<template>
  <div>
    <div class="flex-col">
      <span class="text-h4" style="margin-bottom: 0px;">Blacklist: <span class="bold">{{ blackList.length }}</span></span>
      <div class="line" />
      <BlackListCard v-for="record in blackList" :key="record" :record="record" />
    </div>
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bold {
  font-weight: bold;
}

.line {
  border-bottom: 1px dashed black;
  width: 100%;
}
</style>