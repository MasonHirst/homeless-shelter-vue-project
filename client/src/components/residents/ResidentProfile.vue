<script>
  import { ref, inject, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import ProfileTabOne from './ProfileTabOne.vue';
  import ProfileTabTwo from './ProfileTabTwo.vue';
  import Swal from 'sweetalert2';

  export default {
    components: {
      ProfileTabOne,
      ProfileTabTwo
    },
    props: { userId: String },
    setup(props) {
      let $feathersClient = inject('$feathersClient');
      const $router = useRouter();
      const resident = ref({});
      const age = ref(null);
      const isStaying = ref('');
      const isLoading = ref(true);
      const checkins = ref({});
      const tab = ref('one');
      const editTabOne = ref(false);
      const editTabTwo = ref(false);
      const daysSince = ref(null);
      const showWarningMessage = ref(true);

      setTimeout(() => isLoading.value = false, 1000);

      $feathersClient.service('residents').get(props.userId, {})
        .then(res => {
          resident.value = res;
        })
        .catch(err => {
          Swal.fire({
            title: 'Resident Id not found',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Back to residents page'
          });
          $router.push({ name: 'residents' });
          console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
        });

      watch(() => resident.value, () => {
        let ageInMilliseconds = new Date() - new Date(resident.value.birthday);
        let ageDate = new Date(ageInMilliseconds);
        age.value = Math.abs(ageDate.getUTCFullYear() - 1970);
      });


      function getCheckins() {
        isLoading.value = true;
        $feathersClient.service('checkins').find({
          query: {
            residentId: props.userId,
            $sort: { checkinDate: -1 }
          }
        })
          .then(res => {
            isLoading.value = false;
            checkins.value = res.data;
            if (checkins.value.length === 0) {
              isStaying.value = false;
            } else {
              if (checkins.value[0].checkinDate && !checkins.value[0].checkoutDate) {
                isStaying.value = true;
              } else {
                isStaying.value = false;
              }
            }
          })
          .catch(err => {
            isLoading.value = false;
            console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
          });
      }
      getCheckins();

      function isWithin30Days(date) {
        const diffTime = new Date() - new Date(date);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays < 30;
      }


      function handleCheckin() {
        if (checkins.value.length !== 0) {
          if (isWithin30Days(checkins.value[0].checkoutDate)) {
            Swal.fire({
              title: 'Resident cannot be checked in',
              icon: 'warning',
              text: 'This resident has checked in within the last 30 days',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Check in anyway'
            })
              .then((result) => {
                if (result.value) {
                  checkResidentIn();
                }
              })
              .catch((err) => {
                console.error('ERROR IN RESIDENT PROFILE', err);
              });
          } else {
            checkResidentIn();
          }
        } else {
          checkResidentIn();
          deleteEvent();
        }
      };

      function checkResidentIn() {
        isLoading.value = true;
        $feathersClient.service('checkins').create({
          residentId: props.userId,
          checkinDate: formatDate(new Date()),
          checkoutDate: null,
        })
          .then(() => {
            isLoading.value = false;
          })
          .catch(err => {
            isLoading.value = false;
            console.log('ERROR IN RESIDENT PROFILE COMPONENT: ', err);
          });
      }

      function handleCheckout() {
        isLoading.value = true;
        $feathersClient.service('residents').patch(resident.value._id, { isStaying: false })
          .then(res => {
            isLoading.value = false;
            resident.value = res;
            $feathersClient.service('checkins').patch(checkins.value[0]._id, { checkoutDate: new Date() })
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

      function daysSinceCheckin(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        daysSince.value = Math.floor(diffDays);
      }
      watch(() => checkins.value, () => {
        if (isStaying.value) {
          daysSinceCheckin(checkins.value[0].checkinDate);
        }
      });

      function handleDeleteResident() {
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          text: 'This will permanently delete all records pertaining to this user',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Delete Resident'
        })
          .then((result) => {
            if (result.value) {
              $feathersClient.service('residents').remove(props.userId)
                .then(() => {
                  Swal.fire({
                    title: 'Resident Id not found',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Back to residents page'
                  });
                  $router.push({ name: 'residents' });
                  // $feathersClient.service('checkins').remove(null, {
                  //   query: {residentId: props.userId}
                  // })
                  //   .then((res) => {
                  //     console.log('REMOVED RESIDENT AND CHECKINS: ', res);
                  //     $router.push({name: 'residents'});
                  //   })
                  //   .catch((err) => {
                  //     console.error('ERROR REMOVING RESIDENT CHECKINS: ', err);
                  //   });
                })
                .catch((err) => {
                  console.error('ERROR DELETING RESIDENT: ', err);
                });
            }
          })
          .catch((err) => {
            console.error('ERROR IN RESIDENT PROFILE', err);
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
        editTabOne,
        editTabTwo,
        toggleEdit1,
        toggleEdit2,
        deleteEvent,
        daysSince,
        showWarningMessage,
        handleDeleteResident,
        toggleShowWarning() {
          showWarningMessage.value = false;
        }
      };
    },
  };

</script>



<template>
  <div class="page-div">
    <div class="text-h3 warning-div" v-if="isStaying && showWarningMessage && daysSince >= 7">
      Resident is overdue for check out!
      <q-btn @click="toggleShowWarning" flat color="white" label="dismiss" />
    </div>

    <q-card class="q-card my-card">
      <q-card-section class="spread">
        <div>
          <div class="text-h3 bold">{{ resident.name }} <q-btn @click="handleDeleteResident" flat color="red"
              icon="delete" /></div>
          <div style="margin-left: 15px;">
            <div class="text-subtitle1">{{ resident.gender }}</div>
            <div class="text-subtitle1">{{ age }} years old</div>
          </div>
        </div>
        <div class="stay-div" v-if="isStaying === true">
          <div class="text-h5 green-text" style="margin-top: 5px;">Currently checked in</div>
          <div class="text-h6" v-if="daysSince < 6">Day <span class="red-text">{{ daysSince }}</span> of stay</div>
          <div class="text-h6" v-if="daysSince >= 6 && daysSince < 8">Day <span class="red-text">{{ daysSince }}</span>
            of stay</div>
          <div class="text-h6" v-if="daysSince >= 8">
            <span style="font-size: 20px; color: red; position: relative; top: 4px;">* </span> Day <span
              class="red-text">{{ daysSince }}</span> of stay
          </div>
        </div>
        <div class="text-h5 green-text" style="margin-top: 5px;" v-else>Not currently staying</div>
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
          <ProfileTabTwo :userId="userId" :editTab="editTabTwo" :resident="resident" :checkins="checkins"
            @delete-event="deleteEvent" />
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
      <q-card-section class="bottom-btn-section">
        <q-btn @click="toggleEdit1" color="secondary" label="Edit Profile" v-if="tab === 'one'" />
        <div v-else>
          <q-btn @click="toggleEdit2" color="secondary" label="Edit stay history" v-if="!editTabTwo" />
          <q-btn @click="toggleEdit2" color="secondary" label="Stop editing" v-else />
        </div>

        <q-btn :loading="isLoading" color="secondary" @click="handleCheckin" v-if="isStaying === false"
          label="Check in" />
        <q-btn color="secondary" @click="handleCheckout" v-else label="Check out" />
      </q-card-section>
    </q-card>
  </div>
</template>

<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.warning-div {
  background-color: orange;
  border-radius: 10px;
  padding: 15px;
}

.page-div {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.q-card {
  min-width: 300px;
  width: 650px;
  overflow: auto;
}

.bottom-btn-section {
  display: flex;
  justify-content: space-between;
}

.green-text {
  color: #1876D1;
  font-weight: bold;
}

.stay-div {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.red-text {
  color: red;
  font-weight: bold;
}
</style>