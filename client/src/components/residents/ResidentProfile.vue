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


      function handleCheckin() {
        isLoading.value = true;
        $feathersClient.service('residents').patch(resident.value._id, { isStaying: true })
          .then(res => {
            isLoading.value = false;
            console.log('response: ', res);
            resident.value = res;
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
            console.log('response: ', res);
            resident.value = res;
          })
          .catch(err => {
            isLoading.value = false;
            console.log('ERROR IN THE RESIDENT PROFILE COMPONENT: ', err);
          });
      };
      

      return {
        tab: ref('one'),
        resident,
        age,
        isStaying,
        handleCheckin,
        handleCheckout,
        isLoading,
      };
    },
  };

</script>



<template>
  
    <q-card class="q-card my-card">
      <q-card-section class="spread" >
        <div class="text-h3 bold">{{ resident.name }}</div>
        <!-- <div class="text-subtitle2">{{ resident.gender }}</div>
        <div class="text-subtitle2">{{ age }} years old</div> -->
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
          <ProfileTabTwo :resident="resident" />
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
  align-items: center;
  gap: 25px;
}

.bold {
  font-weight: bold;
}

</style>