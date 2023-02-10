<script>
  import { ref, inject, watch } from 'vue';
  import ProfileTabOne from './ProfileTabOne.vue';
  import ProfileTabTwo from './ProfileTabTwo.vue';

  export default {
    components: {
      ProfileTabOne,
      ProfileTabTwo
    },
    props: {userId: String},
    setup(props) {
      let $feathersClient = inject('$feathersClient');
      const resident = ref({});
      const age = ref(null);
      const isStaying = ref('');
      const isLoading = ref(false);
      const checkins = ref({});
      const tab = ref('one');

      $feathersClient.service('residents').get(props.userId, {})
        .then(res => {
          resident.value = res;
        })
        .catch(err => {
          console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
        });

      watch(() => resident.value, () => {
        let ageInMilliseconds = new Date() - new Date(resident.value.birthday);
        let ageDate = new Date(ageInMilliseconds);
        age.value = Math.abs(ageDate.getUTCFullYear() - 1970);

        isStaying.value = resident.value.isStaying;
      });


      $feathersClient.service('checkins').find({
        query: {
          residentId: props.userId._id,
          $sort: { createdAt: -1 }
        }
      })
        .then(res => {
          checkins.value = res.data;
          console.log('checkins value: ', checkins.value);
          if (!checkins.value[0].checkoutDate && resident.value.isStaying === false) {
            $feathersClient.service('residents').patch(resident.value._id, { isStaying: true })
              .then(res => {
                console.log('response after patching residents: ', res);
              })
              .catch(err => {
                console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
              });
          } else {
            // console.log(checkins.value[0].checkoutDate);
          }
        })
        .catch(err => {
          console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
        });


      function handleCheckin() {
        isLoading.value = true;
        $feathersClient.service('residents').patch(resident.value._id, { isStaying: true })
          .then(res => {
            isLoading.value = false;
            // console.log('response: ', res);
            resident.value = res;

            $feathersClient.service('checkins').create({
              residentId: '63e5797154a63cef484245f9',
              checkinDate: formatDate(new Date()),
              checkoutDate: null,
              active: true
            })
              .then(res => {
                console.log(res);
                $feathersClient.service('checkins').find({
                  query: {
                    residentId: props.userId._id,
                    $sort: { createdAt: -1 }
                  }
                })
                  .then((res) => {
                    checkins.value = res.data;
                  })
                  .catch((err) => {
                    console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
                  });
              })
              .catch(err => {
                console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
              });
          })
          .catch(err => {
            isLoading.value = false;
            console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
          });
      };

      function handleCheckout() {
        isLoading.value = true;
        $feathersClient.service('residents').patch(resident.value._id, { isStaying: false })
          .then(res => {
            isLoading.value = false;
            // console.log('response: ', res);
            resident.value = res;
            $feathersClient.service('checkins').patch(checkins.value[0]._id, { checkoutDate: new Date() })
              .then(() => {
                console.log(res);

                $feathersClient.service('checkins').find({
                  query: {
                    residentId: props.userId._id,
                    $sort: { createdAt: -1 }
                  }
                })
                  .then((res) => {
                    checkins.value = res.data;
                  })
                  .catch((err) => {
                    console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
                  });
              })
              .catch(err => {
                console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
              });
          })  
          .catch(err => {
            isLoading.value = false;
            console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
          });
      };

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      

      return {
        tab,
        resident,
        age,
        isStaying,
        handleCheckin,
        handleCheckout,
        isLoading,
        checkins,
      };
    },
  };

</script>



<template>
  
    <q-card class="q-card my-card">
      <q-card-section class="spread" >
        <div>
          <div class="text-h3 bold">{{ resident.name }}</div>
          <div style="margin-left: 15px;">
            <div class="text-subtitle1">{{ resident.gender }}</div>
            <div class="text-subtitle1">{{ age }} years old</div>
          </div>
        </div>
        <div class="text-h5 red-text" v-if="isStaying === true" >Currently checked in</div>
        <div class="text-h5 red-text" v-else >Not currently staying</div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Resident Info" name="one" />
        <q-tab label="stay history" name="two" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          <ProfileTabOne :resident="resident" />
        </q-tab-panel>

        <q-tab-panel name="two">
          <ProfileTabTwo :resident="resident" :checkins="checkins" />
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
      <q-card-section class="bottom-btn-section" >
        <q-btn color="secondary" label="Edit Profile" />
        
        <q-btn :loading="isLoading" color="secondary" @click="handleCheckin" v-if="isStaying === false" label="Check in" />
        <q-btn color="secondary" @click="handleCheckout" v-else label="Check out" />
      </q-card-section>
    </q-card>
</template>

<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.q-card {
  min-width: 300px;
  width: 570px;
  overflow: auto;
}

.bottom-btn-section {
  display: flex;
  justify-content: space-between;
}

.red-text {
  color: red;
  font-weight: bold;
}

.spread {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 25px;
}

.bold {
  font-weight: bold;
}

</style>