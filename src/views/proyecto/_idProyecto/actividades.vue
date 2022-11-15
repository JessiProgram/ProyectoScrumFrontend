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
            <h3>Registro de actividades de la Historia de usuario</h3>
            <v-simple-table class="mt-5">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Titulo
                            </th>
                            <th class="text-left">
                                Descripcion
                            </th>
                            <th class="text-left">
                                Horas Trabajadas
                            </th>
                            <th class="text-left">
                                Participante
                            </th>
                            <th class="text-left">
                                Eliminar esta actividad
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in actividades"
                            :key="index"
                        >
                            <td>{{ item.fields.titulo }}</td>
                            <td>{{ item.fields.descripcion }}</td>
                            <td>{{ item.fields.horasTrabajadas }}</td>
                            <td>{{ correo }}</td>
                            <td>
                                <v-btn
                                    class="mr-3"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    @click="openDialogEliminarActividad(item)"
                                >
                                    <v-icon dark>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-dialog
            v-model="dialogEliminacion"
            v-if="actividadSeleccionada"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar esta actividad?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará la actividad de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar esta actividad, escribe su titulo: 
                    <b>{{ actividadSeleccionada.fields.titulo }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminacion"
                        :label="actividadSeleccionada.fields.titulo"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminacion !== actividadSeleccionada.fields.titulo"
                        color="red"
                        text
                        @click="eliminarActividad()"
                    >
                        Eliminar Actividad
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
            idHistoria: -1,
            actividades: [],

            correo: '',
            dialogEliminacion: false,

            actividadSeleccionada: null,

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
                    text: `Product Backlog`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/product-backlog`,
                },
                {
                    text: `Actividad ${this.$route.params.idHistoria}`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/product-backlog/actividades/${this.$route.params.idHistoria}`,
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
        let idToken = this.$store.state.usuario.idToken


        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        try {

            let resP = await this.axios.get(`/proyecto/?q=${this.idProyecto}`, config)
            this.proyecto = resP.data[0]

        } catch (error) {
            console.log(error)
            if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
        }
        this.obtenerActividad()

    },
    methods:{
        openDialogRestaurarHistoria(data){
            this.historialSeleccionado = data
            this.dialogRestaurar = true
        },

        async obtenerActividad(){
            let idToken = this.$store.state.usuario.idToken


            // Llamamos al backend
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {

                let res = await axios.get(`/historiasUsuario/actividad/listar?idProyecto=${this.idProyecto}&idHistoria=${this.idHistoria}`, config)

                this.actividades = res.data

                this.buscarCorreo(this.actividades[0].fields.participante)

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

        openDialogEliminarActividad(data){
            this.actividadSeleccionada = data
            this.dialogEliminacion = true
        },

        async eliminarActividad(){

            try {
                let idToken = this.$store.state.usuario.idToken


                // Llamamos al backend
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
                    }
                }

                await axios.delete(`/historiasUsuario/actividad?idProyecto=${this.idProyecto}&idHistoria=${this.idHistoria}&idActividad=${this.actividadSeleccionada.pk}`, config)

                this.dialogEliminacion = false

                this.obtenerActividad()
                    
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }

            } 

        },
        async buscarCorreo(idParticipante){
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            
            try {
                const res = await this.axios.get(`/participantes/?idParticipante=${idParticipante}`, config)

                let usuario = res.data[0]
          
                this.correo = usuario.fields.email
            } catch (error) {
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        }
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