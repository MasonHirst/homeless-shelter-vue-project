<script>
  import { ref, watch, inject } from 'vue';
  import TabTwoCard from './TabTwoCard.vue';
  import Swal from 'sweetalert2';

  export default {
    props: { 
      checkins: Array,
      editTab: Boolean,
      userId: String,
    },
    components: {TabTwoCard},
    setup(props, context) {
      const $feathersClient = inject('$feathersClient');
      const stays = ref(props.checkins);
      const editing = ref(false);
      const createStay = ref(false);
      const endDateToggle = ref(false);
      const date1 = ref(formatDate(Date()));
      const proxyDate1 = ref(formatDate(Date()));
      const date2 = ref(formatDate(Date()));
      const proxyDate2 = ref(formatDate(Date()));

      watch(() => props.checkins, () => {
        stays.value = props.checkins;
      });

      function deleteAction() {
        context.emit('deleteEvent');
      }

      function toggleCreateStay() {
        createStay.value = !createStay.value;
      }

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      function editHandler() {
        createStay.value = !createStay.value;
      }

      function saveHandler() {
        if (!endDateToggle.value) {
          date2.value = null;
        } else date2.value = new Date(date2.value);
        date1.value = new Date(date1.value);
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will create a new stay record for this resident',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, create it!'
        }).then((result) => {
          context.emit('deleteEvent');
          editHandler();
          if (result.value) {
            $feathersClient.service('checkins').create({
              residentId: props.userId,
              checkinDate: date1.value,
              checkoutDate: date2.value
            })
              .then(() => {
                Swal.fire(
                  'Success!',
                  'The record has been added.',
                  'success'
                );
              })
              .catch((error) => {
                console.error(error);
                Swal.fire(
                  'Error!',
                  'There was an error creating the record. Refresh the page and try again.',
                  'error'
                );
              });
          }
        });
      }

      return {
        stays,
        editing,
        deleteAction,
        toggleCreateStay,
        endDateToggle,
        createStay,
        date1,
        proxyDate1,
        date2,
        proxyDate2,
        formatDate,
        editHandler,
        saveHandler,
        updateProxy1() {
          proxyDate1.value = date1.value;
        },
        save1() {
          date1.value = proxyDate1.value;
        },
        updateProxy2() {
          proxyDate2.value = date2.value;
        },
        save2() {
          date2.value = proxyDate2.value;
        },
      };
    },
  };
</script>


<template>
  
  <div class="overflow center">
    <div class="gap border" v-if="createStay && editTab">
      <q-btn @click="editHandler" flat rounded color="primary" label="cancel" v-if="editTab" />
      <div class="stack-parent">
        <div class="stack">
          <span class="text-h6">Check in:</span>
          <span class="text-h6">{{ formatDate(date1) }}</span>

          <q-btn size="sm" icon="event" round color="primary">
            <q-popup-proxy @before-show="updateProxy1" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="proxyDate1">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save1" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
        
        <div class="stack" v-if="endDateToggle">
          <q-toggle
          class="text-h6"
          color="secondary"
          v-model="endDateToggle"
          label="Check out:"
          left-label
          />
          <span class="text-h6">{{ formatDate(date2) }}</span>
          
          <q-btn size="sm" icon="event" round color="primary">
            <q-popup-proxy @before-show="updateProxy2" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="proxyDate2">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save2" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
        
        <div v-else>
          <q-toggle
        class="text-h6"
        color="secondary"
        v-model="endDateToggle"
        label="Checkout"
        left-label
        />
        <span class="text-h6 faded">Currently staying</span>
      </div>
    </div>
      
      
      <!-- <q-btn @click="editHandler" flat rounded color="primary" label="cancel" v-if="editTab" /> -->
      <q-btn @click="saveHandler" flat rounded color="primary" label="save new stay" v-if="editTab" />
    </div>
    
    <div class="center" v-else>
      <q-btn @click="toggleCreateStay" flat color="primary" label="+ Manually create stay" v-if="editTab" />
    </div>
    
    <TabTwoCard v-for="stay in stays" :key="stay" :stay="stay" :editTab="editTab" @delete-event="deleteAction" />
    
  </div>
  </template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.faded {
  opacity: .5;
}

.overflow {
  overflow: auto;
  min-height: 200px;
  max-height: calc(100vh - 400px);
}

.spacer-div {
  height: 75px;
}

.stack-parent {
  display: flex;
  flex-direction: column;
  height: 50px;
  gap: 10px;
}

.stack {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
}

.gap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 5px;
}

.center {
  display: flex;
  flex-direction: column;
}

.border {
  border: 1px dashed #FF211B;
  min-height: 100px;
  border-radius: 10px;
}
</style>