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
            <h3>Configuración del proyecto</h3>

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
            :readonly="true"
            label="Correo Scrum Master Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="fechaInicio"
            :readonly="true"
            label="Fecha Inicio del Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="fechaFin"
            :readonly="true"
            label="Fecha Fin del Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="estado"
            :readonly="true"
            label="Estado del Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="proyecto.fields.motivCancelacion"
            v-if="estado === 'cancelado'"
            :readonly="true"
            label="Motivo de cancelación"
            required
            ></v-text-field>

            <div class="container text-right">
                <v-btn
                class="ma-2"
                outlined
                :disabled="!nombre || !descripcion || (
                    proyecto.fields.nombre === nombre &&
                    proyecto.fields.descripcion === descripcion)
                    || proyecto.fields.estado === 'cancelado'
                    || proyecto.fields.estado === 'Finalizado'"
                @click="actualizar()"
                v-if="$store.getters['usuario/getPermisosProyecto'].includes('actualizar_proyecto')"
                color="indigo">
                Actualizar Proyecto
                </v-btn>
            </div>

            <h4>Ajustes</h4>
            <v-btn
            class="mt-2 mr-2"
            outlined
            :disabled="proyecto.fields.estado === 'cancelado' || proyecto.fields.estado === 'Finalizado'"
            @click="dialogEliminarProyecto=true"
            v-if="$store.getters['usuario/getPermisosProyecto'].includes('eliminar_proyecto')"
            color="red">
            Cancelar Proyecto
            </v-btn>
            <v-btn
            class="mt-2"
            outlined
            :disabled="proyecto.fields.estado === 'cancelado' || proyecto.fields.estado === 'Finalizado'"
            @click="dialogFinalizarProyecto=true"
            v-if="$store.getters['usuario/getPermisosProyecto'].includes('finalizar_proyecto')"
            color="green">
            Finalizar Proyecto
            </v-btn>

            <!-- dialog de eliminar-->
            <v-dialog
                v-model="dialogEliminarProyecto"
                v-if="proyecto"
                max-width="800px"
            >
                <v-card>
                    <v-card-title class="informacionAccion textoInformacionAccion">
                        ¿Quieres cancelar este Proyecto?
                    </v-card-title>
                    <v-card-text class="informacionAccion textoInformacionAccion">
                        Esta acción cancelará el Proyecto de forma permanente.
                    </v-card-text>
                    <v-card-text class="mt-5">
                        Para confirmar que deseas cancelar este Proyecto, escribe su nombre: 
                        <b>{{ proyecto.fields.nombre }}</b>
                    </v-card-text>

                    <div class="container text-center" max-width="400px">
                        <v-text-field
                            class="inputConfirmacionAccion"
                            v-model="confirmacionEliminacionProyecto"
                            :label="`Escribe: ${proyecto.fields.nombre}`"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="mensajeCancelacion"
                            class="inputConfirmacionAccion"
                            :label="`Escribe el motivo de cancelación`"
                            required
                        ></v-text-field>
                    </div>

                    <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                        <v-btn
                            class="ml-4 mr-3"
                            :disabled="confirmacionEliminacionProyecto !== proyecto.fields.nombre || !mensajeCancelacion"
                            color="red"
                            text
                            @click="cancelarProyecto()"
                        >
                            Cancelar Proyecto
                        </v-btn>

                        <v-btn
                            color="grey darken-2"
                            text
                            @click="dialogEliminarProyecto = false"
                        >
                            Cerrar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- dialog de eliminar-->
            <v-dialog
                v-model="dialogFinalizarProyecto"
                v-if="proyecto"
                max-width="800px"
            >
                <v-card>
                    <v-card-title class="informacionAccionF textoInformacionAccionF">
                        ¿Quieres finalizar este Proyecto?
                    </v-card-title>
                    <v-card-text class="informacionAccionF textoInformacionAccionF">
                        Esta acción finalizara el Proyecto de forma permanente y queda en modo lectura para sus participantes.
                    </v-card-text>

                    <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                        <v-btn
                            class="ml-4 mr-3"
                            color="green"
                            text
                            @click="finalizarProyecto()"
                        >
                            Finalizar Proyecto
                        </v-btn>

                        <v-btn
                            color="grey darken-2"
                            text
                            @click="dialogFinalizarProyecto = false"
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
                    text: 'Configuración',
                    disabled: true,
                    href: '/configuracion',
                },
            ],

            nombre: "",
            descripcion: "",
            fechaInicio: null,
            fechaFin: null,
            estado:"",
            scrumMaster: "",

            confirmacionEliminacionProyecto: '',
            dialogEliminarProyecto: false,
            mensajeCancelacion: '',

            dialogFinalizarProyecto: false,

        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.cargarDatos()

    },
    methods:{
        async cargarDatos(){
            let idToken = this.$store.state.usuario.idToken


            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`proyecto/?q=${this.idProyecto}`, config)

                let proyecto = res.data[0]
                this.proyecto = proyecto

                this.nombre = proyecto.fields.nombre
                this.descripcion = proyecto.fields.descripcion
                this.fechaInicio = proyecto.fields.fechaInicio ? new Date(proyecto.fields.fechaInicio).toLocaleString() : null
                this.fechaFin = proyecto.fields.fechaFin ? new Date(proyecto.fields.fechaFin).toLocaleString() : null
                this.estado = proyecto.fields.estado
                this.buscarCorreo(proyecto.fields.scrumMaster)
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
        async actualizar(){
            
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            const body1 = {
                id: this.idProyecto,
                nombre: this.nombre,
                descripcion:this.descripcion
            }
            
            try {
                await this.axios.put(`/proyecto/`, body1, config)

                alert("Proyecto Actualizado")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
                
        },
        async cancelarProyecto(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            let mensaje = this.mensajeCancelacion.replaceAll(' ','%20')
            
            try {
                await this.axios.delete(`/proyecto/?idProyecto=${this.idProyecto}&mensaje=${mensaje}`, config)

                alert("Proyecto Cancelado")
                this.cargarDatos()
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        async buscarCorreo(idParticipante){
            
            try {
                const idToken = this.$store.state.usuario.idToken
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const responseUsuario = await axios.get(`/usuario/existe?id=${idParticipante}`, config)

                let usuario = responseUsuario.data[0]
                this.scrumMaster = usuario.fields.email
          
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        async finalizarProyecto(){
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
                
                let res = await this.axios.put(`/proyecto/finalizarProyecto`, body1, config)
                alert("Proyecto Finalizado")
                this.dialogFinalizarProyecto = false
                this.cargarDatos()

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

<style scoped>
.informacionAccion {
    /* rgba(230, 62, 62, 0.159) */
    background-color: rgba(255, 29, 137, 0.159);
}

.textoInformacionAccion {
    color: rgb(197, 52, 52);
}

.informacionAccionF {
    /* rgba(230, 62, 62, 0.159) */
    background-color: rgba(29, 255, 131, 0.159);
}

.textoInformacionAccionF {
    color: rgb(57, 197, 52);
}

.inputConfirmacionAccion {
    margin-left: 12px;
    margin-right: 12px;
}
</style>