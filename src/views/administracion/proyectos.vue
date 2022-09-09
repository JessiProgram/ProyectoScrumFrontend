<template>
    <LayoutAdmin>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <div class="container">
            
        </div>
    </LayoutAdmin>
  </template>
  
  <script>
  import LayoutAdmin from '@/layouts/Admin.vue'
  
  export default {
    name: 'HomeView',
    data() {
        return {
            

            processing: {
                value: false,
                message: '',
            },

            items: [
                {
                    text: 'Inicio',
                    disabled: false,
                    href: '/inicio',
                },
                {
                    text: 'Administración',
                    disabled: false,
                    href: '/administracion',
                },
                {
                    text: 'Proyectos',
                    disabled: true,
                    href: '/administracion/proyectos',
                },
            ],
        }
    },
    components: {
        LayoutAdmin,
    },
    methods: {
        
    },
    watch: {
        
    },
    async created () {
        
    }
  }
  </script>
  
<style scoped>

</style>
