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
            <h3>Tipo Historia de Usuario</h3>
            <div v-if="tipoHU">
                <v-text-field v-model="nombreTipoHU" label="Nombre Tipo Historia Usuario"></v-text-field>
                <div class="container text-right">
                    <v-btn outlined :disabled="!nombreTipoHU || nombreTipoHU === tipoHU.fields.nombre" @click="actualizarTipoHU()" @loading="creando" color="indigo" class="mb-5">
                        Actualizar Nombre
                    </v-btn>
                </div>
            </div>


            <h3>Columnas</h3>
            <v-text-field v-model="nombre" label="Nombre Nueva Columna" required></v-text-field>
            <div class="container text-right">
                <v-btn outlined :disabled="!nombre || (columnaSeleccionada && columnaSeleccionada.fields.nombre === nombre)" @click="crear()" @loading="creando" color="indigo">
                    <div v-if="!esActualizar">Agregar columna</div><div v-else>Actualizar columna</div>
                </v-btn>
                <v-btn v-if="esActualizar" outlined @click="limparSeleccion()" color="red" class="ml-3">
                Cancelar
                </v-btn>
            </div>
            
            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Orden
                        </th>
                        <th class="text-left">
                            Nombre
                        </th>
                        <th class="text-left">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(columna, index) of columnas" :key="index">
                        <td>{{ columna.fields.orden }}</td>
                        <td>{{ columna.fields.nombre }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="blue"
                                :disabled="deshabilitarCambio || index === 0"
                                @click="actualizarOrden(columna, columna.fields.orden , false)">
                                <v-icon dark>
                                    mdi-arrow-up-thick
                                </v-icon>
                            </v-btn>
                            <v-btn class="mr-3" fab dark x-small color="blue"
                                :disabled="deshabilitarCambio || index === columnas.length-1"
                                @click="actualizarOrden(columna, columna.fields.orden , true)">
                                <v-icon dark>
                                    mdi-arrow-down-thick
                                </v-icon>
                            </v-btn>
                            <v-btn class="mr-3" fab dark x-small color="green" 
                                @click="openDialogActualizarTipoHU(columna)">
                                <v-icon dark>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                            <v-btn class="mr-3" fab dark x-small color="red" @click="openDialogEliminarTipoHU(columna)" :disabled="columnas.length <=3">
                                <v-icon dark>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-container>

        <!-- dialog de eliminar-->
        <v-dialog
            v-model="dialogEliminarColumna"
            v-if="columnaSeleccionada"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar esta Columna del Tipo de Historia de Usuario?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará la columna del Tipo de Historia de Usuario de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar esta Columna Tipo de Historia de Usuario, escribe su nombre de Tipo de Historia de Usuario: 
                    <b>{{ columnaSeleccionada.fields.nombre }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminacionColumna"
                        :label="`Escribe: ${columnaSeleccionada.fields.nombre}`"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminacionColumna!== columnaSeleccionada.fields.nombre"
                        color="red"
                        text
                        @click="eliminar"
                    >
                        Eliminar Columna de Tipo de Historia de Usuario
                    </v-btn>

                    <v-btn
                        color="grey darken-2"
                        text
                        @click="dialogEliminarColumna = false"
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
            creando: false,
            tipoHU: null,
            nombreTipoHU: '',

            dialogEliminarColumna: false,
            dialogActualizarColumna: false,
            confirmacionEliminacionColumna: "",
            columnaSeleccionada: null,

            columnas: [],

            esActualizar: false,

            deshabilitarCambio: false,

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
                    text: 'Tipo Historia de Usuario',
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/tipo-historias-usuarios`,
                },
                {
                    text: 'Editar',
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/tipo-historias-usuarios/${this.$route.params.idTipoHU}`,
                },
            ],
        }
    },

    components: {
        LayoutDefault,
    },

    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.idTipoHU = this.$route.params.idTipoHU
        await this.inicializarLista()
    },

    methods: {
        async inicializarLista() {
            let idToken = this.$store.state.usuario.idToken

            this.columnas = []
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }
            try {
                let res = await axios.get(`/tipoHistoriaUsuario/tipoHU?idproyecto=${this.idProyecto}&id=${this.idTipoHU}`, config)

                this.tipoHU = res.data[0]
                this.nombreTipoHU = this.tipoHU.fields.nombre

                for (let i = 1; i < res.data.length; i++) {
                    const columna = res.data[i];
                    this.columnas.push(columna)
                }
                this.columnas.sort((a,b) => a.fields.orden - b.fields.orden);

            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
            }

        },

        async actualizarTipoHU(){

            // llamamos al backend para cambiar el nombre

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                id: this.idTipoHU,
                idProyecto: this.idProyecto,
                nombre: this.nombreTipoHU,

            }

            try {
                const response = await this.axios.put(`/tipoHistoriaUsuario/tipoHU`, body, config)

                this.tipoHU.fields.nombre = this.nombreTipoHU
                alert("Se actualizó correctamente")
            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
            }
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
                await axios.delete(`/tipoHistoriaUsuario/columnas?id_tipo_HU=${this.idTipoHU}&id_proyecto=${this.idProyecto}&orden=${this.columnaSeleccionada.fields.orden}`, config)
                this.inicializarLista()

            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
                console.log('error', error)

            } finally {
                this.dialogEliminarColumna = false
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },

        async crear() {
            try {
                if (!this.esActualizar){
                    const idToken = this.$store.state.usuario.idToken

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${idToken}` 
                        }
                    }

                    const body = {
                        id_tipo_HU: this.idTipoHU,
                        id_proyecto: this.idProyecto,
                        nombre: this.nombre,
                    }

                    const response = await this.axios.post(`/tipoHistoriaUsuario/columnas`, body, config)
                    
                    this.inicializarLista()
                    this.nombre = ''
                    alert("Creado Tipo Historia Usuario")
                }else{
                
                    const idToken = this.$store.state.usuario.idToken

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${idToken}` 
                        }
                    }

                    const body = {
                        id_proyecto: this.idProyecto,
                        nombre: this.nombre,
                        id_tipo_HU: this.idTipoHU,
                        orden_origen: this.columnaSeleccionada.fields.orden,
                        orden_destino: this.columnaSeleccionada.fields.orden
                    }
                    console.log('body',body)
                    const response = await this.axios.put(`/tipoHistoriaUsuario/columnas`, body, config)

                    alert("Columna Actualizada")

                    this.limparSeleccion()
                    this.inicializarLista()
                }
            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
            }
            
        },

        async openDialogEliminarTipoHU(data) {
            this.dialogEliminarColumna = true
            this.columnaSeleccionada = data
            this.confirmacionEliminacionColumna = ''
        },

        async openDialogActualizarTipoHU(columna){
            this.esActualizar = true
            this.columnaSeleccionada = columna
            this.nombre = columna.fields.nombre
        },

        limparSeleccion(){
            this.nombre = ''
            this.columnaSeleccionada = null
            this.esActualizar = false
        },

        async actualizarOrden(columna, orden, baja){

            this.deshabilitarCambio = true

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                id_proyecto: this.idProyecto,
                nombre: columna.fields.nombre,
                id_tipo_HU: this.idTipoHU,
                orden_origen: orden,
                orden_destino: baja ? orden+1 : orden-1
            }
            try {
                const response = await this.axios.put(`/tipoHistoriaUsuario/columnas`, body, config)

                this.inicializarLista()
                this.deshabilitarCambio = false
            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
            }

        }

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

