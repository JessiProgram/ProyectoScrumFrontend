<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-container v-if="sprint && listaMiembros">
            <h3 class="mb-6">Sprint Backlog</h3>

            <v-btn class="blue--text mr-2 mb-2" outlined 
                v-if="sprint.fields.estado === 'Planificación'"
                v-on:click="avanzarSprint()"
                :disabled="sprintBacklog.length === 0 || !flagMiembrosAsignados">
                    Iniciar Sprint
                </v-btn>
            <v-row class="mt-3">
                <v-col cols="12" md="6">
                    <div v-if="sprint.fields.estado === 'Planificación' || sprint.fields.estado === 'Creado'">
                        <h4>Lista de Historias de Usuarios</h4>
                        <v-simple-table class="mb-5">
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Nombre
                                    </th>
                                    <th class="text-left">
                                        Descripcion
                                    </th>
                                    <th class="text-left">
                                        Participante Asignado
                                    </th>
                                    <th class="text-left">
                                        Pioridad
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
                                <tr v-for="backlog in listaHistorias" :key="backlog.pk">
                                    <td>{{ backlog.fields.nombre }}</td>
                                    <td>{{ backlog.fields.descripcion }}</td>
                                    <td>{{ backlog.fields.desarrollador_asignado_email }}</td>
                                    <td>{{ backlog.fields.prioridad_final }}</td>
                                    <td>{{ backlog.fields.estadoCadena }}</td>
                                    <td>
                                        <v-btn-toggle 
                                            dense
                                            background-color="primary"
                                            dark
                                            multiple>
                                            <v-btn @click="openDialogVerHistoria(backlog)">
                                            <v-icon>mdi-eye</v-icon>
                                            </v-btn>
                                            <v-btn @click="agregarHistoria(backlog)"
                                            v-if="sprint.fields.estado === 'Planificación' || sprint.fields.estado === 'Creado'">
                                            <v-icon>mdi-arrow-right</v-icon>
                                            </v-btn>

                                        </v-btn-toggle>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </div>
                </v-col>

                <v-col cols="12" :md="enPlanificacion">
                <h4>Lista de Historias de Usuarios en el Sprint Backlog</h4>
                <v-simple-table class="mb-5">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Nombre
                            </th>
                            <th class="text-left">
                                Descripcion
                            </th>
                            <th class="text-left">
                                Miembro Asignado
                            </th>
                            <th class="text-left">
                                Pioridad
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
                        <tr v-for="backlog in sprintBacklog" :key="backlog.pk">
                            <td>{{ backlog.fields.nombre }}</td>
                            <td>{{ backlog.fields.descripcion }}</td>
                            <td>{{ verificarMiembro(backlog.fields.desarrollador_asignado_email) ? backlog.fields.desarrollador_asignado_email : '⚠️'}}</td>
                            <td>{{ backlog.fields.prioridad_final }}</td>
                            <td>{{ backlog.fields.estadoCadena }}</td>
                            <td>
                                <v-btn-toggle dense
                                            background-color="primary"
                                            multiple>
                                    <v-btn @click="openDialogVerHistoria(backlog)">
                                    <v-icon>mdi-eye</v-icon>
                                    </v-btn>

                                    <v-btn @click="openDialogActualizar(backlog)" 
                                    v-if="sprint.fields.estado === 'Planificación' || sprint.fields.estado === 'Creado'">
                                    <v-icon>mdi-pencil</v-icon>
                                    </v-btn>

                                    <v-btn @click="quitarHistoria(backlog)"
                                    v-if="sprint.fields.estado === 'Planificación' || sprint.fields.estado === 'Creado'">
                                    <v-icon>mdi-arrow-left</v-icon>
                                    </v-btn>

                                    <v-btn 
                                    @click="$router.push(`/proyecto/${idProyecto}/sprints/${idSprint}/tableros/${backlog.fields.tipo_historia_usuario}`)"
                                    v-if="sprint.fields.estado === 'En Ejecución'">
                                    Ver en Tablero
                                    </v-btn>
                                </v-btn-toggle>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
                </v-col>
            </v-row>
            
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
                        <h4>Estimacion en horas de la historia de usuario:</h4>
                        <v-divider class="mb-5" />
                        <v-text-field
                            v-model="historiaSeleccionada.fields.estimacion_horas"
                            label="Prioridad de negocio de la historia de usuario"
                            required
                        ></v-text-field>

                        <v-row class="mt-3 mb-3">
                            <v-col cols="12" md="6">
                                <h4>Participante asignado a la historia de usuario:</h4>
                                <v-divider class="mb-5" />
                                <v-combobox
                                v-model="historiaSeleccionada.fields.desarrollador_asignado_email"
                                :items="listaMiembrosCorreos"
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

            <v-dialog
                v-if="historiaSeleccionada"
                v-model="dialogVerHistoria"
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
                            @click="dialogVerHistoria = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            Visualizar Historia de Usuario
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <div class="container my-5 px-10">
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.nombre"
                        label="Nombre"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.descripcion"
                        label="Descripcion"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.prioridad_tecnica"
                        label="Prioridad Tecnica"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.prioridad_negocio"
                        label="Prioridad de Negocio"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.estimacion_horas"
                        label="Estimacion horas"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.tipo_historia_usuario"
                        label="Tipo de Historia de Usuario"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.desarrollador_asignado_email"
                        label="Desarrollador Asignado"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.horas_trabajadas"
                        label="Horas Trabajadas"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.prioridad_final"
                        label="Prioridad"
                        required
                        ></v-text-field>
                        <v-text-field
                        readonly
                        v-model="historiaSeleccionada.fields.estadoCadena"
                        label="Estado"
                        required
                        ></v-text-field>
                    </div>
                </v-card>
            </v-dialog>
        </v-container>
        <v-container v-else>
            Debe agregar miembros al equipo del sprint
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
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}`,
                },
                {
                    text: `Sprint Backlog`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}/sprint-backlog`,
                },
            ],
            idToken: '',
            config: null,

            idSprintBacklog: 0,
            sprint: null,
            sprintBacklog: [],

            listaMiembros:[],
            listaMiembrosCorreos:[],
            listaMiembrosID:[],

            listaParticipantes: [],
            listaParticipantesID: [],

            historiaSeleccionada: null,
            dialogVerHistoria: false,

            listaHistorias:[],

            enPlanificacion: 6,

            dialogActualizacion: false,

            listaTiposHU: [],
            listaTiposHUNombres: [],

            flagMiembrosAsignados: false,

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
        this.obtenerSprint()
        await this.obtenerParticipantes()
        await this.obtenerMiembros()
        await this.obtenerSprintBacklog()
        this.obtenerHistoriasUsuarios()
        this.verificarMiembrosAsignados()
        this.obtenerTipoHU()
    },
    methods: {
        async obtenerSprint(){
            try {
                let res = await axios.get(`/sprints/?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, this.config)
                this.sprint = res.data[0]
                this.nombre = this.sprint.fields.nombre
                this.descripcion = this.sprint.fields.descripcion
                this.cantidadDias = this.sprint.fields.cantidadDias
                this.sprint.fields.fecha_inicio = this.sprint.fields.fecha_inicio ? new Date(this.sprint.fields.fecha_inicio).toLocaleString() : ''
                this.sprint.fields.fecha_fin = this.sprint.fields.fecha_fin ? new Date(this.sprint.fields.fecha_fin).toLocaleString() : ''

                if(this.sprint.fields.estado !== 'Planificación' && this.sprint.fields.estado !== 'Creado') this.enPlanificacion = 12
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
            const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, this.config)
            this.listaParticipantes = responseParticipantes.data

            // get id participantes
            const responseParticipantesId = await axios.get(`/proyecto/listar-participantes-id?idproyecto=${this.idProyecto}`, this.config)
            this.listaParticipantesID = responseParticipantesId.data
        },
        async obtenerTipoHU (){
            // get lista tipos hu
            let resTipos = await axios.get(`/tipoHistoriaUsuario/?idproyecto=${this.idProyecto}`, this.config)
            this.listaTiposHU = resTipos.data

            for (const tipoHU of this.listaTiposHU) 
                this.listaTiposHUNombres.push(tipoHU.fields.nombre)  
        },

        async obtenerSprintBacklog(){
            try {

                let res = await axios.get(`/sprints/backlog/?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, this.config)
                this.sprintBacklog = res.data

                for (let i = 0; i < this.sprintBacklog.length; i++) {
                    const element = this.sprintBacklog[i];
                    if(element.fields.desarrollador_asignado){
                        const pos = this.listaMiembrosID.indexOf(element.fields.desarrollador_asignado);
                        this.sprintBacklog[i].fields.desarrollador_asignado_email = this.listaMiembrosCorreos[pos]
                    }

                    if(element.fields.estado && element.fields.estado  !== 'finalizada' && element.fields.estado !== 'cancelada')
                        await this.obtenerEstado(element.fields.estado, element)
                    else
                        this.sprintBacklog[i].fields.estadoCadena = this.sprintBacklog[i].fields.estado
   
                }
                this.sprintBacklog = Object.assign([], this.sprintBacklog)

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
        async obtenerHistoriasUsuarios(){
            try {
                // get historia de usaurios
                const res = await axios.get(`/historiasUsuario/listar?idProyecto=${this.idProyecto}`, this.config)
                let listaHistoriasRes = res.data

                let listaHistoriasAceptadas = []

                for (let i = 0; i < listaHistoriasRes.length; i++) {
                    const historia = listaHistoriasRes[i];

                    let pos = this.sprintBacklog.map(e => e.pk).indexOf(historia.pk);

                    if(historia.fields.estado !== 'finalizada' && historia.fields.estado !== 'cancelada' && pos === -1){
                        if (historia.fields.estado)
                            await this.obtenerEstado(historia.fields.estado, historia)
                        listaHistoriasAceptadas.push(historia)
                    }
                }
                
                console.log('this.listaParticipantesID',this.listaParticipantesID)
                for (let i = 0; i < listaHistoriasAceptadas.length; i++) {
                    const historia = listaHistoriasAceptadas[i];
                    if(historia.fields.desarrollador_asignado){
                        let posParticipante = this.listaParticipantesID.map(e => e.pk).indexOf(historia.fields.desarrollador_asignado);
                        console.log('posParticipante',posParticipante,historia.fields.desarrollador_asignado)
                        listaHistoriasAceptadas[i].fields.desarrollador_asignado_email = this.listaParticipantes[posParticipante].fields.email
                    }
                    
                }

                this.listaHistorias = listaHistoriasAceptadas
                
            } catch (error) {
                console.log(error)
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
        async obtenerMiembros(){
            // get lista de participantes
            const responseMiembros = await axios.get(`/sprints/equipo?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, this.config)
            this.listaMiembros = responseMiembros.data

            // get participantes
            const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, this.config)
            let listaParticipantes = responseParticipantes.data

            this.listaMiembrosID = []

            for (let i = 0; i < this.listaMiembros.length; i++) {
                const element = this.listaMiembros[i];
                this.listaMiembrosID.push(element.fields.usuario)

                let pos = listaParticipantes.map(e => e.pk).indexOf(element.fields.usuario);
                this.listaMiembrosCorreos.push(listaParticipantes[pos].fields.email)
            }
            
        },

        async agregarHistoria(historia){
            try {

                let body = {
                    proyecto_id: this.idProyecto,
                    sprint_id: this.idSprint,
                    idHistoria: historia.pk,
                }
   
                const res = await axios.post(`/sprints/backlog/`, body, this.config)
                
                await this.obtenerSprintBacklog()
                await this.obtenerHistoriasUsuarios()
                this.verificarMiembrosAsignados()
            } catch (error) {
                console.log(error)
                if (error.res.data.length <= 200) {
                    alert(error.res.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        async quitarHistoria(historia){
            
            try {

                let res = await axios.delete(`/sprints/backlog/?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}&idHistoria=${historia.pk}`, this.config)

                await this.obtenerSprintBacklog()
                await this.obtenerHistoriasUsuarios()
                this.verificarMiembrosAsignados()

            } catch (error) {
                console.log(error)
                if (error.res.data.length <= 200) {
                    alert(error.res.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        verificarMiembrosAsignados(){
            let flag = true
            if(!this.sprintBacklog.length) flag = false; 

            for (let i = 0; i < this.sprintBacklog.length; i++) {
                const element = this.sprintBacklog[i];
                if(!element.fields.desarrollador_asignado){ 
                    flag = false; 
                    console.log('flase1', element.fields.desarrollador_asignado)
                    continue
                }
                let pos = this.listaMiembros.map(e => e.fields.usuario).indexOf(element.fields.desarrollador_asignado);
                if(pos === -1) { 
                    flag = false; 
                    console.log('flase2')
                }
            }
            this.flagMiembrosAsignados = flag
        },

        async actualizarHistoria(){
            const idToken = this.$store.state.usuario.idToken

            //obtenemos la id del participante
            let indexParticipante = this.listaMiembrosCorreos.indexOf(this.historiaSeleccionada.fields.desarrollador_asignado_email)
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
                nombre: null,
                descripcion: null,
                prioridad_tecnica: null,
                prioridad_negocio: null,
                estimacion_horas: this.historiaSeleccionada.fields.estimacion_horas,
                idTipo: this.listaTiposHU[indexTipo].pk,
                idParticipante: this.listaMiembros[indexParticipante].fields.usuario,
                horas_trabajadas: null,
                estimacion: this.historiaSeleccionada.fields.estimacion,
                estado: null,
            }
            
            try {
                const response = await this.axios.put(`/historiasUsuario/`, body, config)

                alert("Historia de usuario actualizada")
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
            
        },

        openDialogVerHistoria(data){
            this.historiaSeleccionada = data
            this.dialogVerHistoria = true
        },

        openDialogActualizar(data){
            
            this.historiaSeleccionada = data
            
            // obtenemos el indice
            const indexTipo = this.listaTiposHU.findIndex(object => {
                return object.pk === this.historiaSeleccionada.fields.tipo_historia_usuario;
            });
            this.historiaSeleccionada.fields.tipo_historia_usuario = this.listaTiposHUNombres[indexTipo]
            
            this.dialogActualizacion = true
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
        verificarMiembro(email){
            let flag = true
            if(!email){ 
                flag = false; 
            }
            let pos = this.listaMiembrosCorreos.indexOf(email);
            if(pos === -1) { 
                flag = false; 
            }
            return flag
        }
            
        
    }
}
    
</script>
<style>
</style>
            