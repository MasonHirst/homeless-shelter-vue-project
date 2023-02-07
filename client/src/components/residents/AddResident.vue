<script>
  import { defineComponent, ref, inject } from 'vue';
  import { useQuasar } from 'quasar';

  export default defineComponent({
    name: 'AddResident',
    components: {},
    props: {},
    setup() {
      let $feathersClient = inject('$feathersClient');
      let options = ['Male', 'Female'];
      let genderInput = ref(null);
      let nameInput = ref(null);
      let birthdayInput = ref(null);
      let illnessesInput = ref(null);
      let medicationsInput = ref(null);
      let notesInput = ref(null);
      const proxyDate = ref(formatDate(new Date()));
      const date = ref(formatDate(new Date()));
      const proxyDate2 = ref(formatDate(new Date()));
      const date2 = ref(lastMonthDate(new Date(), 1));
      const proxyDate3 = ref(formatDate(new Date()));
      const date3 = ref(lastMonthDate(new Date(), 480));

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      function lastMonthDate(date, sub) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - sub);

        const options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        };

        return newDate.toLocaleDateString('en-GB', options);
      }

      // function to submit a user to the database
      function handleSubmit() {
        $feathersClient.service('residents').create({

        })
          .then((res) => {
            console.log('bruh', res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      return {
        useQuasar,
        options,
        nameInput,
        birthdayInput,
        genderInput,
        illnessesInput,
        medicationsInput,
        notesInput,
        date,
        proxyDate,
        date2,
        proxyDate2,
        date3,
        proxyDate3,
        handleSubmit,

        updateProxy() {
          proxyDate.value = formatDate(date.value);
        },
        save() {
          date.value = formatDate(proxyDate.value);
        },
        updateProxy2() {
          proxyDate2.value = formatDate(date2.value);
        },
        save2() {
          date2.value = formatDate(proxyDate2.value);
        },
        updateProxy3() {
          proxyDate3.value = formatDate(date3.value);
        },
        save3() {
          date3.value = formatDate(proxyDate3.value);
        },

        createValue(val, done) {
          done(val, 'add-unique');
        },
      };
    },
  });
</script>


<template>
  <div>
    <q-card id="Register" class="flex column">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Check in a Resident
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section style="flex: 1; max-height: 70vh; overflow: auto;">
        <q-form no-error-focus>
          <div class="inputs-container row q-col-gutter-md">

            <div class="top-inputs-container">

              <q-input standout="bg-secondary text-white" v-model="nameInput" label="Name" />

              <div class="input-datepicker-div">
                <q-input standout="bg-secondary text-white" v-model="date3" label="Birthday" />
                <!-- Start of datepicker section -->
                <div class="q-pa-md datepicker-btn">
                  <q-btn icon="event" round color="primary">
                    <q-popup-proxy @before-show="updateProxy3" cover transition-show="scale" transition-hide="scale">
                      <q-date default-year-month="1983/02" v-model="proxyDate3">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Cancel" color="primary" flat v-close-popup />
                          <q-btn label="OK" color="primary" flat @click="save3" v-close-popup />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
                <!-- End of datepicker section -->
              </div>

              <q-select standout="bg-secondary text-white" v-model="genderInput" :options="options" label="Gender" />

            </div>

            <div class="date-inputs-div">

              <div class="input-datepicker-div">
                <q-input standout="bg-secondary text-white" v-model="date" label="Check-in date" />
                <!-- Start of datepicker section -->
                <div class="q-pa-md datepicker-btn">
                  <q-btn icon="event" round color="primary">
                    <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="proxyDate">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Cancel" color="primary" flat v-close-popup />
                          <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
                <!-- End of datepicker section -->
              </div>

              <div class="input-datepicker-div">
                <q-input standout="bg-secondary text-white" v-model="date2" label="Most recent checkout" />
                <!-- Start of datepicker section -->
                <div class="q-pa-md datepicker-btn">
                  <q-btn icon="event" round color="primary">
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
                <!-- End of datepicker section -->
              </div>
            </div>

            <q-select label="Add illnesses" standout="bg-secondary text-white" v-model="illnessesInput" use-input
              use-chips multiple hide-dropdown-icon input-debounce="0" @new-value="createValue" style="width: 250px" />

            <q-select label="Add medications" standout="bg-secondary text-white" v-model="medicationsInput" use-input
              use-chips multiple hide-dropdown-icon input-debounce="0" @new-value="createValue" style="width: 250px" />

            <q-input standout="bg-secondary text-white" autogrow v-model="notesInput" label="Notes" />

          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat dense label="cancel" />
        <q-space />

        <q-btn color="primary" @click="handleSubmit">
          Add Resident
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>



<style scoped>
.inputs-container {
  display: flex;
  flex-direction: column;
}

.inputs-container>* {
  min-width: 500px;
}

.top-inputs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.top-inputs-container>* {
  min-width: 30%;
}

.date-badge {
  padding: 10px;
  position: relative;
  top: 4px;
  font-size: 15px;
}

.input-datepicker-div {
  width: 100%;
  position: relative;
}

.datepicker-btn {
  position: absolute;
  top: -9px;
  right: 0px;
}

.date-inputs-div {
  display: flex;
  gap: 10px;
}
</style>