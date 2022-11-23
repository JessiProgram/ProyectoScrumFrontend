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
            <h2 class="mb-2">Bienvenido al Proyecto "{{proyecto.fields.nombre}}"</h2>

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
            v-on:click="$router.push(`/proyecto/${idProyecto}/product-backlog`)"
            >
                Product Backlog
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/sprints`)"
            >
                Sprints
            </v-btn>
            <v-btn v-if="sprint" class="red--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/sprints/${sprint.pk}`)"
            >
                Sprint en Ejecución
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/configuracion`)">
                Configurar el Proyecto
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado'] && $store.getters['usuario/getPermisosProyecto'].includes('actualizar_historia_usuario')" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/release`)">
                Release de Historias
            </v-btn>
            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="$router.push(`/proyecto/${idProyecto}/reportes`)">
                Reportes
            </v-btn>

            <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                    v-on="on" 
                    v-if="$store.getters['usuario/estaAutenticado']" 
                    class="green--text mr-2 mb-2" 
                    outlined
                    :disabled="!posibleIniciar || proyecto.fields.estado === 'cancelado' || proyecto.fields.estado === 'Finalizado'"
                    v-on:click="iniciarProyecto()"
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
        <v-container>
            <div v-if="sprint" >
                <h3>Tipo Historias de Usuario Activos</h3>

                <v-simple-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                ID
                            </th>
                            <th class="text-left">
                                Nombre
                            </th>
                            <th class="text-left">
                                Fecha Creación
                            </th>
                            <th class="text-left">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tipoHU in listaTiposHU" :key="tipoHU.pk">
                            <td>{{ tipoHU.pk }}</td>
                            <td>{{ tipoHU.fields.nombre }}</td>
                            <td>{{ new Date(tipoHU.fields.fechaCreacion).toLocaleString() }}</td>
                            <td>
                                <v-btn class="mr-3" fab dark x-small color="green"
                                    @click="$router.push(`/proyecto/${idProyecto}/sprints/${sprint.pk}/tableros/${tipoHU.pk}`)">
                                    <v-icon dark>
                                        mdi-eye
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </v-container>
    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '@/plugins/axios'

export default {
    name: '',
    data() {
        return {
            posibleIniciar:false,
            idProyecto: 0,
            proyecto: null,
            dialog: false,
            estadoProyecto:'INICIAR PROYECTO',
            sprint: null,
            listaTiposHU: [],
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
        

        let res = await axios.get(`/proyecto/?q=${this.idProyecto}`, config)

        this.proyecto = res.data[0]

        this.posibleIniciar = this.proyecto.fields.estado !== 'iniciado'
        this.estadoProyecto = this.proyecto.fields.estado === 'planificacion'? `Proyecto ${this.proyecto.fields.estado}` : "Iniciar Proyecto"

        this.obtenerSprint()
    },
    methods: {
        async iniciarProyecto(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body1 = {
                id: this.idProyecto,
            }
            try {
                
                let res = await this.axios.put(`/proyecto/iniciarProyecto`, body1, config)

                this.estadoProyecto = "Proyecto Iniciado"
                this.posibleIniciar = false
                
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
            
        },

        async obtenerSprint(){
            let idToken = this.$store.state.usuario.idToken

            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`/sprints/estado?idProyecto=${this.idProyecto}`, config)

                if(res.data !== 'No hay sprint en ejecucion'){

                    this.sprint = res.data[0]
                    
                    this.inicializarListaTableros()

                } else {
                    this.sprint = null
                }
            } catch (error) {
                this.sprint = null
            }
        },

        async inicializarListaTableros() {
            
            let idToken = this.$store.state.usuario.idToken
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`/sprints/listar-tipos?idProyecto=${this.idProyecto}&idSprint=${this.sprint.pk}`, config)

                console.log("res.data", res.data)
                this.listaTiposHU = res.data
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
        

    },

}
</script>

<style>

</style>