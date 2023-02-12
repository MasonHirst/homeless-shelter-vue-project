<script>
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: { resident: Object },
    setup(props) {
      const $router = useRouter();
      let $feathersClient = inject('$feathersClient');
      const residentObj = ref(props.resident);
      const checkins = ref(null);
      const isStaying = ref(false);

      function handleClick() {
        $router.push({ name: 'residentProfilePage', params: { id: residentObj.value._id } });
      }

      function moveNullCheckoutToTop(array) {
        let nullCheckoutIndex = -1;
        for (let i = 0; i < array.length; i++) {
          if (!array[i].checkoutDate) {
            nullCheckoutIndex = i;
            break;
          }
        }
        if (nullCheckoutIndex !== -1) {
          const nullCheckout = array.splice(nullCheckoutIndex, 1)[0];
          array.unshift(nullCheckout);
        }
      }

      $feathersClient.service('checkins').find({
        query: {
          residentId: residentObj.value._id,
          $sort: { checkinDate: -1 }
        }
      })
        .then((res) => {
          checkins.value = res.data;
          moveNullCheckoutToTop(checkins.value);
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
          console.error('ERROR IN THE RESIDENT LIST CARD: ', err);
        });

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      return {
        residentObj,
        handleClick,
        formatDate,
        checkins,
        isStaying,
      };
    },
  };
</script>


<template>
  <q-btn class="q-btn" @click="handleClick" flat>
    <div class="flex-col no-caps" style="width: 100%;">
      <div class="flex-row-spread">
        <div class="flex-row">
          <div class="text-blue q-gutter-md" v-if="residentObj.gender === 'Male'">
            <q-icon name="man" />
          </div>
          <div class="text-purple q-gutter-md" v-else>
            <q-icon name="woman" />
          </div>
          <div class="text-h5 bold">{{ residentObj.name }}</div>
        </div>
        <div class="dotted-line" v-if="isStaying" />
        <div v-if="isStaying" class="text-subtitle red-text">Checked in</div>
      </div>
      <div class="text-subtitle1">
        <span class="faded">Birthday: </span>
        <span>{{ formatDate(residentObj.birthday) }}</span>
      </div>
    </div>
  </q-btn>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.flex-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dotted-line {
  border-top: 1px dotted black;
  width: stretch;
  margin: 0 8px;
}

.flex-row-spread {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bold {
  font-weight: bold;
}

.no-caps {
  text-transform: none;
  font-size: large;
}

.faded {
  opacity: .5;
}

.q-btn {
  width: 100%;
}

.q-btn:hover {
  color: #1876D1;
}

.red-text {
  color: red;
  font-weight: bold;
}
</style>