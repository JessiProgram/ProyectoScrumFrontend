<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <v-container class="container" v-if="proyecto && proyecto.fields">
            <h3 class="mb-2">Bienvenido al Proyecto "{{proyecto.fields.nombre}}"</h3>

            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/participantes`)"
            >
                Participantes
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/roles-internos`)">
                Roles
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/tipo-historias-usuarios`)"
            >
                Tipos Historias de Usuario
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/configuracion`)">
                Configurar el Proyecto
            </v-btn>
            

            <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                    v-on="on" 
                    v-if="$store.getters['usuario/estaAutenticado']" 
                    class="green--text mr-2 mb-2" 
                    outlined
                    v-on:click=""
                    >
                        {{estadoProyecto}}
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        El Proyecto ha sido iniciado
                    </v-card-title>

                    <v-card-text>
                        A partir de ahora el proyecto está en ejecución
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="dialog = false">
                            Aceptar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


        </v-container>
    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '../../plugins/axios'

export default {
    name: '',
    data() {
        return {
            idProyecto: 0,
            proyecto: null,
            dialog: false,
            estadoProyecto:'INICIAR PROYECTO',
            items: [
                {
                    text: 'Inicio',
                    disabled: false,
                    href: '/inicio',
                },
                {
                    text: 'Proyectos',
                    disabled: false,
                    href: '/proyectos',
                },
                {
                    text: `Proyecto ${this.$route.params.idProyecto}`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}`,
                },
            ],
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {

        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        let body = {}

        let res = await axios.get(`proyecto?q=${this.idProyecto}`, config)

        this.proyecto = res.data[0]

        console.log('this.proyecto', this.proyecto)
    },
    methods: {

    },

}
</script>

<style>

</style>