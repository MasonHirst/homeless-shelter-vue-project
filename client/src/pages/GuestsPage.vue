
<script>
  import { defineComponent } from 'vue';
  import GuestList from 'src/components/guests/GuestList.vue';
  import AddGuest from 'src/components/guests/AddGuest.vue';

  export default defineComponent({
    name: 'GuestsPage',
    components: { GuestList, AddGuest },
    setup() {

      return {

      };
    },
  });
</script>


<template>
  <q-page style="" class="q-pa-md">
    <div class="div-1">

      <GuestList />
      <AddGuest />
    </div>
  </q-page>
</template>


<style scoped>
.div-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>