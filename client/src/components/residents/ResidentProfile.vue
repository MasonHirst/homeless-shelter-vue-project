<script>
  import { ref } from 'vue';
  import ProfileTabOne from './ProfileTabOne.vue';
  import ProfileTabTwo from './ProfileTabTwo.vue';

  export default {
    components: {
      ProfileTabOne,
      ProfileTabTwo
    },
    props: {userId: String},
    setup(props) {
      console.log('bro this is the userId: ', props.userId);

      return {
        tab: ref('one')
      };
    },
    methods: {},
  };

</script>



<template>
  <q-page id="RegisterPage" class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Tab one" name="one" />
        <q-tab label="Tab two" name="two" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          <ProfileTabOne />
        </q-tab-panel>

        <q-tab-panel name="two">
          <ProfileTabTwo />
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
      <q-card-section>
        <q-btn color="secondary" label="Edit Profile" />
      </q-card-section>
    </q-card>
  </q-page>
</template>



<!-- add the scoped attribute to contain styles to this component only -->
<style scoped>

</style>