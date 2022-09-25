<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-container>
            <h3>Product Backlog</h3>
            <div class="container text-center">
                <v-btn
                    text
                    outlined
                    large
                    color="blue"
                    class="mb-10"
                    @click="dialogCreacion = true"
                >
                    <v-icon left>
                        mdi-plus
                    </v-icon>
                    Crear una Historia de Usuario
                </v-btn>
            </div>

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
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="historia in listaHistorias" :key="historia.pk">
                        <td>{{ historia.fields.nombre }}</td>
                        <td>{{ historia.fields.descripcion }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="green"
                                @click="openDialogActualizar(historia)">
                                <v-icon dark>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                            <v-btn class="mr-3" fab dark x-small color="red" @click="openDialogEliminar(historia)">
                                <v-icon dark>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>

            <!-- dialag creacion -->
            <v-dialog
            v-model="dialogCreacion"
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
                            @click="dialogCreacion = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Historia de Usuario Nueva
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                        </v-toolbar-items>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="6">
                                <h3>Nombre de la historia de usuario:</h3>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="datosNuevaHistoria.nombre"
                                    label="Nombre de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <h3>Descripción de la historia de usuario:</h3>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="datosNuevaHistoria.descripcion"
                                    label="Descripción de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="4">
                                <h4>Prioridad tecnica de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="datosNuevaHistoria.prioridad_tecnica"
                                    label="Prioridad tecnica de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h4>Prioridad de negocio de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="datosNuevaHistoria.prioridad_negocio"
                                    label="Prioridad de negocio de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h4>Estimacion en horas de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="datosNuevaHistoria.estimacion_horas"
                                    label="Prioridad de negocio de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="6">
                                <h4>Participante asignado a la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-combobox
                                v-model="datosNuevaHistoria.participante"
                                :items="listaParticipantesCorreos"
                                label="Participante asignado de la historia de usuario"
                                outlined
                                dense
                                ></v-combobox>
                            </v-col>
                            <v-col cols="12" md="6">
                                <h4>Tipo de historia de usuario asignado a la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-combobox
                                v-model="datosNuevaHistoria.idTipo"
                                :items="listaTiposHUNombres"
                                label="Tipo de historia de usuario asignado de la historia de usuario"
                                outlined
                                dense
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-btn
                            @click="crearHistoriaUsuario()"
                            class="mt-3 mr-2 mb-4"
                            outlined
                            color="green"
                        >
                            Crear Historia de Usuario
                        </v-btn>
                    </div>
                </v-card>
            </v-dialog>

            <!-- dialog actualizar-->
            <v-dialog
            v-model="dialogActualizacion"
            v-if="historiaSeleccionada"
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
                            @click="dialogActualizacion = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Historia de Usuario
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                        </v-toolbar-items>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="6">
                                <h3>Nombre de la historia de usuario:</h3>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="historiaSeleccionada.fields.nombre"
                                    label="Nombre de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <h3>Descripción de la historia de usuario:</h3>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="historiaSeleccionada.fields.descripcion"
                                    label="Descripción de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="4">
                                <h4>Prioridad tecnica de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="historiaSeleccionada.fields.prioridad_tecnica"
                                    label="Prioridad tecnica de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h4>Prioridad de negocio de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="historiaSeleccionada.fields.prioridad_negocio"
                                    label="Prioridad de negocio de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h4>Estimacion en horas de la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-text-field
                                    v-model="historiaSeleccionada.fields.estimacion_horas"
                                    label="Prioridad de negocio de la historia de usuario"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="6">
                                <h4>Participante asignado a la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-combobox
                                v-model="historiaSeleccionada.fields.desarrollador_asignado"
                                :items="listaParticipantesCorreos"
                                label="Participante asignado de la historia de usuario"
                                outlined
                                dense
                                ></v-combobox>
                            </v-col>
                            <v-col cols="12" md="6">
                                <h4>Tipo de historia de usuario asignado a la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-combobox
                                v-model="historiaSeleccionada.fields.tipo_historia_usuario"
                                :items="listaTiposHUNombres"
                                label="Tipo de historia de usuario asignado de la historia de usuario"
                                outlined
                                dense
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-btn
                            @click="actualizarHistoria()"
                            class="mt-3 mr-2 mb-4"
                            outlined
                            color="green"
                        >
                            Actualizar Historia de Usuario
                        </v-btn>
                    </div>
                </v-card>
            </v-dialog>

            <!-- dialog de eliminar-->
        <v-dialog
            v-model="dialogEliminar"
            v-if="historiaSeleccionada"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar esta Historia de Usuario?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará la Historia de Usuario de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar esta Historia de Usuario, escribe su nombre de Tipo de Historia de Usuario: 
                    <b>{{ historiaSeleccionada.fields.nombre }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminacion"
                        :label="`Escribe: ${historiaSeleccionada.fields.nombre}`"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminacion !== historiaSeleccionada.fields.nombre"
                        color="red"
                        text
                        @click="eliminar(); dialogEliminar = false"
                    >
                        Eliminar Historia de Usuario
                    </v-btn>

                    <v-btn
                        color="grey darken-2"
                        text
                        @click="dialogEliminar = false"
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
            idProyecto: 0,
            dialogCreacion: false,
            datosNuevaHistoria: {},
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
        // get historia de usaurios
        this.inicializarLista()

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
            // get historia de usaurios
            const res = await axios.get(`/historiasUsuario/listar?idProyecto=${this.idProyecto}`, config)
            this.listaHistorias = res.data
        },

        async crearHistoriaUsuario(){
            const idToken = this.$store.state.usuario.idToken

            //obtenemos la id del participante
            let indexParticipante = this.listaParticipantesCorreos.indexOf(this.datosNuevaHistoria.participante)
            // obtenemos la id del tipoHU
            let indexTipo = this.listaTiposHUNombres.indexOf(this.datosNuevaHistoria.idTipo)

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                idProyecto: this.idProyecto,
                nombre: this.datosNuevaHistoria.nombre,
                descripcion: this.datosNuevaHistoria.descripcion,
                prioridad_tecnica: this.datosNuevaHistoria.prioridad_tecnica,
                prioridad_negocio: this.datosNuevaHistoria.prioridad_negocio,
                estimacion_horas: this.datosNuevaHistoria.estimacion_horas,
                idTipo: this.listaTiposHU[indexTipo].pk,
                idParticipante: this.listaParticipantes[indexParticipante].pk,
            }

            const response = await this.axios.post(`/historiasUsuario/`, body, config)

            alert("Historia de usuario creada con exito")

            this.datosNuevaHistoria = {}
            this.dialogCreacion = false

            this.inicializarLista()

        },

        async actualizarHistoria(){
            const idToken = this.$store.state.usuario.idToken

            //obtenemos la id del participante
            console.log("this.historiaSeleccionada.fields.desarrollador_asignado",this.historiaSeleccionada.fields.desarrollador_asignado)
            let indexParticipante = this.listaParticipantesCorreos.indexOf(this.historiaSeleccionada.fields.desarrollador_asignado)
            // obtenemos la id del tipoHU
            let indexTipo = this.listaTiposHUNombres.indexOf(this.historiaSeleccionada.fields.tipo_historia_usuario)

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                idProyecto: this.idProyecto,
                idHistoria: this.historiaSeleccionada.pk,
                nombre: this.historiaSeleccionada.fields.nombre,
                descripcion: this.historiaSeleccionada.fields.descripcion,
                prioridad_tecnica: this.historiaSeleccionada.fields.prioridad_tecnica,
                prioridad_negocio: this.historiaSeleccionada.fields.prioridad_negocio,
                estimacion_horas: this.historiaSeleccionada.fields.estimacion_horas,
                idTipo: this.listaTiposHU[indexTipo].pk,
                idParticipante: this.listaParticipantes[indexParticipante].pk,
            }
            console.log("Body",body)
            

            const response = await this.axios.put(`/historiasUsuario/`, body, config)

           alert("Historia de usuario actualizada")

        },

        async eliminar(){
            const idToken = this.$store.state.usuario.idToken
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            await this.axios.delete(`/historiasUsuario/?idProyecto=${this.idProyecto}&idHistoria=${this.historiaSeleccionada.pk}`, config)
            alert("Historia de usuario eliminada")
            this.inicializarLista()
        },

        openDialogActualizar(data){
            
            this.historiaSeleccionada = data

            // obtenemos el indice
            const indexParticipante = this.listaParticipantesID.findIndex(object => {
                return object.pk === this.historiaSeleccionada.fields.desarrollador_asignado;
            });
            this.historiaSeleccionada.fields.desarrollador_asignado = this.listaParticipantesCorreos[indexParticipante]
            
            // obtenemos el indice
            const indexTipo = this.listaTiposHU.findIndex(object => {
                return object.pk === this.historiaSeleccionada.fields.tipo_historia_usuario;
            });
            this.historiaSeleccionada.fields.tipo_historia_usuario = this.listaTiposHUNombres[indexTipo]
            
            this.dialogActualizacion = true
        },

        openDialogEliminar(data){
            this.dialogEliminar = true
            this.historiaSeleccionada = data
        },

    },

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