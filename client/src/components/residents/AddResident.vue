<script>
  import { defineComponent, ref, inject } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';
  import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'AddResident',
    components: {},
    props: {},
    setup() {
      let $feathersClient = inject('$feathersClient');
      let router = useRouter();
      let route = useRoute();
      // const idParam = ref(route.params.id);
      const isNew = ref(route.params.isNew);
      let options = ['Male', 'Female'];
      let genderInput = ref(null);
      let nameInput = ref(null);
      let illnessesInput = ref(null);
      let medicationsInput = ref(null);
      let notesInput = ref(null);
      const proxyDate = ref(formatDate(new Date()));
      const date = ref(formatDate(new Date()));
      const proxyDate2 = ref(formatDate(new Date()));
      const date2 = ref();
      const proxyDate3 = ref(formatDate(new Date()));
      const date3 = ref(null);
      const illnessOptions = ref([]);
      const filterOptions = ref([]);
      const medicationOptions = ref([]);
      const medicationFilterOptions = ref([]);

      if (!isNew.value) {
        console.log('is new');
        // $feathersClient.service('residents').get(idParam)
        //   .then((res) => {
        //     console.log('res: ', res);
        //   })
        //   .catch(err => {
        //     console.error('ERROR IN THE ADD RESIDENT: ', err);
        //   });
      }

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
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

      function normalizeDate(dateStr) {
        const [day, month, year] = dateStr.split(' ');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return new Date(year, months.indexOf(month), day);
      }

      // function to submit a user to the database
      function handleSubmit() {
        if (date2.value) {
          if (normalizeDate(date2.value) > normalizeDate(lastMonthDate(date.value, 1))) {
            Swal.fire({
              title: 'Resident cannot be checked in',
              text: 'This resident has checked out in the last month',
              icon: 'warning',
            });
            return;
          }
        }

        $feathersClient.service('residents').create({
          name: nameInput.value,
          birthday: date3.value,
          gender: genderInput.value,
          illnesses: illnessesInput.value,
          medications: medicationsInput.value,
          notes: notesInput.value,
        })
          .then((res) => {
            router.push({ name: 'residentProfilePage', params: { id: res._id } });
          })
          .catch((err) => {
            console.error(err);
          });
      }

      $feathersClient.service('illnesses').find({})
        .then((res) => {
          illnessOptions.value = res.data[0].illness;
        })
        .catch((err) => {
          console.error('ERROR IN THE ILLNESSES DATA FETCH', err);
        });

      $feathersClient.service('medications').find({})
        .then(res => {
          medicationOptions.value = res.data[0].medication;
        })
        .catch(err => {
          console.error('ERROR IN THE MEDICATIONS DATA FETCH', err);
        });

      function filterFn(val, update) {
        update(() => {
          if (val === '') {
            filterOptions.value = illnessOptions.value;
          }
          else {
            const needle = val.toLowerCase();
            filterOptions.value = illnessOptions.value.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }

      function medicationsFilterFn(val, update) {
        update(() => {
          if (val === '') {
            medicationFilterOptions.value = medicationOptions.value;
          }
          else {
            const needle = val.toLowerCase();
            medicationFilterOptions.value = medicationOptions.value.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }

      function handleCancel() {
        router.go(-1);
      }

      return {
        useQuasar,
        options,
        nameInput,
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
        normalizeDate,
        filterFn,
        medicationsFilterFn,
        filterOptions,
        medicationFilterOptions,
        medicationOptions,
        handleCancel,

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
  <div class="add-res-div">
    <q-card id="Register" class="flex column">
      <q-toolbar style="" class="bg-primary text-white">
        <q-toolbar-title>
          Check in a new Resident
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section style="flex: 1; max-height: 70vh; overflow: auto;">
        <q-form no-error-focus>
          <div class="inputs-container row q-col-gutter-md">

            <div class="top-inputs-container">

              <q-input :rules="[val => !!val || 'Field is required']" autofocus standout="bg-secondary text-white"
                v-model="nameInput" label="Name" />

              <div class="input-datepicker-div">
                <q-input :rules="[val => !!val || 'Field is required']" standout="bg-secondary text-white"
                  v-model="date3" hint="Ex: 08 Nov 1987" label="Birthday" />
                <!-- Start of datepicker section -->
                <div class="q-pa-md datepicker-btn">
                  <q-btn icon="event" round color="primary">
                    <q-popup-proxy @before-show="updateProxy3" cover transition-show="scale" transition-hide="scale">
                      <q-date default-view="Years" default-year-month="1983/02" v-model="proxyDate3">
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


            </div>
            <q-select standout="bg-secondary text-white" v-model="genderInput" :options="options" label="Gender" />


            <q-select label="Add illnesses" standout="bg-secondary text-white" v-model="illnessesInput" use-input
              use-chips multiple input-debounce="0" @new-value="createValue" :options="filterOptions" @filter="filterFn"
              style="width: 250px" />

            <q-select label="Add medications" standout="bg-secondary text-white" v-model="medicationsInput" use-input
              use-chips multiple input-debounce="0" @new-value="createValue" :options="medicationFilterOptions"
              @filter="medicationsFilterFn" style="width: 250px" />

            <!-- <q-input standout="bg-secondary text-white" autogrow v-model="notesInput" label="Notes" /> -->

            <q-select label="Add notes" standout="bg-secondary text-white" v-model="notesInput" use-input use-chips
              autogrow multiple hide-dropdown-icon input-debounce="0" @new-value="createValue" style="width: 250px" />

          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions>
          <q-btn @click="handleCancel" flat dense style="color: black;" label="cancel" />
        <q-space />

        <q-btn color="primary" @click="handleSubmit">
          Add Resident
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>



<style scoped>
.add-res-div {
  margin-top: 25px;
  min-width: 600px;
}

.inputs-container {
  display: flex;
  flex-direction: column;
}

.inputs-container>* {
  min-width: 100%;
}

.top-inputs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  position: relative;
  top: 5px;
}

.top-inputs-container>* {
  min-width: 47%;
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
  right: -10px;
}

.date-inputs-div {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.date-inputs-div>* {
  min-width: 30%;
}
</style>