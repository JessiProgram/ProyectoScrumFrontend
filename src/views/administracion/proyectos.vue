<template>
    <LayoutAdmin>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <v-container>

            <v-text-field
            v-model="nombre"
            label="Nombre Proyecto"
            required
            ></v-text-field>
            <v-text-field
            v-model="descripcion"
            label="Descripcion Proyecto"
            required
            ></v-text-field>
            <v-text-field
            v-model="scrumMaster"
            label="Correo Scrum Master Proyecto"
            required
            ></v-text-field>
            <v-btn
            class="ma-2"
            outlined
            :disabled="!nombre || !descripcion || !scrumMaster"
            @click="agregar()"
            color="indigo"
            >
            Crear Proyecto
            </v-btn>
                    
        </v-container>
    </LayoutAdmin>
  </template>
  
  <script>
  import LayoutAdmin from '@/layouts/Admin.vue'
  
  export default {
    name: 'HomeView',
    data() {
        return {
            nombre:'',
            descripcion:'',
            scrumMaster:'',

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
        async agregar(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                fechaInicio: null,
                fechaFin: null,
                estado:"Creado",
                scrumMaster: this.scrumMaster
            }

            const response = await this.axios.post(`/proyecto`, body, config)
            alert("Proyecto creado")
            this.nombre = ''
            this.descripcion = ''
            this.scrumMaster = ''
        }
        
    },
    watch: {
        
    },
    async created () {
        
    }
  }
  </script>
  
<style scoped>

</style>
