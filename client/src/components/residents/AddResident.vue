<script>
  import { defineComponent, ref } from 'vue';
  import { useQuasar } from 'quasar';

  export default defineComponent({
    name: 'AddResident',
    components: {},
    props: {},
    setup() {
      let options = ['Male', 'Female'];
      let model = ref(null);
      let nameInput = ref(null);
      let ageInput = ref(null);
      let illnessesInput = ref(null);
      let medicationsInput = ref(null);
      let notesInput = ref(null);
      const proxyDate = ref(formatDate(new Date()));
      const date = ref(formatDate(new Date()));
      const proxyDate2 = ref(formatDate(new Date()));
      const date2 = ref(lastMonthDate(new Date()));

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      function lastMonthDate(date) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);

        const options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        };

        return newDate.toLocaleDateString('en-US', options);
      }

      function handleSubmit() {
        console.log('handleSubmit function started');
      }

      return {
        useQuasar,
        options,
        model,
        nameInput,
        ageInput,
        illnessesInput,
        medicationsInput,
        notesInput,
        date,
        proxyDate,
        date2,
        proxyDate2,
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

        createValue(val, done) {
          // specific logic to eventually call done(...) -- or not
          done(val, 'add-unique');

          // done callback has two optional parameters:
          //  - the value to be added
          //  - the behavior (same values of new-value-mode prop,
          //    and when it is specified it overrides that prop –
          //    if it is used); default behavior (if not using
          //    new-value-mode) is to add the value even if it would
          //    be a duplicate
        }
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

              <q-input standout="bg-secondary text-white" v-model="ageInput" label="Age" />

              <q-select standout="bg-secondary text-white" v-model="model" :options="options" label="Gender" />

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