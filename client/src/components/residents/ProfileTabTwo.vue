<script>
  import { ref, watch } from 'vue';
  import TabTwoCard from './TabTwoCard.vue';

  export default {
    props: { 
      checkins: Array,
      editTab: Boolean,
    },
    components: {TabTwoCard},
    setup(props, context) {
      const stays = ref(props.checkins);
      const editing = ref(false);

      watch(() => props.checkins, () => {
        stays.value = props.checkins;
      });

      function deleteAction() {
        context.emit('deleteEvent');
      }

      return {
        stays,
        editing,
        deleteAction,
      };
    },
  };
</script>


<template>
  <div class="overflow center">
    <q-btn flat color="primary" label="+ Manually create stay" v-if="editTab" />
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
</style>