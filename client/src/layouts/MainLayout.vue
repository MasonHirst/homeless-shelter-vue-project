
<script>
  import {defineComponent, ref} from 'vue';
  import EssentialLink from 'components/EssentialLink.vue';

  const linksList = [
    {
      title: 'Home',
      icon: 'home',
      to: {name: 'home'},
    },
    {
      title: 'Residents',
      icon: 'group',
      to: {name: 'residents'},
    },
    {
      title: 'Schedule',
      icon: 'schedule',
      to: {name: 'schedule'},
    },
  ];

  export default defineComponent({
    name: 'MainLayout',
    
    components: {
      EssentialLink,
    },
    
    setup() {
      const leftDrawerOpen = ref(false);

      return {
        essentialLinks: linksList,
        leftDrawerOpen,
        toggleLeftDrawer() {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        },
      };
    },
  });
</script>


  <template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn flat
                 dense
                 round
                 icon="menu"
                 aria-label="Menu"
                 @click="toggleLeftDrawer"
                 />
  
          <q-toolbar-title>
            Haven Shelter
          </q-toolbar-title>
  
          <div>Quasar v{{ $q.version }}</div>
        </q-toolbar>
      </q-header>
  
      <q-drawer :width=190 v-model="leftDrawerOpen"
                bordered>
        <q-list>
          <q-item-label header>
            Pages
          </q-item-label>
  
          <EssentialLink v-for="link in essentialLinks"
                         :key="link.title"
                         v-bind="link"/>
        </q-list>
      </q-drawer>
  
      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </template>