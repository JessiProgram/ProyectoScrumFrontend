<template>
    <LayoutDefault>

        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        
        
    <div class="container" v-if="historia">
        <h3>Historia de usuario</h3>
        <v-row class="mt-3 mb-3">
            <v-col cols="12" md="6">
                <h3>Nombre de la historia de usuario:</h3>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.nombre" :readonly="true"
                    label="Nombre de la historia de usuario" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <h3>Descripción de la historia de usuario:</h3>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.descripcion" :readonly="true"
                    label="Descripción de la historia de usuario" required></v-text-field>
            </v-col>
        </v-row>
        <v-row class="mt-3 mb-3">
            <v-col cols="12" md="4">
                <h4>Prioridad tecnica de la historia de usuario:</h4>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.prioridad_tecnica" :readonly="true"
                    label="Prioridad tecnica de la historia de usuario" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <h4>Prioridad de negocio de la historia de usuario:</h4>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.prioridad_negocio" :readonly="true"
                    label="Prioridad de negocio de la historia de usuario" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <h4>Estimacion en horas de la historia de usuario:</h4>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.estimacion_horas" :readonly="true"
                    label="Estimacion en horas de la historia de usuario" required></v-text-field>
            </v-col>
        </v-row>
        <v-row class="mt-3 mb-3">
            <v-col>
                <h4>Estado:</h4>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.estadoCadena"
                    label="Estado" required :readonly="true"></v-text-field>
            </v-col>
            <v-col >
                <h4>Horas Trabajadas:</h4>
                <v-divider class="mb-5" />
                <v-text-field v-model="historia.fields.horas_trabajadas"
                    label="Prioridad de negocio de la historia de usuario" required :readonly="true"></v-text-field>
            </v-col>

        </v-row>
        <v-row class="mt-3 mb-3">
            <v-col cols="12" md="6">
                <h4>Participante asignado a la historia de usuario:</h4>
                <v-divider class="mb-5" />
                <v-combobox :readonly="true" v-model="historia.fields.desarrollador_asignado"
                    :items="listaParticipantesCorreos" label="Participante asignado de la historia de usuario"
                    outlined dense></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
                <h4>Tipo de historia de usuario asignado a la historia de usuario:</h4>
                <v-divider class="mb-5" />
                <v-combobox v-model="historia.fields.tipo_historia_usuario" :readonly="true"
                    :items="listaTiposHUNombres"
                    label="Tipo de historia de usuario asignado de la historia de usuario" outlined dense>
                </v-combobox>
            </v-col>
        </v-row>
    </div>
    </LayoutDefault>
</template>

<script>
import axios from '@/plugins/axios'
import LayoutDefault from '@/layouts/Default.vue';

export default {
    name: 'Historia',
    data() {
        return {
            idProyecto: 0,
            idHistoria:-1,
            proyecto:null,
            listaParticipantes: [],
            listaParticipantesID: [],
            listaParticipantesCorreos: [],
            listaTiposHU: [],
            listaTiposHUNombres: [],
            historialSeleccionado: null,
            historia: null,
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
        LayoutDefault
    },

    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.idHistoria = this.$route.params.idHistoria
        
        this.cargarDatos()

    },

    methods: {
        async cargarDatos(){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            this.historiaSeleccionada = (await axios.get(`/historiasUsuario/?idProyecto=${this.idProyecto}&idHistoria=${this.idHistoria}`, config)).data[0]

            try {
                // get estados
                if(this.historiaSeleccionada.fields.estado && this.historiaSeleccionada.fields.estado  !== 'finalizada' && this.historiaSeleccionada.fields.estado !== 'cancelada' && this.historiaSeleccionada.fields.estado !== 'aceptada' && this.historiaSeleccionada.fields.estado !== 'rechazada')
                    await this.obtenerEstado(this.historiaSeleccionada.fields.estado, this.historiaSeleccionada)
                else
                    this.historiaSeleccionada.fields.estadoCadena = this.historiaSeleccionada.fields.estado

                // get lista de participantes
                const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, config)
                this.listaParticipantes = responseParticipantes.data

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

                this.historia = Object.assign({}, this.historiaSeleccionada); 
                this.historiaSeleccionada = null
                this.esIniciar = true

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
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

    },

}
</script>

