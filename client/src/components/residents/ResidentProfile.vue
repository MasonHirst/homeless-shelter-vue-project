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
      const isLoading = ref(true);
      const checkins = ref({});
      const tab = ref('one');
      const editTabOne = ref(false);
      const editTabTwo = ref(false);

      setTimeout(() => isLoading.value = false, 1000);

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
      });


      function getCheckins() {
        $feathersClient.service('checkins').find({
          query: {
            residentId: props.userId._id,
            $sort: { createdAt: -1 }
          }
        })
          .then(res => {
            isLoading.value = false;
            checkins.value = res.data;
            if (checkins.value[0].checkinDate && !checkins.value[0].checkoutDate) {
              isStaying.value = true;
            } else {
              isStaying.value = false;
            }
          })
          .catch(err => {
            console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
          });
      }
      getCheckins();


      function handleCheckin() {
        isLoading.value = true;
        $feathersClient.service('residents').patch(resident.value._id, { isStaying: true })
          .then(res => {
            resident.value = res;

            $feathersClient.service('checkins').create({
              residentId: '63e5797154a63cef484245f9',
              checkinDate: formatDate(new Date()),
              checkoutDate: null,
            })
              .then(() => {
                $feathersClient.service('checkins').find({
                  query: {
                    residentId: props.userId._id,
                    $sort: { createdAt: -1 }
                  }
                })
                  .then((res) => {
                    isLoading.value = false;
                    checkins.value = res.data;
                    if (checkins.value[0].checkinDate && !checkins.value[0].checkoutDate) {
                      isStaying.value = true;
                    } else {
                      isStaying.value = false;
                    }
                  })
                  .catch((err) => {
                    isLoading.value = false;
                    console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
                  });
              })
              .catch(err => {
                isLoading.value = false;
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
            resident.value = res;
            $feathersClient.service('checkins').patch(checkins.value[0]._id, {  checkoutDate: new Date() })
              .then(() => {
                getCheckins();
              })
              .catch(err => {
                isLoading.value = false;
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

      function toggleEdit1() {
        editTabOne.value = !editTabOne.value;
      };

      function toggleEdit2() {
        editTabTwo.value = !editTabTwo.value;
      };

      function deleteEvent() {
        isLoading.value = true;
        setTimeout(() => {
          getCheckins();
        }, 1000);
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
        editTabOne,
        editTabTwo,
        toggleEdit1,
        toggleEdit2,
        deleteEvent,
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
        <div class="text-h5 red-text" style="margin-top: 5px;" v-if="isStaying === true" >Currently checked in</div>
        <div class="text-h5 red-text" style="margin-top: 5px;" v-else >Not currently staying</div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Resident Info" name="one" />
        <q-tab label="stay history" name="two" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          <ProfileTabOne :editTab="editTabOne" :resident="resident" />
        </q-tab-panel>

        <q-tab-panel name="two">
          <ProfileTabTwo :userId="userId" :editTab="editTabTwo" :resident="resident" :checkins="checkins" @delete-event="deleteEvent" />
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
      <q-card-section class="bottom-btn-section" >
        <q-btn @click="toggleEdit1" color="secondary" label="Edit Profile" v-if="tab === 'one'" />
        <div v-else>
          <q-btn @click="toggleEdit2" color="secondary" label="Edit stay history" v-if="!editTabTwo" />
          <q-btn @click="toggleEdit2" color="secondary" label="Stop editing" v-else />
        </div>
        
        <q-btn :loading="isLoading" color="secondary" @click="handleCheckin" v-if="isStaying === false" label="Check in" />
        <q-btn color="secondary" @click="handleCheckout" v-else label="Check out" />
      </q-card-section>
    </q-card>
</template>

<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.q-card {
  min-width: 300px;
  width: 650px;
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