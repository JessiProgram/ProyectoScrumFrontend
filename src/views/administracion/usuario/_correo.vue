<template>
    <LayoutAdmin>
        {{ $route.params.correo }}
    </LayoutAdmin>
  </template>
  
  <script>
  import LayoutAdmin from '@/layouts/Admin.vue'
  
  export default {
    name: 'HomeView',
    data() {
        return {
            lista: [],
        }
    },
    components: {
        LayoutAdmin,
    },
    methods: {
      
    },
    created () {
      
    },
    mounted () {
      
    }
  }
  </script>
  
<style scoped>

</style>