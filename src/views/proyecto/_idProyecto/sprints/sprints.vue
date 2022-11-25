<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-container v-if="proyecto">
            <h3>Sprints</h3>


            <v-btn class="blue--text mr-2 mb-2" outlined 
            :disabled="proyecto.fields.estado === 'cancelado'|| proyecto.fields.estado === 'Finalizado'"
            v-on:click="dialogCrear = true"
            v-if="$store.getters['usuario/getPermisosProyecto'].includes('crear_sprint')"
            >
                Nuevo Sprint
            </v-btn>

            <h4>Lista de los Sprints del proyecto</h4>

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
                            Fecha Inicio
                        </th>
                        <th class="text-left">
                            Fecha Fin
                        </th>
                        <th class="text-left">
                            Estado
                        </th>
                        <th class="text-left">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sprint in listaSprints" :key="sprint.pk">
                        <td>{{ sprint.pk }}</td>
                        <td>{{ sprint.fields.nombre }}</td>
                        <td>{{ sprint.fields.fecha_inicio ? new Date(sprint.fields.fecha_inicio).toLocaleString() : '-' }}</td>
                        <td>{{ sprint.fields.fecha_fin ? new Date(sprint.fields.fecha_fin).toLocaleString() : '-' }}</td>
                        <td>{{ sprint.fields.estado }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="green"
                                @click="editarSprint(sprint)"
                                v-if="$store.getters['usuario/getPermisosProyecto'].includes('obtener_sprint')"
                                >
                                <v-icon dark>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                            <v-btn 
                            v-if="sprint.fields.estado !== 'Finalizado' && sprint.fields.estado !== 'Cancelado' && 
                            $store.getters['usuario/getPermisosProyecto'].includes('borrar_sprint')"
                            class="mr-3" fab dark x-small color="red" @click="openDialogEliminarSprint(sprint)">
                                <v-icon dark>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>


            <v-dialog
                v-model="dialogCrear"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
            >
                <v-card>
                    <v-toolbar
                        dark
                        color="primary"
                    >
                        <v-btn
                            icon
                            dark
                            @click="dialogCrear = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Nuevo Sprint
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-text-field
                        v-model="nombre"
                        label="Nombre"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="descripcion"
                        label="Descripcion"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="cantidadDias"
                        label="Cantidad de dias"
                        required
                        ></v-text-field>

                        <v-btn
                            @click="crearSprint()"
                            class="mt-3 mr-2"
                            outlined
                            color="blue"
                            :disabled="!nombre || !descripcion || !cantidadDias"
                        >
                            Crear Sprint
                        </v-btn>

                    </div>
                    
                </v-card>
            </v-dialog>

            <!-- dialog de eliminar-->
            <v-dialog
                v-model="dialogEliminarSprint"
                v-if="sprintSeleccionado"
                max-width="800px"
            >
                <v-card>
                    <v-card-title class="informacionAccion textoInformacionAccion">
                        ¿Quieres eliminar este Sprint?
                    </v-card-title>
                    <v-card-text class="informacionAccion textoInformacionAccion">
                        Esta acción eliminará el Sprint del equipo de este sprint de forma permanente.
                    </v-card-text>
                    <v-card-text class="mt-5">
                        Para confirmar que deseas eliminar este Sprint, escribe su correo: 
                        <b>{{ sprintSeleccionado.fields.nombre }}</b>
                    </v-card-text>

                    <div class="container text-center" max-width="400px">
                        <v-text-field
                            class="inputConfirmacionAccion"
                            v-model="confirmacionEliminacionSprint"
                            :label="`Escribe: ${sprintSeleccionado.fields.nombre}`"
                            required
                        ></v-text-field>
                    </div>

                    <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                        <v-btn
                            class="ml-4 mr-3"
                            :disabled="confirmacionEliminacionSprint !== sprintSeleccionado.fields.nombre"
                            color="red"
                            text
                            @click="eliminarSprint()"
                        >
                            Eliminar Sprint
                        </v-btn>

                        <v-btn
                            color="grey darken-2"
                            text
                            @click="dialogEliminarSprint = false"
                        >
                            Cerrar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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

            idProyecto:0,
            proyecto:null,
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
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}`,
                },
                {
                    text: 'Sprints',
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints`,
                },
            ],

            nombre: "",
            descripcion: "",
            cantidadDias: 14,

            dialogCrear: false,

            listaSprints: [],

            sprintSeleccionado: null,
            dialogEliminarSprint: false,
            confirmacionEliminacionSprint: '',

        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        const idToken = this.$store.state.usuario.idToken

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}` 
            }
        }
        let resP = await this.axios.get(`/proyecto/?q=${this.idProyecto}`, config)
        this.proyecto = resP.data[0]


        this.inicializarLista()
    },
    methods:{
        async inicializarLista(){
            let idToken = this.$store.state.usuario.idToken

            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`/sprints/listar?idProyecto=${this.idProyecto}`, config)
                this.listaSprints = res.data
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
        async crearSprint(){
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
                idProyecto: this.idProyecto,
                capacidadEquipo: 0,
                cantidadDias:this.cantidadDias
            }

            try{

                const response = await this.axios.post(`/sprints/`, body, config)
                alert("Sprint creado")

            } catch (error) {

                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }

            } finally {

                this.nombre = ''
                this.descripcion = ''
                this.cantidadDias = 14
                this.inicializarLista()
            }
        },
        async eliminarSprint(){
            
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            try {
                await this.axios.delete(`/sprints/?idProyecto=${this.idProyecto}&idSprint=${this.sprintSeleccionado.pk}`, config)

                alert("Sprint eliminado")
                this.inicializarLista()
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
                
        },
        openDialogEliminarSprint(data){
            this.sprintSeleccionado = data
            this.dialogEliminarSprint = true
        },
        async editarSprint(data){
            // pusheamos a la pagina de vista
            
            this.sprintSeleccionado = data
            this.$router.push(`sprints/${this.sprintSeleccionado.pk}`)
        },
    }
    
}
</script>

<style scoped>
    .informacionAccion {
        /* rgba(230, 62, 62, 0.159) */
        background-color: rgba(255, 29, 137, 0.159);
    }
    
    .textoInformacionAccion {
        color: rgb(197, 52, 52);
    }
    
    .inputConfirmacionAccion {
        margin-left: 12px;
        margin-right: 12px;
    }
</style>