<template>
    <LayoutDefault>
        <v-container>
            <h3>Tipo Historias de Usuario</h3>

            <v-text-field v-model="nombre" label="Nombre Tipo Historia Usuario" required></v-text-field>

            <v-btn outlined :disabled="!nombre" @click="crear()" @loading="creando" color="indigo">
                Crear Tipo Historia Usuario
            </v-btn>


            <v-simple-table>
                <thead>
                    <tr>
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
                        <td>{{ tipoHU.fields.nombre }}</td>
                        <td>{{ new Date(tipoHU.fields.fechaCreacion).toLocaleString() }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="green"
                                @click="openDialogActualizarTipoHU(tipoHU)">
                                <v-icon dark>
                                    mdi-eye
                                </v-icon>
                            </v-btn>
                            <v-btn class="mr-3" fab dark x-small color="red" @click="openDialogEliminarTipoHU(tipoHU)">
                                <v-icon dark>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
            <h4 class="mt-3">Buscar e importar Tipo de Historia de Usuario de otros proyectos</h4>
            <v-btn outlined @click="importarTiposHU()" color="indigo">
                Buscar e Importar
            </v-btn>
        </v-container>

        <!-- dialog de eliminar-->
        <v-dialog
            v-model="dialogEliminarTipoHU"
            v-if="tipoHUSeleccionado"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar este Tipo de Historia de Usuario?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará el Tipo de Historia de Usuario de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar este Tipo de Historia de Usuario, escribe su nombre de Tipo de Historia de Usuario: 
                    <b>{{ tipoHUSeleccionado.fields.nombre }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminaciontipoHU"
                        :label="`Escribe: ${tipoHUSeleccionado.fields.nombre}`"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminaciontipoHU !== tipoHUSeleccionado.fields.nombre"
                        color="red"
                        text
                        @click="eliminar"
                    >
                        Eliminar Tipo de Historia de Usuario
                    </v-btn>

                    <v-btn
                        color="grey darken-2"
                        text
                        @click="dialogEliminarTipoHU = false"
                    >
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
            proyecto: null,
            nombre: '',
            listaTiposHU: [],
            creando: false,

            dialogEliminarTipoHU: false,
            tipoHUSeleccionado: null,
            confirmacionEliminaciontipoHU: "",
            dialogActualizarTipoHU: false,

            columnas: []
        }
    },

    components: {
        LayoutDefault,
    },

    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        await this.inicializarLista()
    },

    methods: {
        async inicializarLista() {
            
            let idToken = this.$store.state.usuario.idToken
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            let res = await axios.get(`/tipoHistoriaUsuario/?idproyecto=${this.idProyecto}`, config)

            console.log("res.data", res.data)
            this.listaTiposHU = res.data
        },

        async crear() {
            this.creando = true
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            const body = {
                nombre: this.nombre,
                id_proyecto: this.idProyecto,
                columnas: ['Todo', 'Doing', 'Done']
            }

            const response = await this.axios.post(`/tipoHistoriaUsuario/`, body, config)
            this.inicializarLista()

            this.creando = false
        },

        async eliminar () {
            this.processing = {
                value: true,
                message: `Eliminando Tipos de Historia de Usuario.`,
            }

            try {
                const idToken = this.$store.state.usuario.idToken
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                await axios.delete(`/tipoHistoriaUsuario/?id=${this.tipoHUSeleccionado.pk}&idproyecto=${this.idProyecto}`, config)
                this.inicializarLista()

            } catch (error) {
                console.log('error', error)

            } finally {
                this.dialogEliminarTipoHU = false
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },

        async openDialogActualizarTipoHU(data){
            // pusheamos a la pagina de vista
            
            this.dialogActualizarTipoHU = true
            this.tipoHUSeleccionado = data
            this.$router.push(`tipo-historias-usuarios/${this.tipoHUSeleccionado.pk}`)
        },

        async openDialogEliminarTipoHU(data) {
            this.dialogEliminarTipoHU = true
            this.tipoHUSeleccionado = data
            this.confirmacionEliminaciontipoHU = ''
        },

        async importarTiposHU(){

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