<script>
  import { ref, watch } from 'vue';

  export default {
    props: { checkins: Array },
    setup(props) {
      const stays = ref(props.checkins);


      watch(() => props.checkins, () => {
        stays.value = props.checkins;
      });

      function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      return {
        stays,
        formatDate,
      };
    },
    methods: {},
  };

</script>


<template>
  <div v-if="stays" style="padding: 15px;">
    <div v-for="stay in stays" :key="stay">
      <div class="text-h6 gap" v-if="stay.checkoutDate">
        <span>{{ formatDate(stay.checkinDate) }}</span> 
        <span>-</span>
        <span>{{ formatDate(stay.checkoutDate) }}</span>
      </div>

      <div class="text-h6 gap" v-else>
        <span>{{ formatDate(stay.checkinDate) }}</span> 
        <span>-</span>
        <span style="color: red; font-weight: bold;">current</span>
      </div>
    </div>
  </div>

  <div v-else>
    <span class="text-h6 faded">This resident has no stay history</span>
    <div class="spacer-div"></div>
  </div>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>
.faded {
  opacity: .5;
}

.spacer-div {
  height: 75px;
}

.gap {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 5px;
}
</style>