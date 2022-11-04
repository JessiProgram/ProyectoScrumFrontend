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
            <h3>Historias de Usuarios Finalizadas</h3>
            <!-- listamos las historias de usuarios -->
            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Nombre
                        </th>
                        <th class="text-left">
                            Descripción
                        </th>
                        <th class="text-left">
                            Estado
                        </th>
                        <th class="text-left">
                            Visualizar
                        </th>
                        <th class="text-left">
                            Rechazar/Aceptar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="historia in listaHistorias" :key="historia.pk">
                        <td>{{ historia.fields.nombre }}</td>
                        <td>{{ historia.fields.descripcion }}</td>
                        <td>{{ historia.fields.estadoCadena }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="green" 
                            :disabled="historia.fields.estado == 'cancelada'
                            || proyecto.fields.estado === 'cancelado'"
                            @click="$router.push(`/proyecto/${idProyecto}/product-backlog/${historia.pk}`)">
                                <v-icon dark>
                                    mdi-eye
                                </v-icon>
                            </v-btn>

                            <v-btn small outlined color="green"
                            @click="verTablero(historia)"
                            v-if="sprint && sprint.fields.estado === 'En Ejecución'">
                            Ver en Tablero
                            </v-btn>
                            </td>
                            <td>    
                            <v-btn class="mr-3" fab dark x-small color="red" 
                            :disabled="historia.fields.estado == 'cancelada'
                            || proyecto.fields.estado === 'cancelado'"
                            @click="openDialogCambiarEstado(false, historia)" placeholder="Rechazar">
                                <v-icon dark>
                                    mdi-window-close
                                </v-icon>
                            </v-btn>

                            <v-btn class="mr-3" fab dark x-small color="green" 
                            :disabled="historia.fields.estado == 'cancelada'
                            || proyecto.fields.estado === 'cancelado'"
                            @click="openDialogCambiarEstado(true, historia)" placeholder="Aceptar">
                                <v-icon dark>
                                    mdi-check
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>

            <v-row justify="center">
                    <v-dialog
                    v-model="dialogCambiarEstado"
                    persistent
                    max-width="350"
                    >
                    <v-card>
                        <v-toolbar
                        :color="esAceptar ? 'green' : 'red'"
                        class="mb-5"
                        dark
                        >
                            <h4>¿Está seguro que desea {{esAceptar ? 'aceptar' : 'rechazar'}} la historia de usuario?</h4>
                        </v-toolbar>
                        

                        <v-card-text v-if="esAceptar">Al aceptar esta historia, se considera como completamente finalizada y ya no puede realizar cambios en el kanban</v-card-text>
                        <v-card-text v-else>Al rechazar esta historia se considera que aun requiere cambios, se quedará en el último estado del kanban, debe actualizar el estado en el que considera que se encuantra la historia</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="red darken-1"
                            text
                            @click="dialogCambiarEstado = false"
                        >
                            Cancelar
                        </v-btn>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="cambiarEstado()"
                        >
                            Estoy seguro
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-row>
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
            idProyecto: 0,
            proyecto:null,
            sprint: null,

            listaParticipantes: [],
            listaParticipantesID: [],
            listaParticipantesCorreos: [],
            listaTiposHU: [],
            listaTiposHUNombres: [],
            listaHistorias: [],

            dialogActualizacion: false,
            historiaSeleccionada: null,
            datosActualizarHistoria: {},

            dialogEliminar: false,
            confirmacionEliminacion:'',

            dialogCambiarEstado: false,
            esAceptar: false,

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
                    text: 'Product Backlog',
                    disabled: true,
                    href: '/product-backlog',
                },
            ],
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

        // get historia de usaurios
        this.inicializarLista()
        this.obtenerSprint()

        try {
              // get lista de participantes
            const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, config)
            this.listaParticipantes = responseParticipantes.data
            console.log("listaParticipantes",this.listaParticipantes)

            for (const participante of this.listaParticipantes) 
                this.listaParticipantesCorreos.push(participante.fields.email)

            // get id participantes
            const responseParticipantesId = await axios.get(`/proyecto/listar-participantes-id?idproyecto=${this.idProyecto}`, config)
            this.listaParticipantesID = responseParticipantesId.data

            // get lista tipos hu
            let resTipos = await axios.get(`/tipoHistoriaUsuario/?idproyecto=${this.idProyecto}`, config)
            this.listaTiposHU = resTipos.data

            for (const tipoHU of this.listaTiposHU) 
                this.listaTiposHUNombres.push(tipoHU.fields.nombre)   
        } catch (error) {
            if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
        }

    },

    methods: {

        async inicializarLista(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            try {
                // get historia de usaurios
                const res = await axios.get(`/historiasUsuario/historias-finalizadas?idProyecto=${this.idProyecto}`, config)
                this.listaHistorias = res.data
                
                for (let i = 0; i < this.listaHistorias.length; i++) {
                    const historia = this.listaHistorias[i];
                    if(historia.fields.estado && historia.fields.estado  !== 'finalizada' && historia.fields.estado !== 'cancelada')
                        await this.obtenerEstado(historia.fields.estado, historia)
                    else
                        historia.fields.estadoCadena = historia.fields.estado
                }
                this.listaHistorias = Object.assign({}, this.listaHistorias)
                
            } catch (error) {
                if (error.res.data.length <= 200) {
                    alert(error.res.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        async obtenerEstado(idColumna, historiaUsuario){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            // obtenemos las columnas
            let res = await axios.get(`/tipoHistoriaUsuario/columnas?idColumna=${idColumna}`, config)

            let nombreColumna = res.data[0].fields.nombre

            historiaUsuario.fields.estadoCadena = nombreColumna
        },

        async obtenerSprint(){
            // buscar sprint actual
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

                } else {
                    this.sprint = null
                    return
                }
            } catch (error) {
                this.sprint = null
            }
        },

        async verTablero(historia){
            // buscar sprint actual
            let idToken = this.$store.state.usuario.idToken

            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }


            this.$router.push(`/proyecto/${this.idProyecto}/sprints/${this.sprint.pk}/tableros/${historia.fields.tipo_historia_usuario}`)
        },

        async openDialogCambiarEstado(esAceptar, historia){
            this.historiaSeleccionada = historia
            this.dialogCambiarEstado = true
            this.esAceptar = esAceptar
        },

        async cambiarEstado(){
            //actualizamos el estado de la historia
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            const body = {
                idProyecto: this.idProyecto,
                idHistoria: this.historiaSeleccionada.pk,
                estado: this.esAceptar ? 'aceptada' : 'rechazada',

                nombre: null,
                descripcion: null,
                prioridad_tecnica: null,
                prioridad_negocio: null,
                estimacion_horas: null,
                idTipo: null,
                idParticipante: null,
                horas_trabajadas: null,
                estimacion: null,
            }
            
            try {
                const response = await this.axios.put(`/historiasUsuario/`, body, config)
                this.dialogCambiarEstado = false
                this.inicializarLista()
                
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
    }
}

</script>

<style>

</style>
