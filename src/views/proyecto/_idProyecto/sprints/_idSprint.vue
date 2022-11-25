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
            <h3>Datos de Sprint</h3>
            <div v-if="sprint">
                <v-btn class="blue--text mr-2 mb-2" outlined 
                v-if="$store.getters['usuario/getPermisosProyecto'].includes('agregar_miembro_sprint')"
                :disabled="sprint.fields.estado !== 'Planificación'"
                v-on:click="dialogAgregarMiembro=true">
                    Agregar Miembro
                </v-btn>
                <v-btn class="blue--text mr-2 mb-2" outlined 
                v-on:click="$router.push(`/proyecto/${idProyecto}/sprints/${idSprint}/sprint-backlog`)"
                :disabled="desabilitadoIniciar()">
                    sprint Backlog
                </v-btn>
                <v-btn class="blue--text mr-2 mb-2" outlined 
                :disabled="sprint.fields.estado !== 'En Ejecución'"
                v-on:click="$router.push(`/proyecto/${idProyecto}/sprints/${idSprint}/tableros`)">
                    Ver Tableros
                </v-btn>
                <v-btn class="blue--text mr-2 mb-2" outlined 
                
                v-if="sprint.fields.estado === 'Creado' && $store.getters['usuario/getPermisosProyecto'].includes('actualizar_sprint')"
                v-on:click="avanzarSprint()"
                >
                    Planificar Sprint
                </v-btn>

                <v-btn class="blue--text mr-2 mb-2" outlined 
                v-if="sprint.fields.estado === 'En Ejecución' && $store.getters['usuario/getPermisosProyecto'].includes('actualizar_sprint')" 
                v-on:click="avanzarSprint()"
                >
                    Finalizar Sprint
                </v-btn>

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

                <v-text-field
                v-model="sprint.fields.fecha_inicio"
                :readonly="true"
                label="Fecha Inicio"
                required
                ></v-text-field>

                <v-text-field
                v-model="sprint.fields.fecha_fin"
                :readonly="true"
                label="Fecha Fin"
                required
                ></v-text-field>

                <v-text-field
                v-model="sprint.fields.estado"
                :readonly="true"
                label="Estado"
                required
                ></v-text-field>

                <v-text-field
                v-model="sprint.fields.capacidadEquipo"
                :readonly="true"
                label="Capacidad del Equipo"
                required
                ></v-text-field>
            </div>
            <div class="container text-right">
                    <v-btn 
                    outlined 
                    v-if="sprint && $store.getters['usuario/getPermisosProyecto'].includes('actualizar_sprint')"
                    :disabled="estaDeshabilitadoActualizar()" 
                    @click="actualizarSprint()" 
                    color="indigo">
                        Actualizar Datos
                    </v-btn>
                </div>

            <h3 class="mt-4">Equipo</h3>
            <div v-if="listaEquipo" class="mb-10">
                <v-simple-table >
                    <thead>
                        <tr>
                            <th class="text-left">
                                Email
                            </th>
                            <th class="text-left">
                                Capacidad
                            </th>
                            <th class="text-left">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="miembro in listaEquipo" :key="miembro.pk">
                            <td>{{ miembro.fields.email }}</td>
                            <td>{{ miembro.capacidad }}</td>
                            <td>
                                <v-btn class="mr-3" fab dark x-small color="green"
                                    :disabled="sprint.fields.estado !== 'Planificación'"
                                v-if="$store.getters['usuario/getPermisosProyecto'].includes('modificar_miembro_sprint')"
                                    @click="openDialogActualizarMiembro(miembro)">
                                    <v-icon dark>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mr-3" fab dark x-small 
                                v-if="$store.getters['usuario/getPermisosProyecto'].includes('borrar_miembro_sprint')"
                                :disabled="sprint.fields.estado !== 'Planificación'"
                                color="red" 
                                @click="openDialogEliminarMiembro(miembro)">
                                    <v-icon dark>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
            
            <v-dialog
                v-model="dialogAgregarMiembro"
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
                            @click="dialogAgregarMiembro = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Nuevo miembro del equipo
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-combobox
                        v-model="miembro"
                        :items="listaParticipantesCorreos"
                        label="Miembro asignado al equipo del sprint"
                        outlined
                        dense
                        ></v-combobox>

                        <v-text-field
                        v-model="capacidad"
                        label="Capacidad"
                        required
                        ></v-text-field>

                        <v-btn
                            @click="agregarMiembro()"
                            class="mt-3 mr-2"
                            outlined
                            color="blue"
                            :disabled="!miembro || !capacidad"
                        >
                            Agregar
                        </v-btn>

                    </div>
                    
                </v-card>
            </v-dialog>

            <v-dialog
                v-if="miembroSeleccionado"
                v-model="dialogActualizarMiembro"
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
                            @click="dialogActualizarMiembro = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Actualizar miembro del equipo
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-text-field
                        readonly
                        v-model="miembroSeleccionado.fields.email"
                        label="Correo"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="capacidad"
                        label="Capacidad"
                        required
                        ></v-text-field>

                        <v-btn
                            @click="actualizarMiembro()"
                            class="mt-3 mr-2"
                            outlined
                            color="blue"
                            :disabled=" !capacidad || capacidad === miembroSeleccionado.capacidad"
                        >
                            Actualizar Miembro
                        </v-btn>

                    </div>
                    
                </v-card>
            </v-dialog>

                <!-- dialog de eliminar-->
            <v-dialog
                v-model="dialogEliminarMiembro"
                v-if="miembroSeleccionado"
                max-width="800px"
            >
                <v-card>
                    <v-card-title class="informacionAccion textoInformacionAccion">
                        ¿Quieres eliminar este Miembro?
                    </v-card-title>
                    <v-card-text class="informacionAccion textoInformacionAccion">
                        Esta acción eliminará el Miembro del equipo de este sprint de forma permanente.
                    </v-card-text>
                    <v-card-text class="mt-5">
                        Para confirmar que deseas eliminar este miembro, escribe su correo: 
                        <b>{{ miembroSeleccionado.fields.email }}</b>
                    </v-card-text>

                    <div class="container text-center" max-width="400px">
                        <v-text-field
                            class="inputConfirmacionAccion"
                            v-model="confirmacionEliminacionMiembro"
                            :label="`Escribe: ${miembroSeleccionado.fields.email}`"
                            required
                        ></v-text-field>
                    </div>

                    <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                        <v-btn
                            class="ml-4 mr-3"
                            :disabled="confirmacionEliminacionMiembro !== miembroSeleccionado.fields.email"
                            color="red"
                            text
                            @click="eliminarMiembro"
                        >
                            Eliminar Miembro
                        </v-btn>

                        <v-btn
                            color="grey darken-2"
                            text
                            @click="dialogEliminarMiembro = false"
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
            idSprint:0,
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
                    text: `Sprints`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints`,
                },
                {
                    text: `Sprint ${this.$route.params.idSprint}`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}`,
                },
            ],
            idToken: '',
            config: null,

            sprint: null,
            listaEquipo: null,
            sprintBacklog: null,

            // datos de equipo
            dialogAgregarMiembro: false,
            miembroSeleccionado: null,
            dialogActualizarMiembro: false,
            dialogEliminarMiembro: false,
            confirmacionEliminacionMiembro:'',

            listaParticipantes:[],
            listaParticipantesCorreos:[],
            listaParticipantesID:[],

            miembro:'',
            capacidad:0,

            nombre:'',
            descripcion:'',
            cantidadDias:'',

            historiaSeleccionada: null,
            dialogVerHistoria: false,

        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.idSprint = this.$route.params.idSprint
        this.idToken = this.$store.state.usuario.idToken

        this.config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.idToken}`
            }
        }
        await this.obtenerParticipantes()
        await this.obtenerSprint()
        await this.obtenerEquipo()

        this.obtenerParticipantesSinEquipo()
        
        
    },
    methods:{
        async obtenerSprint(){
            try {
                let res = await axios.get(`/sprints/?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, this.config)
                this.sprint = res.data[0]
                this.nombre = this.sprint.fields.nombre
                this.descripcion = this.sprint.fields.descripcion
                this.cantidadDias = this.sprint.fields.cantidadDias
                this.sprint.fields.fecha_inicio = this.sprint.fields.fecha_inicio ? new Date(this.sprint.fields.fecha_inicio).toLocaleString() : ''
                this.sprint.fields.fecha_fin = this.sprint.fields.fecha_fin ? new Date(this.sprint.fields.fecha_fin).toLocaleString() : ''

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        async obtenerEquipo(){
            try {
                let listaEquipo = []
                let res = await axios.get(`/sprints/equipo?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, this.config)
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    const pos = this.listaParticipantes.map(e => e.pk).indexOf(element.fields.usuario);
                    listaEquipo.push({
                        ...this.listaParticipantes[pos], 
                        capacidad: element.fields.capacidad,
                        id: element.pk
                    })
                }

                this.listaEquipo = listaEquipo

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        
        async obtenerParticipantes(){
            // get lista de participantes
            const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, this.config)
            this.listaParticipantes = responseParticipantes.data

            // get id participantes
            const responseParticipantesId = await axios.get(`/proyecto/listar-participantes-id?idproyecto=${this.idProyecto}`, this.config)
            this.listaParticipantesID = responseParticipantesId.data
        },

        obtenerParticipantesSinEquipo(){
            this.listaParticipantesCorreos = []
            if(this.listaEquipo){
                for (const participante of this.listaParticipantes) {
                    const pos = this.listaEquipo.map(e => e.fields.email).indexOf(participante.fields.email);
                    if(pos === -1 )
                        this.listaParticipantesCorreos.push(participante.fields.email)
                }
            }
        },

        async actualizarSprint(){

            const body = {
                idSprint: this.idSprint,
                nombre: this.nombre,
                descripcion: this.descripcion,
                idProyecto: this.idProyecto,
                cantidadDias:this.cantidadDias
            }
            
            try {
                await this.axios.put(`/sprints/`, body, this.config)

                alert("Sprint Actualizado")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
                
        },
        

        async agregarMiembro(){
            // buscamos la id
            const pos = this.listaParticipantes.map(e => e.fields.email).indexOf(this.miembro);

            const body = {
                proyecto_id: this.idProyecto,
                sprint_id: this.idSprint,
                usuario_id: this.listaParticipantes[pos].pk,
                capacidad: this.capacidad,
            }

            try{

                const response = await this.axios.post(`/sprints/equipo`, body, this.config)
                this.obtenerSprint()
                alert("Miembro agregado")

            } catch (error) {

                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }

            } finally {
                this.miembro = ''
                this.capacidad = 0
                await this.obtenerEquipo()
                this.obtenerParticipantesSinEquipo()
            }
        },

        async actualizarMiembro(){
            // falta
            const body = {
                proyecto_id: this.idProyecto,
                sprint_id: this.idSprint,
                miembro_equipo_id:this.miembroSeleccionado.id,
                capacidad: this.capacidad
            }
            
            try {
                await this.axios.put(`/sprints/equipo`, body, this.config)
                this.obtenerSprint()
                alert("Miembro Actualizado")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            } finally {
                this.dialogActualizarMiembro = false
                this.capacidad = 0
                await this.obtenerEquipo()
            }
                
        },

        async eliminarMiembro(){
            try {
                await this.axios.delete(`/sprints/equipo?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}&idMiembroEquipo=${this.miembroSeleccionado.id}`, this.config)
                this.obtenerSprint()
                alert("Miembro Eliminado")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            } finally {
                this.dialogEliminarMiembro = false
                this.confirmacionEliminacionMiembro = ''
                await this.obtenerEquipo()
                this.obtenerParticipantesSinEquipo()
            }
        },
        async avanzarSprint(){
            const body = {
                idProyecto: this.idProyecto,
                idSprint: this.idSprint,
                opcion: 'Avanzar',
            }
            
            try {
                await this.axios.put(`/sprints/estado`, body, this.config)

                if(this.sprint.fields.estado == 'Planificación'){
                    alert("Sprint Iniciado")
                } else if (this.sprint.fields.estado == 'Creado'){
                    alert("Sprint en Planificación")
                } else {
                    alert("Sprint Finalizado")
                }

                this.obtenerSprint()
                
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        openDialogActualizarMiembro(data){
            this.miembroSeleccionado = data
            this.capacidad = this.miembroSeleccionado.capacidad
            this.dialogActualizarMiembro = true
        },

        openDialogEliminarMiembro(data){
            this.miembroSeleccionado = data
            this.dialogEliminarMiembro = true
        },

        desabilitadoIniciar(){
            if(this.listaEquipo) return false
            return true
        },
        estaDeshabilitadoActualizar(){

            if (this.sprint.fields.estado !== 'Planificación') return true

            if( !this.nombre || !this.descripcion || !this.cantidadDias) return true

            if (this.sprint.fields.nombre === this.nombre &&
            this.sprint.fields.descripcion ===  this.descripcion &&
            this.sprint.fields.cantidadDias === this.cantidadDias) return true

            return false
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