<template>
    <LayoutDefault>

        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

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
                Crear un rol
            </v-btn>

            <v-btn
                text
                outlined
                large
                color="blue"
                class="mb-10 ml-5"
                @click="dialogImportar = true"
            >
                <v-icon left>
                    mdi-plus
                </v-icon>
                Importar Roles
            </v-btn>

            <v-card 
                v-for="item in listaRoles" :key="item.uid" 
                class="mx-auto mb-7"
                width="600"
            >
                <v-img
                    height="120px"
                    :src="`https://source.unsplash.com/random/1440x900?sig=${item.uid}`"
                >
                    <v-card-title class="white--text mt-8">
                        <v-avatar size="56">
                        <img
                            alt="user"
                            :src="`https://robohash.org/${item.uid}?set=set4`"
                        >
                        </v-avatar>
                        <p class="ml-3">
                            {{ item.uid }} - {{ item.nombre }}
                        </p>
                    </v-card-title>
                </v-img>

                <v-card-text class="text-center">
                    <div class="">
                        <v-btn
                            @click="openDialogVerRol(item)"
                            color="green"
                            text
                            outlined
                            class="mr-2"
                        >
                            Actualizar rol
                        </v-btn>

                        <v-btn
                            @click="openDialogEliminarRol(item)"
                            :disabled="sePuedeEliminar()"
                            color="red"
                            text
                            outlined
                            class="mr-0"
                        >
                            Eliminar rol
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card v-if="rolSeleccionado">
                <v-toolbar
                    dark
                    color="primary"
                >
                    <v-btn
                        icon
                        dark
                        @click="dialog = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        {{rolSeleccionado.nombre}}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    </v-toolbar-items>
                </v-toolbar>

                <div class="container my-5 px-10">
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <h2>Nombre del rol:</h2>
                            <v-divider class="mb-5" />
                            <v-text-field
                                v-model="datosActualizadosRol.nombre"
                                label="Nombre del rol"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <h2>Descripción del rol:</h2>
                            <v-divider class="mb-5" />
                            <v-text-field
                                v-model="datosActualizadosRol.descripcion"
                                label="Descripción del rol"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-btn
                        @click="actualizarDatos"
                        class="mt-3 mr-2"
                        outlined
                        color="green"
                    >
                        Actualizar datos
                    </v-btn>

                </div>

                <v-divider></v-divider>

                <div class="container mt-5">
                    <h2>
                        Permisos:
                    </h2>

                    <v-checkbox
                        v-for="(item, index) in codigosPermisosInternos" :key="index"
                        v-model="listaPermisosSeleccionados[index]"
                        :label="`${nombresPermisosInternos[index]}`"
                    ></v-checkbox>

                    <v-btn
                        @click="actualizarPermisosDelRol"
                        class="mt-3 mr-2"
                        outlined
                        color="green"
                    >
                        Actualizar roles
                    </v-btn>
                </div>
                
            </v-card>
        </v-dialog>

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
                        Rol nuevo
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    </v-toolbar-items>
                </v-toolbar>

                <div class="container my-5 px-10">
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <h2>Nombre del rol:</h2>
                            <v-divider class="mb-5" />
                            <v-text-field
                                v-model="datosRolNuevo.nombre"
                                label="Nombre del rol"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <h2>Descripción del rol:</h2>
                            <v-divider class="mb-5" />
                            <v-text-field
                                v-model="datosRolNuevo.descripcion"
                                label="Descripción del rol"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                </div>

                <v-divider></v-divider>

                <div class="container mt-5">
                    <h2>
                        Permisos:
                    </h2>

                    <v-checkbox
                        v-for="(item, index) in codigosPermisosInternos" :key="index"
                        v-model="datosRolNuevo.listaPermisosSeleccionados[index]"
                        :label="`${nombresPermisosInternos[index]}`"
                    ></v-checkbox>

                    <v-btn
                        @click="crearRol"
                        class="mt-3 mr-2"
                        outlined
                        color="green"
                    >
                        Crear rol
                    </v-btn>
                </div>
                
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="processing.value"
            persistent
            width="300"
        >
            <v-card
                color="#683bce"
                dark
            >
                <v-card-text class="pt-3">
                    {{ processing.message }}
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogEliminacion"
            v-if="datosRolEliminacion"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar este rol?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará el rol de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar este rol, escribe su nombre: 
                    <b>{{ datosRolEliminacion.nombre }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminacionRol"
                        :label="datosRolEliminacion.nombre"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminacionRol !== datosRolEliminacion.nombre"
                        color="red"
                        text
                        @click="eliminarRol"
                    >
                        Eliminar rol
                    </v-btn>

                    <v-btn
                        color="grey darken-2"
                        text
                        @click="dialogEliminacion = false"
                    >
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialog de importar-->
        <v-dialog
            v-model="dialogImportar"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    Importar roles de un proyecto del sistema
                </v-card-title>

                <v-container>
                    <v-expansion-panels>
                        <v-expansion-panel
                        v-for="(proyecto,i) of listaProyectos"
                        :key="i"
                        >
                            <div v-if="Number(proyecto.pk) !== Number(idProyecto)">
                                <v-expansion-panel-header @click="buscarRoles(proyecto)">
                                <h4>{{proyecto.fields.nombre}}</h4>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-list two-line>
                                        <v-list-item-group
                                            multiple
                                        >
                                            <div v-for="(rol, index) in listaRolesInternos">
                                                <v-list-item :key="rol.fields.nombre">
                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="rol.fields.nombre"></v-list-item-title>
                                                    </v-list-item-content>

                                                    <v-list-item-action>
                                                        <v-btn outlined :loading="importando" @click="importarRoles(rol)" color="indigo">
                                                            Importar
                                                        </v-btn>
                                                    </v-list-item-action>
                                                </v-list-item>

                                                <v-divider
                                                    v-if="index < listaRolesInternos.length - 1"
                                                    :key="index"
                                                ></v-divider>
                                            </div>
                                        </v-list-item-group>
                                    </v-list>
                                </v-expansion-panel-content>
                            </div>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                        <v-btn
                            color="grey darken-2"
                            text
                            @click="dialogImportar = false"
                        >
                            Cerrar
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

    </LayoutDefault>
  </template>
  
  <script>
  import { codigosPermisosInternos, nombresPermisosInternos } from '@/helpers/permisosInternos.js'
  import LayoutDefault from '@/layouts/Default.vue';
  
  export default {
    name: 'HomeView',
    data() {
        return {
            idProyecto: this.$route.params.idProyecto,
            listaRoles: [],
            codigosPermisosInternos: [],
            nombresPermisosInternos: [],
            
            dialog: false,
            rolSeleccionado: null,
            permisosDelRol: [],
            listaPermisosSeleccionados: [],
            datosActualizadosRol: {
                nombre: '',
                descripcion: '',
            },

            dialogCreacion: false,
            datosRolNuevo: {
                nombre: '',
                descripcion: '',
                listaPermisosSeleccionados: [],
            },

            dialogEliminacion: false,
            datosRolEliminacion: null,
            confirmacionEliminacionRol: '',

            processing: {
                value: false,
                message: '',
            },

            dialogImportar: false,
            importando: false,
            listaProyectos: [],
            listaRolesInternos: [],

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
                    text: 'Roles internos',
                    disabled: true,
                    href: '',
                },
            ],

        }
    },
    components: {
        LayoutDefault,
    },

    methods: {
        openDialogVerRol (data) {
            this.dialog = true
            this.rolSeleccionado = data
            this.datosActualizadosRol.nombre = this.rolSeleccionado.nombre
            this.datosActualizadosRol.descripcion = this.rolSeleccionado.descripcion
        },
        openDialogEliminarRol (data) {
            this.dialogEliminacion = true
            this.datosRolEliminacion = data
            this.confirmacionEliminacionRol = ''
        },

        async eliminarRol () {
            const uidRolEliminacion = this.datosRolEliminacion.uid
            this.dialogEliminacion = false

            this.processing = {
                value: true,
                message: `Eliminando rol.`,
            }

            try {
                const idToken = this.$store.state.usuario.idToken

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                await this.axios.delete(`/rol/?id=${uidRolEliminacion}&tipoRol=Interno`, config)

                this.inicializar()

                this.dialogEliminacion = false

            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
                console.log('error', error)

            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },
        async crearRol () {
            this.processing = {
                value: true,
                message: `Creando rol.`,
            }

            try {
                const permisos = []
                for (let i = 0; i < this.datosRolNuevo.listaPermisosSeleccionados.length; i++) {
                    const element = this.datosRolNuevo.listaPermisosSeleccionados[i]
                    if (element) permisos.push(this.codigosPermisosInternos[i])
                }

                const idToken = this.$store.state.usuario.idToken

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const body = {
                    idProyecto: this.idProyecto,
                    nombre: this.datosRolNuevo.nombre,
                    descripcion: this.datosRolNuevo.descripcion,
                    tipo: 'Interno',
                    permisos: permisos
                }

                const response = await this.axios.post(`/rol/`, body, config)
                
                this.listaRoles.push({
                    uid: response.data[0].pk,
                    ...response.data[0].fields,
                })

                this.dialogCreacion = false

            } catch (error) {
                if (error.response) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
                
                console.log('error', error.response.data)

            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },
        async actualizarDatos () {
            this.processing = {
                value: true,
                message: `Actualizando datos.`,
            }

            try {
                const idToken = this.$store.state.usuario.idToken

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const body1 = {
                    id: this.rolSeleccionado.uid,
                    idProyecto: this.idProyecto,
                    nombreNuevo: this.datosActualizadosRol.nombre,
                    descripcionNueva: this.datosActualizadosRol.descripcion,
                    tipo: 'Interno',
                    accion: '',
                    permisos: []
                }
                
                await this.axios.put(`/rol/`, body1, config)

                this.rolSeleccionado.nombre = this.datosActualizadosRol.nombre
                this.rolSeleccionado.descripcion = this.datosActualizadosRol.descripcion
            
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
                console.log('error', error)

            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },
        async actualizarPermisosDelRol () {
            this.processing = {
                value: true,
                message: `Actualizando permisos del rol ${this.rolSeleccionado.nombre}.`,
            }

            try {
                const listaPermisosSeleccionadosActual = this.getListaPermisosSeleccionados()

                const idToken = this.$store.state.usuario.idToken

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const idsPermisoAdd = []
                const idsPermisoDelete = []
                for (let i = 0; i < listaPermisosSeleccionadosActual.length; i++) {
                    const elementActual = listaPermisosSeleccionadosActual[i]
                    const elementNuevo = this.listaPermisosSeleccionados[i]

                    if (elementNuevo) {
                        idsPermisoAdd.push( this.codigosPermisosInternos[i] )
                    }
                    
                    if (elementActual && !elementNuevo) {
                        idsPermisoDelete.push( this.codigosPermisosInternos[i] )
                    }
                }

                // Eliminacion de roles
                const body2 = {
                    id: this.rolSeleccionado.uid,
                    idProyecto: this.idProyecto,
                    nombreNuevo: '',
                    descripcionNueva: '',
                    tipo: 'Interno',
                    accion: 'eliminar',
                    permisos: idsPermisoDelete
                }
                
                await this.axios.put(`/rol/`, body2, config)

                // Agregar roles
                const body1 = {
                    id: this.rolSeleccionado.uid,
                    idProyecto: this.idProyecto,
                    nombreNuevo: '',
                    descripcionNueva: '',
                    tipo: 'Interno',
                    accion: 'agregar',
                    permisos: idsPermisoAdd
                }
                
                await this.axios.put(`/rol/`, body1, config)
                    
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
                console.log('error', error)

            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
            
        },
        getListaPermisosSeleccionados () {
            const listaPermisosSeleccionadosAux = Array.from({length: this.codigosPermisosInternos.length}, (v, i) => false)
            for (let i = 0; i < this.codigosPermisosInternos.length; i++) {
                const permiso = this.codigosPermisosInternos[i]
                listaPermisosSeleccionadosAux[i] = !!this.permisosDelRol.find(v => {
                    return permiso.includes(v.codename)
                })
            }

            return listaPermisosSeleccionadosAux
        },
        async buscarRoles(proyecto){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            try {
                const response = await this.axios.get(`/rol/listar?tipo=Internos&idproyecto=${proyecto.pk}&obtener=Todos`, config)

                this.listaRolesInternos = response.data
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
            }
        },

        async importarRoles( rol ){

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const body = {
                idProyectoActual: this.idProyecto,
                idRol: rol.pk,
            }
            try {
                const response = await this.axios.post(`/proyecto/importar_roles`, body, config)

                this.dialogImportar = false
                alert("Roles importados")
                this.inicializar()
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
            }
 
        },
        async inicializar(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            try {
                // Listar roles internos
                const response = await this.axios.get(`/rol/listar?tipo=Internos&idproyecto=${this.idProyecto}`, config)
                const listaResponse = response.data

                this.listaRoles = listaResponse
                .map(v => {
                    const model = {
                        uid: v.pk,
                        ...v.fields,
                    }

                    return model
                })

                // Listar todos los permisos
                this.codigosPermisosInternos = codigosPermisosInternos
                this.nombresPermisosInternos = nombresPermisosInternos

                const listaPermisosSeleccionadosAux = Array.from({
                    length: this.codigosPermisosInternos.length
                }, (v, i) => false)

                this.datosRolNuevo = {
                    nombre: '',
                    descripcion: '',
                    listaPermisosSeleccionados: listaPermisosSeleccionadosAux,
                }
                
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
            }

            
        },
        sePuedeEliminar(){
            if(this.listaRoles <= 1) return true
            return false
        }
    },
    watch: {
        rolSeleccionado: async function () {
            if (!this.rolSeleccionado) return

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            try {
                const response = await this.axios.get(`/rol/?id=${this.rolSeleccionado.uid}&tipo=Interno`, config)
                this.permisosDelRol = response.data
                .filter(v => v.model !== 'roles.rol')
                .map(v => {
                    return {
                        uid: v.pk,
                        ...v.fields,
                    }
                })
                this.listaPermisosSeleccionados = this.getListaPermisosSeleccionados()
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
            }
            
        },
        dialog: function () {
            if (this.dialog) return 
            this.rolSeleccionado = null
            this.permisosDelRol = []
            this.listaPermisosSeleccionados = []

            this.datosActualizadosRol = {
                nombre: '',
                descripcion: '',
            }
        },
        dialogCreacion: function () {
            const listaPermisosSeleccionadosAux = Array.from({
                length: this.codigosPermisosInternos.length
            }, (v, i) => false)

            this.datosRolNuevo = {
                nombre: '',
                descripcion: '',
                listaPermisosSeleccionados: listaPermisosSeleccionadosAux,
            }
        },
        dialogEliminacion: function () {
            if (this.dialogEliminacion) return 
            this.datosRolEliminacion = null
            this.confirmacionEliminacionRol = ''
        },
        dialogImportar: async function () {
            if (!this.dialogImportar) return 

            // traermos todos los proyectos
            // buscamos todos proyectos del usuario
            let idToken = this.$store.state.usuario.idToken
            // llamamos al backend y solicitamos lo proyectos del usuario
            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            try {

                let res = await this.axios.get('/proyectos/', config)

                this.listaProyectos = res.data
                
            } catch (error) {
                if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
            }

            
        },
        

    },
    async created () {
        await this.inicializar()
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


