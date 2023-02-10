<script>
  import { ref, inject } from 'vue';
  import Swal from 'sweetalert2';

  export default {
    props: {
      stay: Object,
      editTab: Boolean,
    },
    setup(props, context) {
      const $feathersClient = inject('$feathersClient');
      let editCard = ref(false);
      const endDateToggle = ref(false);
      const date1 = ref(formatDate(props.stay.checkinDate));
      const proxyDate1 = ref(Date());
      const date2 = ref(new Date());
      const proxyDate2 = ref(new Date());

      if (props.stay.checkoutDate) {
        endDateToggle.value = true;
      }

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      function isAfterStartDate(date1, date2) {
        const diffTime = date2 - date1;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > -1;
      }

      function isWithin7Days(date1, date2) {
        const diffTime = date2 - date1;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > -1 && diffDays <= 8;
      }

      function editHandler() {
        editCard.value = !editCard.value;
      }

      function saveHandler() {
        if (!endDateToggle.value) {
          date2.value = null;
        } else date2.value = new Date(date2.value);
        date1.value = new Date(date1.value);

        if (endDateToggle.value) {
          if (!isAfterStartDate(date1.value, date2.value)) {
            console.log(isAfterStartDate(date1.value, date2.value));
            Swal.fire({
              title: 'Check again!',
              icon: 'error',
              text: 'Check out date cannot be before check in date'
            });
            return;
          }
        }
        if (endDateToggle.value) {
          if (!isWithin7Days(date1.value, date2.value)) {
            Swal.fire({
              title: 'Are you sure?',
              icon: 'warning',
              text: 'You are attempting to change a stay record to be longer than the 7-day limit',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, change it!'
            }).then(result => {
              if (result.value) {
                saveIt();
                return;
              }
            });
          } else saveIt();
        } else if (!isWithin7Days(date1.value, new Date())) {
          Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            text: 'This change shows the resident has been checked in for more than a week!',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
          }).then(result => {
            if (result.value) {
              saveIt();
              return;
            }
          });
        } else saveIt();
      }

      function saveIt() {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will permanently change this stay record',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, change it!'
        }).then((result) => {
          context.emit('deleteEvent');
          editHandler();
          if (result.value) {
            $feathersClient.service('checkins').patch(props.stay._id, {
              checkinDate: date1.value,
              checkoutDate: date2.value
            })
              .then(() => {
                Swal.fire(
                  'Updated!',
                  'The record has been changed.',
                  'success'
                );
              })
              .catch((error) => {
                console.error(error);
                Swal.fire(
                  'Error!',
                  'There was an error changing the record. Refresh the page and try again.',
                  'error'
                );
              });
          }
        });
      }

      function deleteHandler() {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will permanently delete this stay record',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          context.emit('deleteEvent');
          editHandler();
          if (result.value) {
            $feathersClient.service('checkins').remove(props.stay._id)
              .then(() => {
                Swal.fire(
                  'Deleted!',
                  'The record has been deleted.',
                  'success'
                );
              })
              .catch((error) => {
                console.error(error);
                Swal.fire(
                  'Error!',
                  'There was an error deleting the record.',
                  'error'
                );
              });
          }
        });
      }

      return {
        formatDate,
        editHandler,
        saveHandler,
        editCard,
        deleteHandler,
        date1,
        date2,
        proxyDate1,
        proxyDate2,
        endDateToggle,
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
  <div v-if="!editCard">
    <div v-if="stay" style="padding: 10px;">
      <div class="text-h6 gap" v-if="stay.checkoutDate">
        <span>{{ formatDate(stay.checkinDate) }}</span>
        <span>-</span>
        <span>{{ formatDate(stay.checkoutDate) }}</span>
        <q-btn @click="editHandler" flat rounded color="primary" label="edit" v-if="editTab" />
      </div>

      <div class="text-h6 gap" v-else>
        <span>{{ formatDate(stay.checkinDate) }}</span>
        <span>-</span>
        <span style="color: red; font-weight: bold;">current</span>
        <q-btn @click="editHandler" flat rounded color="primary" label="edit" v-if="editTab" />
      </div>
    </div>

    <div v-else>
      <span class="text-h6 faded">This resident has no stay history</span>
    </div>
  </div>
  <div class="gap border" v-else>
    <q-btn @click="deleteHandler" icon="delete" flat round class="trash" v-if="editTab" />
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
        <q-toggle class="text-h6" color="secondary" v-model="endDateToggle" label="Check out:" left-label />
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
        <q-toggle class="text-h6" color="secondary" v-model="endDateToggle" label="Checkout" left-label />
        <span class="text-h6 faded">Currently staying</span>
      </div>
    </div>

    <q-btn @click="editHandler" flat rounded color="primary" label="cancel" v-if="editTab" />
    <q-btn @click="saveHandler" flat rounded color="primary" label="save" v-if="editTab" />
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.faded {
  opacity: .5;
}

.stack-parent {
  display: flex;
  flex-direction: column;
  height: 50px;
  gap: 10px;
}

.stack-events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stack {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
}


.border {
  border: 1px dashed #FF211B;
  min-height: 100px;
  border-radius: 10px;
}



.trash {
  background-color: transparent;
  color: red;
  font-size: 15px;
}

.gap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
</style>