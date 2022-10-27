<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-container v-if="tipoHU">
            <h3>Tipo Historia de Usuario: {{tipoHU.fields.nombre}}</h3>

            <v-row class="mt-3">
                <v-col v-for="(columna,indexC) of columnasNombres" :key="indexC">
                    <v-container style="background-color: aqua; border-radius: 0.4rem;">
                        <h4>{{columna}}</h4>
                        <div v-for="historia in historiasUsuarios">
                            <div v-if="historia.status == columna">

                                <v-card
                                    color="blue"
                                    max-width="250"
                                    dark
                                    class="mt-2 mb-2"
                                >
                                    <v-container>
                                        <p>{{historia.fields.nombre}}</p>
                                        <p>{{historia.fields.descripcion}}</p>
                                        <v-btn
                                        class="ma-2"
                                        outlined
                                        small
                                        color="white"
                                        @click="openDialogActualizarHoras(historia)"
                                        ><v-icon>mdi-pencil</v-icon></v-btn>
                                        <v-btn
                                        class="ma-2"
                                        outlined
                                        small
                                        color="white"
                                        :disabled="indexC === 0"
                                        @click="actualizarHistoriaColumna(false, historia, indexC)"
                                        ><v-icon>mdi-arrow-left</v-icon></v-btn>
                                        <v-btn
                                        class="ma-2"
                                        outlined
                                        small
                                        color="white"
                                        :disabled="indexC + 1 === columnas.length"
                                        @click="actualizarHistoriaColumna(true, historia, indexC)"
                                        ><v-icon>mdi-arrow-right</v-icon></v-btn>
                                    </v-container>
                                </v-card>

                            
                            </div>
                        </div>
                    </v-container>
                </v-col>
            </v-row>





            <v-dialog
                    v-model="dialogActualizarHoras"
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
                            @click="dialogActualizarHoras = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Actualizar horas trabajadas
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-text-field v-model="horas" label="Horas trabajadas" required></v-text-field>
                        <v-btn
                            @click="actualizarHoras()"
                            class="mt-3 mr-2"
                            outlined
                            color="green"
                            :disabled="!horas"
                        >
                            Actualizar horas trabajadas
                        </v-btn>

                    </div>
                    
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
            idSprint: 0,
            idTipoHU: 0,
            proyecto: null,

            tipoHU: null,

            columnasObjetos: [],
            columnasNombres: [],
            historiasUsuarios: [],

            horas: 0,

            historiaSleccionada: null,
            dialogActualizarHoras: false,

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
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}`,
                },
                {
                    text: 'Tableros',
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}/tableros`,
                },
                {
                    text: `${this.$route.params.idTipoHU}`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}/tableros/${this.$route.params.idTipoHU}`,
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
        this.idSprint = this.$route.params.idSprint

        await this.inicializarLista()

    },

    methods: {
        async inicializarLista() {
            let idToken = this.$store.state.usuario.idToken

            this.columnas = []
            this.columnasNombres = []
            this.columnasObjetos = []
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }
            try {
                // obtenemos las columnas
                let res = await axios.get(`/tipoHistoriaUsuario/tipoHU?idproyecto=${this.idProyecto}&id=${this.idTipoHU}`, config)

                this.tipoHU = res.data[0]
                this.nombreTipoHU = this.tipoHU.fields.nombre

                for (let i = 1; i < res.data.length; i++) {
                    const columna = res.data[i];
                    this.columnasObjetos.push(columna)
                }
                this.columnasObjetos.sort((a, b) => a.fields.orden - b.fields.orden);

                for (let i = 0; i < this.columnasObjetos.length; i++) {
                    this.columnasNombres.push(this.columnasObjetos[i].fields.nombre)
                }

                // obtenemos las historias de usuarios
                this.obtenerHistoriasUsuarios()

            } catch (error) {
                console.log("error", error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }

        },

        async obtenerHistoriasUsuarios(){
            let idToken = this.$store.state.usuario.idToken
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }
            try {
                // obtenemos las columnas
                let res = await axios.get(`/sprints/backlog/listar-por-tipo?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}&idTipoHU=${this.idTipoHU}`, config)
                this.historiasUsuarios = res.data

                for (let i = 0; i < this.historiasUsuarios.length; i++) {
                    
                    this.historiasUsuarios[i].id = this.historiasUsuarios[i].pk

                    if(this.historiasUsuarios[i].fields.estado === null){

                        this.historiasUsuarios[i].status = this.columnasNombres[0]

                    } else if (this.historiasUsuarios[i].fields.estado === 'finalizada'){

                        this.historiasUsuarios[i].status = this.columnasNombres[this.columnasNombres.length-1]

                    } else if (this.historiasUsuarios[i].fields.estado === 'cancelada'){
                        
                        // ver caso


                    } else {
                        // hallamos el nombre de la columna
                        const idColumna = Number(this.historiasUsuarios[i].fields.estado)
                        const pos = this.columnasObjetos.map(e => e.pk).indexOf(idColumna);
                        this.historiasUsuarios[i].status = this.columnasNombres[pos]
                    }
                    console.log('this.historiasUsuarios',this.historiasUsuarios)
 
                }
            } catch (error) {
                console.log("error",error)
            }
        },
        async actualizarHoras(){
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
                idHistoria: this.historiaSleccionada.pk,
                estado: null,
                nombre: null,
                descripcion: null,
                prioridad_tecnica: null,
                prioridad_negocio: null,
                estimacion_horas: null,
                idTipo: null,
                idParticipante: null,
                horas_trabajadas: this.horas,
                estimacion: null,
            }
            
            try {
                const response = await this.axios.put(`/historiasUsuario/`, body, config)
                this.historiaSleccionada.fields.horas_trabajadas = this.horas
                alert("Horas actualizadas")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        openDialogActualizarHoras(historia){
            this.historiaSleccionada = historia
            this.horas = historia.fields.horas_trabajadas
            this.dialogActualizarHoras = true
        },

        async actualizarHistoriaColumna(avanzar, historia, posColumna){

            const columnaAIr = this.columnasObjetos[avanzar ? posColumna + 1 : posColumna - 1 ]

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
                idHistoria: historia.pk,
                estado: columnaAIr.pk,

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
                this.obtenerHistoriasUsuarios()
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

